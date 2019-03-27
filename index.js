require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();

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

client.on('message', message => {
  if (message.author === client.user) {
    return;
  }
  if (message.content.startsWith('!OD matchup') && checkMessageCategory(message)) {
    const week = message.content.split(' ')[2];
    if (!parseInt(week)) {
      message.reply('Matchup count must be a number, try again!');
      return;
    }
    message.channel.send(`OPEN DIV STATS ${week}`);
  }
});

function checkMessageCategory(message) {
  const category = message.channel.parent.name;
  return teams[category.toUpperCase()];
}

client.login(process.env.TOKEN);
