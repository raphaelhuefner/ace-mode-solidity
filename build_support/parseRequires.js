const recast = require('recast');
const AstTraversal = require('./astTraversal.js');

function parseRequires(code) {
  let requires = [];
  let ast = recast.parse(code);
  let traversal = new AstTraversal(ast);
  traversal.on("CallExpression", (node, stack, ast) => {
    if (
      ('Identifier' == node.callee.type)
      &&
      ('require' == node.callee.name)
      &&
      (1 === node.arguments.length)
      &&
      ('Literal' === node.arguments[0].type)
      &&
      ('string' === typeof node.arguments[0].value)
    ) {
      requires.push(node.arguments[0].value);
    }
  });
  traversal.start();
  return requires;
}

module.exports = parseRequires;
