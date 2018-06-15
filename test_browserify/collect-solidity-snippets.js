'use strict';
const path = require('path');
const enumerateFiles = require('enumerate-files');
const readFilePromise = require('fs-readfile-promise');

const DATADIR = __dirname + '/data';


async function solFilesToModuleCode(solFileNames) {
  let solCodeCollection = {};
  for (let solFileName of solFileNames) {
    let solCode = await readFilePromise(solFileName);
    let name = path.basename(solFileName, '.sol');
    solCodeCollection[name] = solCode.toString();
  }
  return 'module.exports = ' + JSON.stringify(solCodeCollection, null, 2) + ';';
}

async function collectSolCode() {
  let files = Array.from(await enumerateFiles(DATADIR));
  let solFileNames = files.filter(file => /\.sol$/.test(file));
  return await solFilesToModuleCode(solFileNames);
}

module.exports = collectSolCode
