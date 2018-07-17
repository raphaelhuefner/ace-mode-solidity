const path = require('path');
const { execSync } = require('child_process');

const PROJECTDIR = __dirname;

function dir(relativePath) {
  return path.join(PROJECTDIR, relativePath);
}

function run(commandLine, workingDir = '') {
  let options = {
    encoding: 'utf-8',
    cwd: dir(workingDir)
  };
  return execSync(commandLine, options);
}

module.exports = { dir, run };
