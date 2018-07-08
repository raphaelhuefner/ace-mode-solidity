const gatherTokenizations = require('./gather-tokenizations.js');
const readFilePromise = require('fs-readfile-promise');
const writeFilePromise = require('fs-writefile-promise');

const DATADIR = __dirname + '/data';
const CACHEDIR = __dirname + '/cache';

async function writeNewTokenizations() {
  const tokenizations = await gatherTokenizations();
  let cacheFileContents = JSON.stringify(tokenizations, null, 2);
  cacheFileContents += "\n"; // to satisfy `git diff`
  await writeFilePromise(`${CACHEDIR}/new-tokenizations.json`, cacheFileContents);
  return Object.keys(tokenizations);
}

async function writeOldTokenizations(keys) {
  let tokenizations = {};
  for (key of keys) {
    let expectedTokenizationFileName = `${DATADIR}/${key}.json`;
    let expectedTokenization = JSON.parse(await readFilePromise(expectedTokenizationFileName));
    tokenizations[key] = expectedTokenization;
  }
  let cacheFileContents = JSON.stringify(tokenizations, null, 2);
  cacheFileContents += "\n"; // to satisfy `git diff`
  await writeFilePromise(`${CACHEDIR}/old-tokenizations.json`, cacheFileContents);
}

async function prep() {
  let keys = await writeNewTokenizations();
  await writeOldTokenizations(keys);
}

prep();
