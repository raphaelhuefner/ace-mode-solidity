const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const semver = require('semver');

const project = require('../project.js');

function git(subCommand) {
  return project.run('git ' + subCommand, 'build_cache/ace');
}

let createdDuringThisScriptRun = false;

function createOrRefresh(force) {
  if (createdDuringThisScriptRun && ! force) {
    return;
  }
  try {
    fs.accessSync(project.dir('build_cache/ace'), fs.constants.R_OK | fs.constants.W_OK);
    git('fetch --all');
    // git('pull --all');
  } catch (err) {
    // console.log(err);
    project.run('git clone git@github.com:ajaxorg/ace.git ./build_cache/ace');
  }
  createdDuringThisScriptRun = true;
}

function getAllVersions() {
  let gitTags = git('tag -l').split('\n').map(x => x.trim()).filter(Boolean);
  gitTags = gitTags.filter(gitTag => {
    let cleanVersion = semver.coerce(gitTag);
    cleanVersion = cleanVersion ? cleanVersion : semver.coerce('0.0.0');
    return (
      (gitTag == 'v' + cleanVersion.toString()) // exclude things like "cloud9"
    );
  });
  return gitTags;
}

function getNewVersions(oldestVersion) {
  return (
    getAllVersions()
      .filter(gitTag => {
        return semver.gte(semver.coerce(gitTag), oldestVersion);
      })
      .sort(semver.rcompare)
    );
}

let lastVersionSetDuringThisScriptRun = null;

function setVersion(gitTag, install, force) {
  if (
    (! force)
    &&
    (gitTag == lastVersionSetDuringThisScriptRun)
  ) {
    return;
  }
  project.run('rm -rf ./build/*', 'build_cache/ace');
  project.run('rm -rf ./package-lock.json', 'build_cache/ace');
  project.run('rm -rf ./tool/package-lock.json', 'build_cache/ace');
  git('checkout -- .');
  git('clean -ffd');
  git(`checkout ${gitTag}`);
  if (install) {
    project.run('npm install', 'build_cache/ace');
    project.run('npm install', 'build_cache/ace/tool');
  }
  lastVersionSetDuringThisScriptRun = gitTag;
}

module.exports = { git, createOrRefresh, getAllVersions, getNewVersions, setVersion };
