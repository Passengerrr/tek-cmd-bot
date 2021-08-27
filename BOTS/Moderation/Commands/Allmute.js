const Discord = require("discord.js");
const ayar = require("../../../_BOOT/roles.json");

module.exports.execute = async (client, message, args) => {
let executor = message.member
let embed = new Discord.MessageEmbed().setColor("RANDOM").setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
if(!message.member.roles.cache.has(ayar.ustytcommands) && !message.member.hasPermission("ADMINISTRATOR")) return;
let kanal = message.guild.channels.cache.get(args[0])
if(!kanal) return message.channel.send(`Geçerli bir kanal id belirtmelisin.`);
kanal.members.filter(a => !a.hasPermission("ADMINISTRATOR")).array().forEach(üyeler => {
  üyeler.voice.setMute(true)
});
kanal.createInvite().then(invite =>
message.channel.send(embed.setDescription(`
<#${kanal.id}> Toplu Susturma işlemi.Kanal'a gitmek için [tıklaman](https://discord.gg/${invite.code}) yeterli
\`\`\`
> KanalID: (${kanal.id})\n> KanalName: ${kanal.name}\n> Kanal Kullanıcı Sayısı: ${kanal.members.size} > Susturulan: ${kanal.members.filter(a => !a.hasPermission("ADMINISTRATOR")).size}\`\`\``))
)

}

module.exports.configuration = {
  name: "allmute",
  aliases: [],
  usage: "",
  description: ""
};