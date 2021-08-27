const { MessageEmbed } = require("discord.js");
const roles = require("../../../_BOOT/roles.json")

module.exports.execute = async (client, message, args) => {
    if(!message.member.roles.cache.get(roles.ustcommandsrole) && !message.member.hasPermission('ADMINISTRATOR')) return;
    let embed = new MessageEmbed().setTitle(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor("RANDOM").setTimestamp();
    if (!message.member.hasPermission("ADMINISTRATOR")) return;
    let miktar = Number (args[0]);
    if (miktar > 2160) return message.channel.send(`2160 saniyeden fazla hız tanıyamazsın`)
    message.channel.setRateLimitPerUser(miktar).catch();
    message.channel.send(`Kanal mesaj hızı ${miktar} saniye olarak ayarlandı`)
};

module.exports.configuration = {
  name: "slowmode",
  aliases: [],
  usage: "",
  description: ""
};