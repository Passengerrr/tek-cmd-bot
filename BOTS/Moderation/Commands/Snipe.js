const { MessageEmbed } = require('discord.js');
const db = require('fera.db');
const moment = require("moment")
require('moment-duration-format');
const roles = require("../../../_BOOT/roles.json")

module.exports.execute = async(client, message, args) => {
  if(!message.member.roles.cache.get(roles.BotCommands) && !message.member.hasPermission('ADMINISTRATOR')) return;
  let embed = new MessageEmbed().setColor('RANDOM').setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
  let data = await db.get(`snipe.${message.guild.id}`)
  if (!data) return message.channel.send(embed.setDescription(`Sunucuya ait son silinen mesaj bulunamadı.`)).then(m => m.delete({ timeout: 7000 }) && message.delete({ timeout: 7000 }))
  let x = data.filter(s => s.guild === message.guild.id)
  if (!x) return message.channel.send(embed.setDescription(`Sunucuya ait son silinen mesaj bulunamadı.`)).then(m => m.delete({ timeout: 7000 }) && message.delete({ timeout: 7000 }))
  let mapped = x.map((data, index) => `\`>\` ${data.admin} (${data.adminid}) Tarafından ${moment.duration(Date.now() - data.tarih).format("D [gün], H [saat], m [dakika], s [saniye]")} saniye önce silinmiş.\nMesaj: ${data.msg}`).slice(data.length > 7 ? data.length - 7 : 0, data.length)

  message.channel.send(embed.setDescription(`Son silinen mesajlar aşağıda sıralanmıştır.\n\n${mapped.join("\n\n")}`)).then(msg => {
    msg.delete({ timeout: 10000 })
  })
}

module.exports.configuration = {
  name: "snipe",
  aliases: [],
  usage: "",
  description: ""
};
