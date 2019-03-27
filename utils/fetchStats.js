const fetch = require('node-fetch');

function fetchTeamStats(team) {
  return team.map(async player => {
    const tag = player.replace('#', '-');
    const res = await fetch(`https://ow-api.com/v1/stats/pc/us/${tag}/profile`);
    const stats = await res.json();
    const rating = stats.private ? 'Private' : stats.rating;
    return {
      player,
      rating,
    };
  });
}
