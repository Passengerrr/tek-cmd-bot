const { MessageEmbed } = require("discord.js");
const db = require("fera.db");
const moment = require("moment");
const roles = require("../../../_BOOT/roles.json")

module.exports.execute = async(client, message, args) => {

  if(!message.member.roles.cache.get(roles.ustcommandsrole) && !message.member.hasPermission('ADMINISTRATOR')) return;

    let embed = new MessageEmbed().setColor('RANDOM').setTimestamp()
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!uye) return message.channel.send(embed.setDescription(`${message.author}, Bir kullanıcı etiketlemelisin.`)).then(qwe => qwe.delete({ timeout: 5000 }))
    if (uye) {
        db.delete(`kayıt.${uye.id}.t`)
        db.delete(`kayıt.${uye.id}.k`)
        db.delete(`kayıt.${uye.id}.e`)
        message.channel.send(embed.setDescription(`${uye} Üyesinin Kayıt Verileri Sıfırlandı`)).catch().then(sj => sj.delete({ timeout: 15000 }))
    }

}


module.exports.configuration = {
  name: "teyit-sıfırla",
  aliases: [],
  usage: "",
  description: ""
};