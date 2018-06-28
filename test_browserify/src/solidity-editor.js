var ace = require('brace');
require('../../mode-solidity.js');
var soliditySnippets = require('../cache/solidity-snippets.js');
var tokenization = {};

var editor = ace.edit('editor');
editor.getSession().setMode('ace/mode/solidity');

Object.keys(soliditySnippets).forEach(function (key) {
  editor.setValue(soliditySnippets[key]);
  editor.clearSelection();
  var l = editor.getSession().getLength();
  var tokens = [];
  for (var i = 0; i < l; i++) {
    tokens.push(editor.getSession().getTokens(i));
  }
  tokenization[key] = tokens;
});

console.log('tokenization', JSON.stringify(tokenization, null, 2))
