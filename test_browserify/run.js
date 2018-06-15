const gatherTokenizations = require('./gather-tokenizations.js');
const readFilePromise = require('fs-readfile-promise');
const test = require('tape');

const DATADIR = __dirname + '/data';

async function runTests() {
  const tokenizations = await gatherTokenizations();
  Object.keys(tokenizations).forEach(async key => {
    let actualTokenization = tokenizations[key];
    let expectedTokenizationFileName = `${DATADIR}/${key}.json`;
    let expectedTokenization = JSON.parse(await readFilePromise(expectedTokenizationFileName));
    test(`Testing Solidity code snippet "${key}.sol".`, t => {
      t.plan(1);
      t.deepEqual(actualTokenization, expectedTokenization);
    });
  });
}

runTests();
