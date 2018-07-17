const coreFilesByVersion = require('./coreFilesByVersion.json');

function ignoreCoreFileRequires(requires, version) {
  let coreFiles = coreFilesByVersion[version];
  let nonCoreFiles = [];
  for (let require of requires) {
    if (! coreFiles[require])
    nonCoreFiles.push(require);
  }
  return nonCoreFiles;
}

module.exports = ignoreCoreFileRequires;
