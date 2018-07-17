const recast = require('recast');
const readFilePromise = require('fs-readfile-promise');
const writeFilePromise = require('fs-writefile-promise');

const project = require('../project.js');

async function exampleAst(fileNameStem) {
  let code = await readFilePromise(project.dir(`lib/ace/mode/${fileNameStem}.js`));
  let ast = recast.parse(code);
  let jsonFileContents = JSON.stringify(ast, null, 2);
  jsonFileContents += "\n"; // to satisfy `git diff`
  await writeFilePromise(project.dir(`build_cache/${fileNameStem}-ast.json`), jsonFileContents);
}

exampleAst('solidity');
exampleAst('solidity_highlight_rules');
