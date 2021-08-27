const { MessageEmbed } = require("discord.js");
const db = require("fera.db");
const moment = require("moment");
const roles = require("../../../_BOOT/roles.json")

module.exports.execute = async(client, message, args) => {

    if(!message.member.roles.cache.has(roles.BotCommands) && !message.member.hasPermission(8)) return; 

    let embed = new MessageEmbed().setColor('RANDOM').setTimestamp()

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!member) return;
    
    if (member.id === client.user.id) return message.channel.send(`Beni Kayıt Edemezsin!`).then(m => m.delete({ timeout: 7000 }))
    if (member.id === message.author.id) return message.channel.send(`Kendini Kayıt Edemezsin!`).then(m => m.delete({ timeout: 7000 }))
    let data = await db.fetch(`isimler.${member.id}`)

        
    message.channel.send(embed.setDescription(`${member} kullanıcıya <@&${roles.ManRole}> rolleri verildi.`)).then(m => m.delete({ timeout: 12000 }))

    setTimeout(function(){  
      member.roles.add(roles.ManRole)
      member.roles.add(roles.Manroles)
    }, 3000);
    
      let cinsiyet = (message.guild.roles.cache.get(roles.ManRole).name)
      let name = `${member.displayName}`
      await db.add(`kayıt.${message.author.id}.e`, 1)
      await db.add(`kayıt.${message.author.id}.t`, 1)

    db.push(`isimler.${member.id}`, { 
      isim: name,
      kayıtsekil: `(${cinsiyet})`
    })
}
module.exports.configuration = {
  name: "Erkek",
  aliases: ['man',"erkek","e"],
  usage: "",
  description: ""
};