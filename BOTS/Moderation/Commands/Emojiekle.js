const Discord = require("discord.js");
const roles = require("../../../_BOOT/roles.json")
module.exports.execute = (client, message, args) => {
  if(message.member.roles.cache.has(roles.ustytcommands) && message.member.hasPermission("ADMINISTRATOR"))
    return message.channel.send(
      "⛔ Bu komutu kullanabilmek için `Emojileri yönet` yetkisine sahip olmalısınız"
    );
  let link = args[0];
  let isim = args[1];
  let guild = message.guild;
  if (!link)
    return message.channel.send("Emojinin alınacağı linki girmelisin.");
  if (!isim) return message.channel.send("Emojinin ismini belirlemedin");

  let embed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setAuthor("Emoji Eklendi", message.guild.iconURL)
    .setDescription(` **${isim} İsmiyle Yeni Bir Emoji Oluşturuldu.**`)
    .setFooter(`Komutu kullanan yetkili : ${message.author.username}`);

  guild
    .emojis.create(`${link}`, `${isim}`)
    .then(emoji => message.channel.send(embed));
};

module.exports.configuration = {
  name: "emojiekle",
  aliases: [],
  usage: "",
  description: ""
};