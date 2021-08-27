const { MessageEmbed } = require("discord.js");
const db = require("fera.db");
const moment = require("moment");
const channels = require("../../../_BOOT/channels.json")
const system = require("../../../_BOOT/system.json")
const roles = require("../../../_BOOT/roles.json")
const emoji = require("../../../_BOOT/emojiler.json")
module.exports.execute = async(client, message, args) => {

    if(!message.member.roles.cache.has(roles.BotCommands) && !message.member.hasPermission(8));

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    let embed = new MessageEmbed().setTimestamp().setColor('RANDOM')
    if (!member) return message.channel.send(embed.setDescription(`${message.author}, Bir Kullanıcı Etiketlemelisin.`)).then(m => m.delete({ timeout: 7000 }))

    if (member.id === client.user.id) return message.channel.send(embed.setDescription(`Beni Kayısıza atamazsın!`))
    if (member.id === message.author.id) return message.channel.send(embed.setDescription(`Kendini Kayıtsıza Atamazsın!`))
    setTimeout(function(){  
    member.roles.set([roles.Unregister])
  }, 5000);
    let isim = member.user.username.replace(/[^a-z^0-9^ü^ç^ğ^ö^ı]/ig, "");

    if (isim.length > 0) {   
        setTimeout(function(){  
          member.setNickname(`• ${isim}`)
    }, 3000);
    } else {
        setTimeout(function(){  
          member.setNickname(`• ${isim}`)
    }, 3000);
    }
    message.channel.send(embed.setDescription(`${member} Adlı Kullanıcı ${message.author} Tarafından Başarıyla Kayıtsıza Atıldı.`)).then(x => x.delete({ timeout: 7000 }))
}

module.exports.configuration = {
  name: "Unregister",
  aliases: ["unregister"],
  usage: "",
  description: ""
};