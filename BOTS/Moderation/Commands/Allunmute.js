const Discord = require("discord.js");
const ayar = require("../../../_BOOT/roles.json");

module.exports.execute = async (client, message, args) => {
let executor = message.member
let embed = new Discord.MessageEmbed().setColor("RANDOM").setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
if(!message.member.roles.cache.has(ayar.ustytcommands) && !message.member.hasPermission("ADMINISTRATOR")) return;
let kanal = message.guild.channels.cache.get(args[0])
if(!kanal) message.channel.send(`Geçerli bir kanal id belirtmelisin.`)
kanal.members.filter(a => !a.hasPermission("ADMINISTRATOR")).array().forEach(üyeler => {
  üyeler.voice.setMute(false)
});

kanal.createInvite().then(invite =>
  message.channel.send(embed.setDescription(`
  <#${kanal.id}> Toplu Susturma kaldır işlemi.Kanal'a gitmek için [tıklaman](https://discord.gg/${invite.code}) yeterli
  \`\`\`
  > KanalID: (${kanal.id})\n> KanalName: ${kanal.name}\n> Kanal Kullanıcı Sayısı: ${kanal.members.size} > Susturulması açılan: ${kanal.members.filter(a => !a.hasPermission("ADMINISTRATOR")).size}\`\`\``))
  )
}


module.exports.configuration = {
  name: "allunmute",
  aliases: [],
  usage: "",
  description: ""
};