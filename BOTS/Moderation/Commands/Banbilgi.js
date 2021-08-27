const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const roles = require("../../../_BOOT/roles.json")
const db = require("fera.db");

module.exports.execute = async(client, message, args) => {
  
  let member = client.users.fetch(args[0])
  let embed = new MessageEmbed().setColor(`RANDOM`).setAuthor(message.author.tag, message.member.user.avatarURL({dynamic:true}))
  if (!message.member.roles.cache.has(roles.BanSpear) && !message.member.hasPermission('ADMINISTRATOR')) return;
  if (!member) return message.channel.send("Geçerli bir ban yemiş kullanıcı ID'si belirtmelisin")
  let datax = db.get(`sicil.${member.id}.${message.guild.id}`) || [];
  let cpuan = db.get(`cezapuan.${member.id}.${message.guild.id}`);
  
  
  if(!args[0] || isNaN(args[0])) return message.channel.send(`Geçerli bir ban yemiş kullanıcı ID'si belirtmelisin!`).then(x => x.delete({timeout: 5000}));;
  return message.guild.fetchBan(args.slice(0).join(' ')).then(({ user, reason }) => message.channel.send(embed.setDescription(`Banlanan Üye: ${user.tag} (${user.id})\nBan Sebebi: ${reason ? reason : "Belirtilmemiş!"}\n─────────────────────────────────────────\nKullanıcının Cezapuanı: ${cpuan || '0'} Verilen Ceza Sayısı: ${datax.length || '0'}`))).catch(err => message.channel.send(embed.setDescription("Belirtilen ID numarasına sahip bir ban bulunamadı!")).then(x => x.delete({timeout: 5000})));
    
}


module.exports.configuration = {
  name: "banbilgi",
  aliases: [],
  usage: "",
  description: ""
};  
