'use strict';
const fs = require('fs');
const browserify = require('browserify');
const writeFilePromise = require('fs-writefile-promise');
const collectSoliditySnippets = require('./collect-solidity-snippets.js');

async function writeSoliditySnippets() {
  let soliditySnippets = await collectSoliditySnippets();
  await writeFilePromise(__dirname + '/cache/solidity-snippets.js', soliditySnippets);
}

async function build() {
  await writeSoliditySnippets();

  let browserify_opts = {
    debug: true,
    bare: true,
    basedir: __dirname
  }

  browserify(browserify_opts)
    .require(require.resolve('./cache/solidity-snippets.js'), { basedir: __dirname })
    .require(require.resolve('../build/remix-ide/mode-solidity.js'), { basedir: __dirname })
    .require(require.resolve('./src/solidity-editor.js'), { entry: true, basedir: __dirname })

    .bundle()
    .pipe(fs.createWriteStream(__dirname + '/cache/bundle.js'));
}

build();
