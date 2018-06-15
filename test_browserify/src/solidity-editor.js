var ace = require('brace');
require('../../mode-solidity.js');
var testData = require('../test-data.js');

var editor = ace.edit('editor');
editor.getSession().setMode('ace/mode/solidity');

Object.keys(testData).forEach(function (key) {
  editor.setValue(testData[key].solidity);
  editor.clearSelection();
  var l = editor.getSession().getLength();
  var tokens = [];
  for (var i = 0; i < l; i++) {
    tokens.push(editor.getSession().getTokens(i));
  }
  testData[key].tokenization = tokens;
});

console.log('tokenization', JSON.stringify(testData, null, 2))
