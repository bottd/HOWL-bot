const fetch = require('node-fetch');
const utf8 = require('utf8');

function fetchTeamStats(team) {
  return Promise.all(
    team.map(async player => {
      const tag = player.replace('#', '-').split(' ')[0];
      const res = await fetch(
        utf8.encode(`https://ow-api.com/v1/stats/pc/us/${tag}/profile`),
      );
      const stats = await res.json();
      const rating = stats.rating || 'Private';
      return {
        player,
        rating,
      };
    }),
  );
}

module.exports = { fetchTeamStats };
