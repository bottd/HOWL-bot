const puppeteer = require('puppeteer');

async function getRosters(team, round) {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(
      `https://battlefy.com/overwatch-open-division-north-america/2019-overwatch-open-division-season-2-north-america/5c7ccfe88d004d0345bbd0cd/stage/5c929d720bc67d0345180aa6/bracket/${round}`,
    );
    await page.waitForSelector('td.td-match-number');

    const matchSelector = await page.evaluate(team => {
      const teams = document.querySelectorAll('div.team-name');
      let matchSelector = '';
      for (let i = 0; i < teams.length; i++) {
        if (teams[i].innerText.trim() === team) {
          matchSelector = teams[i].parentElement.parentElement.classList[1];
        }
      }
      return matchSelector;
    }, team);
    await page.click(`.${matchSelector}`);
    await page.waitForSelector('span.team-name');
    const roster = await page.evaluate(team => {
      let rosterElements;
      const headers = document.querySelectorAll('h4');
      for (let i = 0; i < headers.length; i++) {
        let text = headers[i].innerText;
        if (text !== team && text !== "Delete Tournament") {
          rosterElements = headers[i].parentElement.parentElement.querySelectorAll('td.player-in-game-name');
          break;
        }
      }
      return [...rosterElements].map(player => player.innerText);
    }, team);
    await browser.close();
    return roster;
  } catch (error) {
    console.log(error);
  }
}

getRosters('5280 Elite', 4);
