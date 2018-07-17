/**
 * Re-created ACE build process for older versions <=1.2.3
 */

const path = require('path');

const download = require('download');
const readFilePromise = require('fs-readfile-promise');
const solveDependencies = require('dependency-solver').solve;

const project = require('../project.js');
const stopBuild = require('./stopBuild.js');
const localAce = require('./localAceRepository.js');
const writeFile = require('./writeFile.js');
const parseRequires = require('./parseRequires.js');
const normalizeRequires = require('./normalizeRequires.js');
const ignoreCoreFileRequires = require('./ignoreCoreFileRequires.js');
const renderCode = require('./renderCode.js');
const getExportsSuffix = require('./getExportsSuffix.js');

// Build for older ACE versions, as far back as the code that was found in the
// version of `mode-solidity.js` which was included with Remix IDE originally.
// (I.e. ACE 1.1.8)
const VERSIONS = [
  // legacy versions
  'v1.1.8', 'v1.1.9', 'v1.2.0', 'v1.2.1', 'v1.2.2', 'v1.2.3',
  // overlap with buildWithAce.js as a consistency check.
  'v1.2.4', 'v1.2.5', 'v1.2.6', 'v1.2.7', 'v1.2.8', 'v1.2.9', 'v1.3.0',
  'v1.3.1', 'v1.3.2', 'v1.3.3'
];

async function checkoutFile(fileId, gitTag) {
  localAce.createOrRefresh();
  localAce.setVersion(gitTag, false);
  return (await readFilePromise(project.dir(`build_cache/ace/lib/${fileId}.js`))).toString('utf8');
}

async function downloadFile(fileId, gitTag) {
  let url = `https://github.com/ajaxorg/ace/raw/${gitTag}/lib/${fileId}.js`;
  return (await download(url)).toString('utf8');
}

async function loadFile(fileId, gitTag) {
  if ('ace/mode/solidity' == fileId) {
    return (await readFilePromise(project.dir('lib/ace/mode/solidity.js'))).toString('utf8');
  }
  if ('ace/mode/solidity_highlight_rules' == fileId) {
    return (await readFilePromise(project.dir('lib/ace/mode/solidity_highlight_rules.js'))).toString('utf8');
  }

  // return await downloadFile(fileId, gitTag);
  return await checkoutFile(fileId, gitTag);
}

class DependencyCollector {
  constructor(version) {
    this.version = version;
    this.deps = {};
    this.depsIncludingCore = {};
  }
  async collect(fileId) {
    if (this.deps[fileId]) {
      return;
    }
    let code = await loadFile(fileId, this.version);
    let requires;
    try {
      requires = parseRequires(code);
    }
    catch (err) {
      stopBuild('DependencyCollector parseRequires()', err, fileId, code, 14);
    }
    requires = normalizeRequires(fileId, requires);
    this.depsIncludingCore[fileId] = requires;
    this.deps[fileId] = ignoreCoreFileRequires(requires, this.version);
    for (let require of this.deps[fileId]) {
      await this.collect(require);
    }
  }
  async start(fileId) {
    await this.collect(fileId);
  }
  getDependencies() {
    return this.deps;
  }
  getDependenciesIncludingCore() {
    return this.depsIncludingCore;
  }
}

const varieties = [
  {
    destination: 'src',
    defineNamespace: null,
    requireName: 'require'
  },
  {
    destination: 'src-noconflict',
    defineNamespace: 'ace',
    requireName: 'require'
  },
  {
    destination: 'src-brace',
    defineNamespace: 'ace',
    requireName: 'acequire'
  }
];

async function build(language, version) {
  let collector = new DependencyCollector(version);
  let mainFileId = `ace/mode/${language}`;
  await collector.start(mainFileId);
  let deps = collector.getDependencies();
  let dependenciesIncludingCore = collector.getDependenciesIncludingCore();
  let orderedFileIds = solveDependencies(deps);
  for (let variety of varieties) {
    let parts = [];
    for (let fileId of orderedFileIds) {
      let code = await loadFile(fileId, version);
      if (! dependenciesIncludingCore[fileId]) {
        stopBuild('buildLegacy() build() deficient dependenciesIncludingCore', language, version, variety, fileId, dependenciesIncludingCore, deps, orderedFileIds, 16);
      }
      code = renderCode(code, fileId, dependenciesIncludingCore[fileId], variety.defineNamespace, variety.requireName);
      parts.push(code);
    }
    let output = parts.join('\n\n') + '\n';
    output += getExportsSuffix(version, mainFileId, variety.defineNamespace);
    let outputFilename = project.dir(`build/legacy/${version}/${variety.destination}/mode-${language}.js`);
    await writeFile(outputFilename, output);
  }
}

async function buildLegacy() {
  for (version of VERSIONS) {
    for (language of ['solidity', 'javascript']) {
      await build(language, version);
    }
  }
}

module.exports = buildLegacy;

if (! module.parent) {
  buildLegacy();
}
