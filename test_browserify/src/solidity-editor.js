var ace = require('brace');
require('../../build/remix-ide/mode-solidity.js');
var soliditySnippets = require('../cache/solidity-snippets.js');

var editor = ace.edit('editor');
editor.getSession().setMode('ace/mode/solidity');

function getTokenization(editor, soliditySnippets) {
  var tokenization = {};
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
  return tokenization;
}

function logTokenization(tokenization) {
  console.log('tokenization', JSON.stringify(tokenization, null, 2))
}

function shouldRunTokenization() {
  return (
    ! document.location.search
    ||
    (-1 == document.location.search.indexOf("do_not_run_tokenization=true"))
  );
}

if (shouldRunTokenization()) {
  logTokenization(getTokenization(editor, soliditySnippets));
}
