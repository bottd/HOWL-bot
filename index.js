require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
  if (message.author === client.user) {
    return;
  }
  if (message.content === "!OD matchup") {
    message.channel.send("OPEN DIV STATS");
  }
});

client.login(`${process.env.TOKEN}`);
