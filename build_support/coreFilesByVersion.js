const download = require('download');
const writeFilePromise = require('fs-writefile-promise');

const VERSIONS = [
  // legacy versions
  'v1.1.8', 'v1.1.9', 'v1.2.0', 'v1.2.1', 'v1.2.2', 'v1.2.3',
  // overlap with buildWithAce.js as a consistency check.
  'v1.2.4', 'v1.2.5', 'v1.2.6', 'v1.2.7', 'v1.2.8', 'v1.2.9', 'v1.3.0',
  'v1.3.1', 'v1.3.2', 'v1.3.3'
];

async function downloadCore(gitTag) {
  let url = `https://github.com/ajaxorg/ace-builds/raw/${gitTag}/src-noconflict/ace.js`;
  // let url = `https://github.com/ajaxorg/ace-builds/raw/${gitTag}/src-noconflict/mode-javascript.js`;
  return (await download(url)).toString('utf8');
}

function findDefines(code) {
  let defines = Object.create(null);
  let match;
  // ace.define("ace/mode/doc_comment_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
  let defineRe = /ace.define\("((?:\w|\/)+)",\["require","exports","module","((?:\w|\/|",")+)"\], function\(require, exports, module\) \{/g;
  while ((match = defineRe.exec(code)) !== null) {
    defines[match[1]] = JSON.parse(`["${match[2]}"]`);
  }

  // Pseudo-"empty" list of dependencies looks like this:
  // ace.define("ace/range",["require","exports","module"], function(require, exports, module) {
  defineRe = /ace.define\("((?:\w|\/)+)",\["require","exports","module"\], function\(require, exports, module\) \{/g;
  while ((match = defineRe.exec(code)) !== null) {
    defines[match[1]] = [];
  }

  // Beginning with 1.3.2 the list of dependencies is truly empty. Not even "require","exports","module" anymore.
  // ace.define("ace/mode/doc_comment_highlight_rules",[], function(require, exports, module) {
  defineRe = /ace.define\("((?:\w|\/)+)",\[\], function\(require, exports, module\) \{/g;
  while ((match = defineRe.exec(code)) !== null) {
    defines[match[1]] = [];
  }
  return defines;
}

async function run() {
  let coreFiles = Object.create(null);
  for (version of VERSIONS) {
    console.log(`Finding coreFiles of version ${version}.`)
    coreFiles[version] = findDefines(await downloadCore(version));
    let count = Object.keys(coreFiles[version]).length;
    console.log(`Found ${count} coreFiles.`)
  }

  let jsonFileContents = JSON.stringify(coreFiles, null, 2);
  jsonFileContents += "\n"; // to satisfy `git diff`
  await writeFilePromise(__filename + 'on', jsonFileContents);
}

run();
