/**
 * Inject solidity.js into ACE build process to package into mode-solidity.js .
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const semver = require('semver');

const project = require('../project.js');
const localAce = require('./localAceRepository.js');

// The oldest ACE version which builds on node v8.11.3:
const OLDEST_ACE_VERSION = semver('1.2.4');

function loopOverAceVersions(aceVersions) {
  for (aceVersion of aceVersions) {
    build(aceVersion);
  }
}

function build(aceVersion) {
  console.log('#'.repeat(80));
  console.log(`Start building ${aceVersion} .`);
  localAce.setVersion(aceVersion, true);
  project.run('node tool/add_mode.js Solidity "sol"', 'build_cache/ace');
  project.run('cp lib/ace/mode/solidity* build_cache/ace/lib/ace/mode/');
  project.run('./Makefile.dryice.js normal', 'build_cache/ace');
  for (variety of ['src', 'src-noconflict', 'src-min', 'src-min-noconflict']) {
    project.run(`mkdir -p ./build/${aceVersion}/${variety}`);
    project.run(`cp ./build_cache/ace/build/${variety}/mode-solidity.js ./build/${aceVersion}/${variety}/`);
    project.run(`cp ./build_cache/ace/build/${variety}/mode-javascript.js ./build/${aceVersion}/${variety}/`); // To check for consistency with buildLegacy.js
  }
  console.log(`Finished building ${aceVersion} .`);
  console.log('#'.repeat(80));
}

function buildWithAce() {
  localAce.createOrRefresh();
  let aceVersions = localAce.getNewVersions(OLDEST_ACE_VERSION);
  console.log('ACE versions to build mode-solidity.js for:', aceVersions.join(', '));
  loopOverAceVersions(aceVersions);
}

module.exports = buildWithAce;

if (! module.parent) {
  buildWithAce();
}
