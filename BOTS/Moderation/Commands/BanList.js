const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const roles = require("../../../_BOOT/roles.json")
module.exports.execute = async(client, message, args) => {
  
  let embed = new MessageEmbed().setColor(`RANDOM`).setAuthor(message.author.tag, message.member.user.avatarURL({dynamic:true}))
  let embed2 = new MessageEmbed().setColor(`RANDOM`).setAuthor(message.author.tag, message.member.user.avatarURL({dynamic:true})).setFooter(client.user.username,client.user.avatarURL({dynamic:true}))
  if (!message.member.roles.cache.has(roles.BanSpear) && !message.member.hasPermission('ADMINISTRATOR')) return;
  message.guild.fetchBans().then(bans => {
  if(bans.size > 30){
  message.channel.send(`\`\`\`⛔ Toplam ${bans.size} adet yasaklanmış kullanıcı bulunuyor.\n\n(Ban Sayısı 30 Ve Üstünde İse Gösteremiyorum.)\`\`\``);
  }
  if(bans.size < 30){
  message.channel.send(`\`\`\`⛔ Toplam "${bans.size}" adet yasaklanmış kullanıcı bulunuyor.\n\n ${bans.size > 0 ? bans.map(z => `${z.user.tag.replace("`", "")} - ${z.user.id}`).join("\n") : "Bu Sunucuda Mevcut Yasaklama Bulunmuyor."}\`\`\``);
  }
  })
}


module.exports.configuration = {
  name: "banlist",
  aliases: [],
  usage: "",
  description: ""
};  
