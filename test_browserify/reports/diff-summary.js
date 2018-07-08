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

  get summary() {
    return {
      filesWithDifferentLineCount: this.filesWithDifferentLineCount,
      linesWithDifferentTokenCount: this.linesWithDifferentTokenCount,
      tokensWithDifferentStringValue: this.tokensWithDifferentStringValue,
      buckets: this.buckets
    };
  }
}


class Stylist {
  constructor(summary) {
    this.summary = summary;
    this.lines = [];
  }

  print(...stuff) {
    this.lines = this.lines.concat(stuff);
  }

  _printLabel(input) {
    let label = input.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase();
    this.print(`<h1>${label}</h1>`);
  }

  style() {
    for (let statType of ['filesWithDifferentLineCount', 'linesWithDifferentTokenCount', 'tokensWithDifferentStringValue']) {
      let stats = this.summary[statType];
      if (0 == stats.size) continue;
      this._printLabel(statType);
      this.print(`<ul>`);
      for (let [id, {before, after}] of stats) {
        this.print(`<li>`);
        this.print(`${id}: <span class="before">${before}</span> &rarr; <span class="after">${after}</span>`);
        this.print(`</li>`);
      }
      this.print(`</ul>`);
      this.print(`<hr />`);
    }

    if (0 == this.summary.buckets.size) return;
    let sortableBuckets = [];
    for (let [bucketId, stat] of this.summary.buckets) {
      sortableBuckets.push(stat);
    }
    sortableBuckets.sort((a, b) => {
      if (a.before < b.before) return -1;
      if (a.before > b.before) return  1;

      if (a.after < b.after) return -1;
      if (a.after > b.after) return  1;

      if (a.total < b.total) return /*-1; // ASC*/  1; // DESC
      if (a.total > b.total) return /* 1; // ASC*/ -1; // DESC

      if (a.value < b.value) return -1;
      if (a.value > b.value) return  1;

      return 0;
    });
    this._printLabel('Changed Tokenizations');
    this.print(`<ul>`);
    for (let {value, before, after, total, files} of sortableBuckets) {
      let fileList = Array.from(files.values()).join(', ');
      this.print(`<li>`);
      this.print(`<span class="before">${before}</span> &rarr; <span class="after">${after}</span> n=${total}, <code>"${value}"</code>, [${fileList}]`);
      this.print(`</li>`);
    }
    this.print(`</ul>`);
    this.print(`<hr />`);
  }

  get output() {
    return this.lines.join("\n");
  }
}

async function run() {
  const stats = new Stats();
  const tokenizations = {};
  for (dataSetId of ['old', 'new']) {
    tokenizations[dataSetId] = await fetch(`./${dataSetId}-tokenizations.json`).then(res => res.json());
  }
  for (let key of Object.keys(tokenizations['new'])) {
    stats.gather(key, tokenizations['old'][key], tokenizations['new'][key]);
  }

  const stylist = new Stylist(stats.summary);
  stylist.style();
  document.getElementById('report').innerHTML = stylist.output;
}

run();
