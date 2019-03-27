require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const scraper = require('./utils/scraper');
const { fetchTeamStats } = require('./utils/fetchStats');

const teams = {
  '5280 ELITE': '5280 Elite',
  '5280 ACADEMY': '5280 Academy',
  '5280 PINK (ACADEMY)': '5280 Pink',
  '5280 BLUE': '5280 Blue',
  '5280 RED': '5280 Red',
  '5280 DARK': '5280 Dark',
  GENERAL: '5280 Elite',
};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
  if (message.author === client.user) {
    return;
  }
  if (
    message.content.startsWith('!OD matchup') &&
    checkMessageCategory(message)
  ) {
    try {
      const round = message.content.split(' ')[2];
      const team = teams[message.channel.parent.name.toUpperCase()];
      if (!parseInt(round)) {
        message.reply('Matchup count must be a number, try again!');
        return;
      }
      const matchStats = await scraper.getRosters(team, round);
      matchStats.roster = await fetchTeamStats(matchStats.roster);
      matchStats.round = round;
      const embed = createEmbed(matchStats, team);
      message.channel.send({ embed });
    } catch (error) {
      message.reply(
        'Error fetching stats, has this match been scheduled?',
      );
    }
  }
});

function checkMessageCategory(message) {
  const category = message.channel.parent.name;
  return teams[category.toUpperCase()];
}

function createEmbed(stats, team) {
  const embed = new Discord.RichEmbed()
    .setTitle(`${team} match #${stats.round} vs. ${stats.name}`)
    .setDescription(`Match schedueled for ${stats.date} PST`)
    .setColor(0x00ae86)
    .setThumbnail(
      'https://cdn.discordapp.com/attachments/546536122407190530/546536510309269514/artboard_1.png',
    );
  stats.roster.forEach(player => {
    if (player.player.split(' ').length === 2) {
      player.player = `*${player.player.split(' ')[0]}`;
    }
    embed.addField(player.player, `SR: ${player.rating}`, true);
  });
  return embed;
}

client.login(process.env.TOKEN);
