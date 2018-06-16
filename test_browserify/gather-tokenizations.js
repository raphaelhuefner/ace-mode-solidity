const puppeteer = require('puppeteer');
const express = require('express');

module.exports = function gatherTokenizations() {
  return new Promise((gatherResolve, gatherReject) => {
    const server = express()
      .use(express.static(__dirname + '/public/'))
      .listen(3000, async () => {
        const browser = await puppeteer.launch({args: ['--no-sandbox']});
        const page = await browser.newPage();

        const outputPromise = new Promise((outputResolve, outputReject) => {
          page.on('console', async msg => {
            if (
              (2 == msg.args().length)
              &&
              ('tokenization' == await msg.args()[0].jsonValue())
            ) {
              let tokenizationJSON = await msg.args()[1].jsonValue();
              outputResolve(JSON.parse(tokenizationJSON));
            }
          });
        });

        await page.goto('http://localhost:3000/index.html', {waitUntil: 'networkidle0'});

        let tokenization = await outputPromise;

        await browser.close();
        server.close();
        gatherResolve(tokenization);
      });
  });
}
