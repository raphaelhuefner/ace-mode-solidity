const gatherTokenizations = require('./gather-tokenizations.js');
const readFilePromise = require('fs-readfile-promise');
const writeFilePromise = require('fs-writefile-promise');
const chalk = require('chalk');

const DATADIR = __dirname + '/data';
const CACHEDIR = __dirname + '/cache';

class Stats {
  constructor() {
    this.filesWithDifferentLineCount = new Map();
    this.linesWithDifferentTokenCount = new Map();
    this.tokensWithDifferentStringValue = new Map();
    this.buckets = new Map();
  }

  _getBucketId(tokenizedValue, oldToken, newToken) {
    return [tokenizedValue, oldToken, newToken].join('#');
  }

  _collectDifferentLineCount(fileName, oldTokenization, newTokenization) {
    if (oldTokenization.length != newTokenization.length) {
      let stats = {
        before: oldTokenization.length,
        after: newTokenization.length
      }
      this.filesWithDifferentLineCount.set(fileName, stats);
      return true;
    }
    return false;
  }

  _collectDifferentTokenCount(fileName, lineIndex, oldTokens, newTokens) {
    if (oldTokens.length != newTokens.length) {
      let lineId = `${fileName}.sol@${lineIndex + 1}`;
      let stats = {
        before: oldTokens.length,
        after: newTokens.length
      }
      this.linesWithDifferentTokenCount.set(lineId, stats);
      return true;
    }
    return false;
  }

  _collectDifferentTokenStringValue(fileName, lineIndex, tokenIndex, charPos, oldToken, newToken) {
    if (oldToken.value != newToken.value) {
      let posId = `${fileName}.sol@${lineIndex + 1}:${charPos + 1}`;
      let stats = {
        before: oldToken.value,
        after: newToken.value
      }
      this.tokensWithDifferentStringValue.set(posId, stats);
      return true;
    }
    return false;
  }

  _visitEachToken(fileName, lineIndex, tokenIndex, charPos, oldToken, newToken) {
    if (this._collectDifferentTokenStringValue(fileName, lineIndex, tokenIndex, charPos, oldToken, newToken)) return;
    if (oldToken.type == newToken.type) return;
    let bucketId = this._getBucketId(oldToken.value, oldToken.type, newToken.type);
    if (! this.buckets.has(bucketId)) {
      let init = {
        value: oldToken.value,
        before: oldToken.type,
        after: newToken.type,
        total: 0,
        files: new Set()
      };
      this.buckets.set(bucketId, init);
    }
    let stat = this.buckets.get(bucketId);
    stat.total++;
    stat.files.add(fileName);
    this.buckets.set(bucketId, stat);
  }

  _visitEachLine(fileName, oldTokenization, newTokenization) {
    oldTokenization.forEach((oldTokens, lineIndex) => {
      let newTokens = newTokenization[lineIndex];
      if (this._collectDifferentTokenCount(fileName, lineIndex, oldTokens, newTokens)) return;
      let charPos = 1;
      oldTokens.forEach((oldToken, tokenIndex) => {
        let newToken = newTokens[tokenIndex];
        this._visitEachToken(fileName, lineIndex, tokenIndex, charPos, oldToken, newToken);
        charPos += oldToken.value.length;
      });
    });
  }

  gather(fileName, oldTokenization, newTokenization) {
    if (this._collectDifferentLineCount(fileName, oldTokenization, newTokenization)) return;
    this._visitEachLine(fileName, oldTokenization, newTokenization);
  }

  _sprintLabel(input) {
    let output = '';
    let label = input.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase();
    output += '='.repeat(label.length) + "\n";
    output += label + "\n";
    output += '='.repeat(label.length) + "\n";
    return output;
  }

  get summary() {
    let output = '';
    for (let statType of ['filesWithDifferentLineCount', 'linesWithDifferentTokenCount', 'tokensWithDifferentStringValue']) {
      let stats = this[statType];
      if (0 == stats.size) continue;
      output += this._sprintLabel(statType);
      for (let [id, {before, after}] of stats) {
        output += `${chalk.blue(id)}: ${chalk.red(before)} => ${chalk.green(after)}\n`;
      }
      output += '#'.repeat(80) + "\n";
    }

    if (0 == this.buckets.size) return output;
    output += this._sprintLabel('Changed Tokenizations');
    let sortableBuckets = [];
    for (let [bucketId, stat] of this.buckets) {
      sortableBuckets.push(stat);
    }
    sortableBuckets.sort((a, b) => {
      if (a.before < b.before) return -1;
      if (a.before > b.before) return  1;

      if (a.after < b.after) return -1;
      if (a.after > b.after) return  1;

      if (a.total < b.total) return /*-1*/  1;
      if (a.total > b.total) return /* 1*/ -1;

      if (a.value < b.value) return -1;
      if (a.value > b.value) return  1;

      return 0;
    });
    for (let {value, before, after, total, files} of sortableBuckets) {
      let fileList = Array.from(files.values()).join(', ');
      output += `${chalk.red(before)} => ${chalk.green(after)} n=${chalk.yellow(total)}, "${chalk.blue(value)}", [${fileList}]\n`;
    }
    output += '#'.repeat(80) + "\n";

    return output;
  }
}

function getCacheFilename() {
  return `${CACHEDIR}/new-tokenizations.json`;
}

async function writeCache() {
  const tokenizations = await gatherTokenizations();
  let cacheFileContents = JSON.stringify(tokenizations, null, 2);
  cacheFileContents += "\n"; // to satisfy `git diff`
  await writeFilePromise(getCacheFilename(), cacheFileContents);
}

async function runStats() {
  const stats = new Stats();
  let tokenizations = JSON.parse(await readFilePromise(getCacheFilename()));
  for (let key of Object.keys(tokenizations)) {
    let jsonFileName = `${DATADIR}/${key}.json`;
    let oldTokenization = JSON.parse(await readFilePromise(jsonFileName));
    let newTokenization = tokenizations[key];
    stats.gather(key, oldTokenization, newTokenization);
  }
  console.log(stats.summary);
}

async function run() {
  await writeCache();
  await runStats();
}

run();
