const Discord = require('discord.js');
const db = require('fera.db')

module.exports.execute = async (client, message, args) => {
    if (message.author.id === "607926085551783968"){

	
	message.channel.send(`Botlar yeniden başlatıldı.`).then(message => {
    console.log(`BOT: Botlar yeniden başlatılıyor.`);

    process.exit(0);
    
  })
}
}

module.exports.configuration = {
  name: "reload",
  aliases: ['reboot'],
  usage: "",
  description: ""
};