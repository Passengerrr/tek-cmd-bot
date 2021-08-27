const Discord = require('discord.js');
const db = require('fera.db')
const ayar = require('../../../_BOOT/guards.json')
const emoji = require('../../../_BOOT/emojiler.json')

module.exports.execute = async (client, message, args) => {

    if (ayar.Owners.includes(message.author.id)){

    
    
        let data = db.fetch("rols") || [];
    message.guild.roles.cache.forEach(a => {
      let rol = data.filter(b => b.rolid == a.id)
      if(rol.length < 1) return;
      a.setPermissions(rol[0].rolPermission)
    })
message.react(emoji.yes)
message.channel.send("Roller aktif hale getirildi.");


    }     
}

module.exports.configuration = {
  name: "korumakapat",
  aliases: ["korumaoff"],
  usage: "",
  description: ""
};