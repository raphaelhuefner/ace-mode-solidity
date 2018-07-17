const recast = require('recast');
const recastBuilders = recast.types.builders;

const AstTraversal = require('./astTraversal.js');
const stopBuild = require('./stopBuild.js');

/**
 * Remove comments with the same RegExp as in the original ACE build process.
 *
 * Copied from build_cache/ace/node_modules/architect-build/module-deps.js
 * @see https://www.npmjs.com/package/architect-build/v/0.1.0
 * @see https://github.com/c9/architect-build/blob/17268dce6559e05548b53143a91a9d83d0e19e40/module-deps.js#L348
 */
function removeLicenceComments(code) {
  return code.replace(/(?:(;)|\n|^)\s*\/\*[\d\D]*?\*\/|(\n|^)\s*\/\/.*/g, "$1");
}

/**
 * Adjust whitespace in AST pretty printer output to satisfy `git diff`.
 *
 * Until I figured out how to configure the AST pretty printer, we have to make
 * do with a RegExp solution.
 */
function fixWhitespaceInDefineCall(code) {
  let isDefineCallLineRe = /^(\w+\.)?define\(.*function\(\w+, exports, module\) \{$/g;
  let lines = code.split('\n');
  let lineIndex = 0;
  for (line of lines) {
    if (isDefineCallLineRe.test(line)) {
      line = line.replace(/", \["/g, '",["');
      line = line.replace(/", "/g, '","');
      lines[lineIndex] = line;
    }
  }
  return lines.join('\n');
}

function renderCode(code, fileId, dependenciesIncludingCore, defineNamespace, requireName) {
  requireName = requireName ? requireName : 'require';
  let defineCalleeNode;
  if (defineNamespace) {
    defineCalleeNode = recastBuilders.memberExpression(
      recastBuilders.identifier(defineNamespace),
      recastBuilders.identifier('define'),
      false
    );
  }
  let fileIdNode = recastBuilders.literal(fileId);
  let singleDepsNodes = [];
  for (dep of ['require', 'exports', 'module']) {
    singleDepsNodes.push(recastBuilders.literal(dep));
  }
  try {
    for (dep of dependenciesIncludingCore) {
      singleDepsNodes.push(recastBuilders.literal(dep));
    }
  }
  catch (err) {
    stopBuild('renderCode dependenciesIncludingCore', err, fileId, dependenciesIncludingCore, 17);
  }
  let depsNode = recastBuilders.arrayExpression(singleDepsNodes);
  code = removeLicenceComments(code).trim();
  let ast;
  try {
    ast = recast.parse(code);
  }
  catch (err) {
    stopBuild('renderCode recast.parse()', err, fileId, dependenciesIncludingCore, defineNamespace, requireName, code, 13);
  }
  let traversal = new AstTraversal(ast);

  // Transform `define()` function call.
  traversal.on('CallExpression', (node, stack, ast) => {
    if (
      ('Identifier' == node.callee.type)
      &&
      ('define' == node.callee.name)
    ) {
      if (
        (1 !== node.arguments.length)
        ||
        ('FunctionExpression' !== node.arguments[0].type)
        ||
        (null !== node.arguments[0].id)
        ||
        ('Identifier' !== node.arguments[0].params[0].type)
      ) {
        stopBuild('AST traversal: Unable to process call to `define()`:', fileId, dependenciesIncludingCore, defineNamespace, requireName, 12);
      }
      // Rename `require()` function like in https://www.npmjs.com/package/brace
      // Here we rename the definition of `require()`.
      node.arguments[0].params[0].name = requireName;

      // Add namespace to `define()` function call.
      if (defineCalleeNode) {
        node.callee = defineCalleeNode;
      }

      // Add extra arguments to `define()` function call.
      node.arguments.unshift(fileIdNode, depsNode);
    }
  });

  // Rename `require()` function like in https://www.npmjs.com/package/brace
  // Here we rename all function calls for `require()`.
  traversal.on('CallExpression', (node, stack, ast) => {
    if (
      ('Identifier' == node.callee.type)
      &&
      ('require' == node.callee.name)
    ) {
      if (
        (1 !== node.arguments.length)
        ||
        ('Literal' !== node.arguments[0].type)
        ||
        ('string' !== typeof node.arguments[0].value)
      ) {
        throw Error('Unable to process call to `require()`.');
      }
      node.callee.name = requireName;
    }
  });


  traversal.start();

  // This should only affect printing of modified AST nodes.
  let recastPrintOptions = {
    wrapColumn: 10 * 1024 // Allow really long lines for `define()` calls.
  };

  let newCode = recast.print(traversal.getAst(), recastPrintOptions).code;
  newCode = fixWhitespaceInDefineCall(newCode);
  return newCode;
}

module.exports = renderCode;
