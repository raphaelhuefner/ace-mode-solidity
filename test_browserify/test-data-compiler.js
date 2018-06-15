'use strict';
const path = require('path');
const enumerateFiles = require('enumerate-files');
const readFilePromise = require('fs-readfile-promise');

const DATADIR = __dirname + '/data';


function mapSolFilesToJsonFiles(files) {
  let mappedFiles = new Map();
  for (let file of files) {
    if (/\.sol$/.test(file)) {
      let jsonFileName = file.replace(/\.sol$/, '.json');
      if (! files.has(jsonFileName)) {
        throw Error(`Could not find corresponding JSON file "${jsonFileName}" for "${file}".`);
      }
      mappedFiles.set(file, jsonFileName);
    }
  }
  return mappedFiles;
}

async function filesMapToModuleCode(map) {
  let testData = {};
  for (let [solFileName, jsonFileName] of map) {
    let solCode = await readFilePromise(solFileName);
    let tokenizationJson = await readFilePromise(jsonFileName);
    let name = path.basename(solFileName, '.sol');
    testData[name] = {
      solidity: solCode.toString(),
      tokenization: JSON.parse(tokenizationJson)
    };
  }
  return 'module.exports = ' + JSON.stringify(testData, null, 2) + ';';
}

async function compileTestData() {
  let files = await enumerateFiles(DATADIR);
  let map = await mapSolFilesToJsonFiles(files);
  let code = await filesMapToModuleCode(map);
  return code;
}

module.exports = {compileTestData}
