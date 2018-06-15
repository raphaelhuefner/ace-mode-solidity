const gatherTokenizations = require('./gather-tokenizations.js');
const writeFilePromise = require('fs-writefile-promise');

const DATADIR = __dirname + '/data';

async function overwrite() {
  const tokenizations = await gatherTokenizations();
  Object.keys(tokenizations).forEach(async function (key) {
    let jsonFileName = `${DATADIR}/${key}.json`;
    let jsonFileContents = JSON.stringify(tokenizations[key], null, 2);
    jsonFileContents += "\n"; // to satisfy `git diff`
    await writeFilePromise(jsonFileName, jsonFileContents);
  });
}

overwrite();
