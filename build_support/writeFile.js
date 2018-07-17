const path = require('path');

const writeFilePromise = require('fs-writefile-promise');
const mkdirp = require('mkdirp-promise');

async function writeFile(name, contents) {
  await mkdirp(path.dirname(name));
  await writeFilePromise(name, contents);
}

module.exports = writeFile;
