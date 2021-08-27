const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const roles = require("../../../_BOOT/roles.json")
module.exports.execute = async (client, message, args) => {




if (!message.member.voice.channel) {
return message.reply("Ses kanalında olman lazım!");
}
const filter = (reaction, user) => {
return ['✅', '❌'].includes(reaction.emoji.name) && user.id === kullanıcı.id;
};
let kullanıcı = message.mentions.members.first()
if (!kullanıcı) return message.channel.send('Bir Kullanıcı Belirt.');
if (!message.member.roles.cache.has(roles.BotCommands) && !message.member.hasPermission('ADMINISTRATOR')) return message.member.voice.setChannel(kullanıcı.voice.setChannel(message.member.voice.channelID)).catch(err => {}) && message.channel.send(new MessageEmbed().setDescription(`Başarıyla <@${kullanıcı.id}> adlı üye kanalınıza taşındı.`).setAuthor(message.author.tag, message.member.user.avatarURL({dynamic: true})).setColor(`RANDOM`)).then(msg => msg.delete({timeout: 5000}))

let member = message.guild.member(kullanıcı);

if (!member.voice.channel) return message.channel.send('Etiketlenen Kullanıcı Ses Kanalında Değil.').then(m => m.delete,{timeout: 5000});

const voiceChannel = message.member.voice.channel.id;
if (!voiceChannel) return;
  
let log = new Discord.MessageEmbed()
.setColor("#7289D")
.setDescription(`${kullanıcı}, ${message.author} \`${message.member.voice.channel.name}\` Odasına Çekmek İstiyor. Kabul ediyormusun ?`)
  
let mesaj = await message.channel.send(log)
await mesaj.react("✅")
await mesaj.react("❌")
mesaj.awaitReactions(filter, {
max: 1,
time: 60000,
errors: ['time']
}).then(collected => {
const reaction = collected.first();
if (reaction.emoji.name === '✅') {
let kabul = new Discord.MessageEmbed()
.setColor("0x348f36")
.setDescription(`${kullanıcı} Odaya Çekilme Teklifini Onayladı`)
message.channel.send(kabul)
kullanıcı.voice.setChannel(message.member.voice.channel.id)
} else {
let shit = new Discord.MessageEmbed()
.setColor("0x800d0d")
.setDescription(`${kullanıcı} Odaya Çekilme Teklifini Reddetti`).catch(err => m.edit(new MessageEmbed().setColor(`RANDOM`).setAuthor(message.author.tag, message.member.user.avatarURL({dynamic:true})).setDescription(`Seçim için belirtilen sürede tepkiye tıklanmadığı için işlem iptal edildi.`)) && m.reactions.removeAll() && message.react(cfg.react.red))
message.channel.send(shit)
}
})
}


module.exports.configuration = {
  name: "çek",
  aliases: [],
  usage: "",
  description: ""
};