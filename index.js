require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const scraper = require('./utils/scraper');
const { startPizzaOrder } = require('./utils/pizza');
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
  } else if (message.content === '!pizza' && message.channel.type === 'dm') {
    startPizzaOrder(message.author, message.channel);
  } else if (message.content.startsWith('!OD settings')) {
    const embed = new Discord.RichEmbed()
      .setColor(0x00ae86)
      .setThumbnail(
        'https://cdn.discordapp.com/attachments/546536122407190530/546536510309269514/artboard_1.png',
      )
      .addField(
        'Open Division Lobby Rules',
        'Presets: Competitive \nModes, All: Kill Cam Disabled \nModes, All: Skins Disabled \nModes, All: Game Mode Start – Manual \nLobby: Max Spectators 0 (unless spectators have been permitted by both Team Captains in writing before start of play) \nHeroes, Hero Roster: Disable any heroes not currently available in Competitive Play \n“Invite Only” must be selected within the Custom Game Lobby.',
      )
      .setFooter('Message @Landis#0870 with any questions or issues');
    message.channel.send({ embed });
  } else if (message.content.startsWith('!OD maps')) {
    const embed = new Discord.RichEmbed()
      .setTitle('Open Division Season 2 Map Pool')
      .setColor(0x00ae86)
      .setThumbnail(
        'https://cdn.discordapp.com/attachments/546536122407190530/546536510309269514/artboard_1.png',
      )
      .setFooter('Message @Landis#0870 with any questions or issues')
      .addField('1: Control', 'Lijang Tower, Nepal, Oasis')
      .addField('2: Hybrid', 'Hollywood, Numbani, Eichenwalde')
      .addField('3: Assault', 'Paris, Hanamura, Temple of Anubis')
      .addField('4: Escort', 'Watchpoint: Gibraltar, Junkertown, Dorado')
      .addField(
        '5: Control',
        'Losing team from Map 4 picks from the 2 remaining available Control maps',
      );
    message.channel.send({ embed });
  } else if (
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
      console.log(error.message);
      message.reply('Error fetching stats, has this match been scheduled?');
    }
  }
});

function checkMessageCategory(message) {
  const category = message.channel.parent.name;
  return teams[category.toUpperCase()];
}

function createEmbed(stats, team) {
  let sum = 0;
  let count = 0;
  const sortedRoster = stats.roster.sort((a, b) => {
    const ratingA = parseInt(a.rating) || 0;
    const ratingB = parseInt(b.rating) || 0;
    console.log(ratingA);
    console.log(ratingB);
    return ratingB - ratingA;
  });
  const embed = new Discord.RichEmbed()
    .setTitle(`${team} match #${stats.round} vs. ${stats.name}`)
    .setDescription(`Match schedueled for ${stats.date}`)
    .setColor(0x00ae86)
    .setThumbnail(
      'https://cdn.discordapp.com/attachments/546536122407190530/546536510309269514/artboard_1.png',
    )
    .setFooter('Message @Landis#0870 with any questions or issues');
  sortedRoster.forEach(player => {
    if (parseInt(player.rating)) {
      sum += parseInt(player.rating);
      count += 1;
    }
    if (player.player.split(' ').length === 2) {
      player.player = `*${player.player.split(' ')[0]}`;
    }
    embed.addField(player.player, `SR: ${player.rating}`, true);
  });
  embed
    .addBlankField()
    .addField('Average SR', `${Math.round(sum / count) || 'Unknown'}`)
    .setTimestamp();

  return embed;
}

client.login(process.env.TOKEN);
