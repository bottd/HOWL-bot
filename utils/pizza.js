const Discord = require('discord.js');
const pizzapi = require('dominos');

async function startPizzaOrder(user, channel) {
  let store;
  try {
    await user.send(
      'I can order you pizza a pizza from Dominos!  Start by giving me your street address.  Example:  ```700 Clark Ave, St. Louis, MO, 63102```',
    );
    const response = await channel.awaitMessages(() => true, {
      max: 1,
      time: 3000000,
      errors: ['time'],
    });
    const address = response.first().content;
    pizzapi.Util.findNearbyStores(address, 'Delivery', async function(
      storeData,
    ) {
      store = new pizzapi.Store({ ID: storeData.result.Stores[0].StoreID });
      store.getInfo(data => sendStoreInfo(channel, data.result));
      //store.getFriendlyNames(data => sendMenu(channel, data.result));
      console.log(store);
    });
  } catch (error) {
    console.log(error);
  }
}

async function sendHelp(channel) {
  const embed = new Discord.RichEmbed()
    .setColor(0x00ae86)
    .setTitle('Dominos Pizza Commands')
    .addField('!menu', 'Will print out all available menu items at this store')
    .addField('!addItem ____', 'Will add an item to your order')
    .addField('!complete', 'Will begin process to finalized and place order')
    .setThumbnail(
      'https://corporate.dominos.co.uk/Media/Default/Image%20Library/Image%20library%20-%20logos/RGB_White_Type_Tile_Only.png',
    );
  channel.send({ embed });
}

async function sendMenu(channel, menu, page = 1) {
  if (!menu.length) {
    return;
  }
  const embed = new Discord.RichEmbed()
    .setTitle(`Menu page ${page}`)
    .setColor('#7289da');
  for (let i = 0; i < 25; i++) {
    if (!menu[0]) {
      break;
    }
    const item = Object.entries(menu[0]);
    console.log(item);
    embed.addField(item[0][0], item[0][1]);
    menu.shift();
  }
  await channel.send({ embed });
  sendMenu(channel, menu, page + 1);
}

function sendStoreInfo(channel, store) {
  const embed = new Discord.RichEmbed()
    .setTitle(`Dominos: ${store.StreetName}`)
    .setDescription(`Phone: ${store.Phone}`)
    .addField('Getting Started', 'Use !help to see what commands you can use to begin building your order!  If you know what you want you can just get started')
    .setColor(0x00ae86)
    .setThumbnail(
      'https://corporate.dominos.co.uk/Media/Default/Image%20Library/Image%20library%20-%20logos/RGB_White_Type_Tile_Only.png',
    );
  channel.send({ embed });
}

module.exports = { startPizzaOrder };
