const { MessageEmbed } = require("discord.js");
const db = require("fera.db");
const moment = require("moment");
const roles = require("../../../_BOOT/roles.json")
module.exports.execute = async (client, message, args) => {
    let embed = new MessageEmbed().setColor('RANDOM').setTimestamp()
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[1])
    let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]) || message.guild.roles.cache.find(s => s.name.toLowerCase().includes(args[1]))
    if (!uye) return message.channel.send(`Bir Kullanıcı Etiketlemelisin.`)
    if (!rol) return message.channel.send(`Bir Rol Belirtmelisin.`)
    if(args[0] == "al") {
    if (!uye.roles.cache.has(rol.id)) return message.channel.send(embed.setDescription("Bu kullanıcıda belirtilen rol bulunamadı"))
    if (uye.roles.cache.has(rol.id)) {
        uye.roles.remove(rol.id)
        message.channel.send(embed.setDescription(`${uye} Adlı Kullanıcıdan <@&${rol.id}> rolü alındı`))
    }
    }
    if(args[0] == "ver") {

    if (!uye.roles.cache.has(rol.id)) {
        uye.roles.add(rol.id)
        message.channel.send(embed.setDescription(`${uye} Adlı Kullanıcıya <@&${rol.id}> rolü verildi`))

    }
}
}
module.exports.configuration = {
    name: "Role",
    aliases: ['rol','r'],
    usage: "",
    description: ""
  };