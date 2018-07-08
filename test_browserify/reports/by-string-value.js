class Stats {
  constructor() {
    this.buckets = new Map();
  }

  collect(dataSetId, tokenizations) {
    for (let snippetId of Object.keys(tokenizations)) {
      this.visitTokenization(dataSetId, snippetId, tokenizations[snippetId])
    }
  }

  visitTokenization(dataSetId, snippetId, tokenization) {
    tokenization.forEach((line, lineIndex) => this.visitLine(line, lineIndex, snippetId, dataSetId));
  }

  visitLine(line, lineIndex, snippetId, dataSetId) {
    line.forEach((token, tokenIndex) => this.visitToken(token, tokenIndex, lineIndex, snippetId, dataSetId));
  }

  visitToken(token, tokenIndex, lineIndex, snippetId, dataSetId) {
    let {value, type} = token;
    this.addToBucket([value, type, dataSetId, snippetId], {lineIndex, tokenIndex});
  }

  addToBucket(coordinates, value) {
    let buckets = this.buckets;
    for (let [dimension, coordinate] of coordinates.entries()) {
      let isLastDimension = (dimension == (coordinates.length - 1));
      if (! buckets.has(coordinate)) {
        buckets.set(coordinate, isLastDimension ? [] : new Map());
      }
      buckets = buckets.get(coordinate);
      if (isLastDimension) {
        buckets.push(value);
      }
    }
  }

  get summary() {
    return this.buckets;
  }
}


class Sorter {
  sort(summary) {
    let order = [];
    let ordered = new Map();
    for (let [value, types] of summary) {
      order.push({value, total:types.size});
    }
    order.sort((a, b) => {
      // sort `total` DESC
      if (a.total < b.total) return /*-1*/  1;
      if (a.total > b.total) return /* 1*/ -1;

      // sort `value` ASC
      if (a.value < b.value) return -1;
      if (a.value > b.value) return  1;

      return 0;
    });
    for (let {value, total} of order) {
      ordered.set(value, summary.get(value));
    }
    return ordered;
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

  styleTypes(types) {
    this.print(` (`);
    let types_list = [];
    for (let [type, dataSets] of types) {
      let dataSetClass = Array.from(dataSets.keys()).sort().join('-');
      types_list.push(`<span class="type ${dataSetClass}">${type}</span>`);
    }
    this.print(types_list.join(', '));
    this.print(`)`);
  }

  style() {
    this.print(`<ul>`);
    for (let [value, types] of this.summary) {
      let num_types = types.size;
      this.print(`<li>`);
      this.print(`${num_types}x`);
      this.print(` <code>&quot;${value}&quot;</code>`);
      this.styleTypes(types);
      this.print(`</li>`);
    }
    this.print(`</ul>`);
  }

  get output() {
    return this.lines.join("\n");
  }
}

async function run() {
  const stats = new Stats();
  for (dataSetId of ['old', 'new']) {
    let tokenizations = await fetch(`./${dataSetId}-tokenizations.json`).then(res => res.json());
    stats.collect(dataSetId, tokenizations);
  }
  const sorter = new Sorter();
  let sorted = sorter.sort(stats.summary);
  // console.log(sorted);

  const stylist = new Stylist(sorted);
  stylist.style();
  document.getElementById('report').innerHTML = stylist.output;
}

run();
