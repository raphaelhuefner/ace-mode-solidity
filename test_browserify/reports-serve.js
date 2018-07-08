const express = require('express');
const opn = require('opn');

const server = express()
  .use(express.static(__dirname + '/reports/'))
  .listen(3000, async () => {
    opn('http://localhost:3000/index.html');
  });

// server.close();
