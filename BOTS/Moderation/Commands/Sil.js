const Discord = require('discord.js');
const roles = require("../../../_BOOT/roles.json")

module.exports.execute = async (client, message, args) => {
let executor = message.member
if(!message.member.roles.cache.get(roles.ustcommandsrole) && !message.member.hasPermission('ADMINISTRATOR')) return;
if(!args[0]) return;
if(args[0] > 100) return;
message.channel.bulkDelete(args[0]);
return message.channel.send('Kanaldan '+`${args[0]}`+' adet mesaj silindi.').then(m => m.delete({ timeout: 7000 }))
};

module.exports.configuration = {
  name: "Sil",
  aliases: ["sil"],
  usage: "",
  description: ""
};