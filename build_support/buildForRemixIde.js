const project = require('../project.js');

const aceVersionForRemixIde = 'v1.1.8';

function buildForRemixIde() {
  project.run('mkdir -p build/remix-ide');
  project.run(`cp build/legacy/${aceVersionForRemixIde}/src-brace/mode-solidity.js build/remix-ide/mode-solidity.js`);
}

module.exports = buildForRemixIde;

if (! module.parent) {
  buildForRemixIde();
}
