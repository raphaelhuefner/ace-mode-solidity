'use strict';
const fs = require('fs');
const browserify = require('browserify');
const writeFilePromise = require('fs-writefile-promise');
const compileTestData = require('./test-data-compiler.js').compileTestData;

async function writeTestData() {
  let testData = await compileTestData();
  await writeFilePromise(__dirname + '/test-data.js', testData);
}

async function build() {
  await writeTestData();

  let browserify_opts = {
    debug: true,
    bare: true,
    basedir: __dirname
  }

  browserify(browserify_opts)
    .require(require.resolve('./test-data.js'), { basedir: __dirname })
    .require(require.resolve('../mode-solidity.js'), { basedir: __dirname })
    .require(require.resolve('./src/solidity-editor.js'), { entry: true, basedir: __dirname })

    .bundle()
    .pipe(fs.createWriteStream(__dirname + '/public/bundle.js'));
}

build();
