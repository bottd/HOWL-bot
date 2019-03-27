const puppeteer = require('puppeteer');

async function getRosters(team, round) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(
      `https://battlefy.com/overwatch-open-division-north-america/2019-overwatch-open-division-season-2-north-america/5c7ccfe88d004d0345bbd0cd/stage/5c929d720bc67d0345180aa6/bracket/${round}`,
    );
    await page.waitForSelector('td.td-match-number');

    const matchData = await page.evaluate(team => {
      let tableRow;
      const teamsTop = document.querySelectorAll('div.team-name');
      const teamsBottom = document.querySelectorAll('div.team-name-bottom');
      let selector = '';
      [...teamsTop, ...teamsBottom].forEach(element => {
        if (element.innerText === team) {
          selector = element.parentElement.parentElement.classList[1];
          tableRow = element.parentElement.parentElement;
        }
      });
      const date = tableRow.children[1].innerText.split(' ')[0];
      let enemyName;
      if (tableRow.children[3].innerText !== team) {
        enemyName = tableRow.children[3].innerText;
      } else if (tableRow.children[5].innerText !== team) {
        enemyName = tableRow.children[5].innerText;
      }
      return {
        date,
        name: enemyName,
        selector,
      };
    }, team);

    if (!matchData.selector) {
      return {};
    }
    await page.click(`.${matchData.selector}`);
    await page.waitForSelector('span.team-name');
    matchData.roster = await page.evaluate(team => {
      let rosterElements;
      const headers = document.querySelectorAll('h4');
      for (let i = 0; i < headers.length; i++) {
        let text = headers[i].innerText;
        if (text !== team && text !== 'Delete Tournament') {
          rosterElements = headers[
            i
          ].parentElement.parentElement.querySelectorAll(
            'td.player-in-game-name',
          );
          break;
        }
      }
      return [...rosterElements].map(player => player.innerText);
    }, team);
    await browser.close();
    delete matchData.selector;
    return matchData;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getRosters };
