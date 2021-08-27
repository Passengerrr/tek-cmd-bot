const Discord = require("discord.js")
const db = require("fera.db")
/**
 * @param {Client} client 
 * @param {Message} message 
 * @param {Array<String>} args 
 */
module.exports.execute = async (client, message, args) => {
let MateasEmb = new Discord.MessageEmbed().setAuthor(message.author.tag,message.author.displayAvatarURL({ dynamic: true }))
    if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(MateasEmb.setDescription(`**Bu komutu kullanmaya yetkin yetmiyor.**`)).then(x => x.delete({ timeout: 5000 }));
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!member) return message.channel.send(MateasEmb.setDescription(`Bir kullanıcı belirtmelisin.`)).then(x => x.delete({ timeout: 5000 }));
    let voiceChannel = member.voice.channel
    if(!voiceChannel) return message.channel.send(MateasEmb.setDescription(`Belirttiğin kişi ses kanalında bulunmuyor.`)).then(x => x.delete({ timeout: 5000 }));
let microphone = member.voice.selfMute ? "Kapalı" : "Açık";
let headphones = member.voice.selfDeaf ? "Kapalı" : "Açık";
let sestekiler = message.guild.channels.cache.get(voiceChannel.id).members.map(x => `${x.user} - \`${x.user.id}\``).join("\n")
    let voiceT = db.get(`voiceTime_${member.id}_${message.guild.id}`) 
    let time = client.tarihHesapla(voiceT) 

    message.channel.send(MateasEmb.setDescription(`
${member} kişisi <#${voiceChannel.id}> kanalında. **Mikrofonu ${microphone}**, **Kulaklığı ${headphones}**
\`\`\`Aktif Bilgiler:\`\`\`
<#${voiceChannel.id}> kanalına \`${time}\`  önce giriş yapmış.

`).setColor("RANDOM"))
    }

module.exports.configuration = {
  name: "nerede",
  aliases: ['n'],
  usage: "",
  description: ""
};