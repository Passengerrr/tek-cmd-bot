const Discord = require('discord.js');
const db = require('fera.db')
const ayar = require('../../../_BOOT/guards.json')

module.exports.execute = async (client, message, args) => {
    client.botroles = whitelist.BotRoles

    if (ayar.Owners.includes(message.author.id)){

    
    
        let data = db.fetch("permission1") || [];
    message.guild.roles.cache.forEach(a => {
      let rol = data.filter(b => b.rolid == a.id)
      if(rol.length < 1) return;
      a.setPermissions(rol[0].rolPermission)
    })
           db.set("guarddurum","false")    
           db.set("backupdurum","false")    

           message.channel.send("Bütün yetkiler açıldı , Backup işlemi açıldı , Guardlar aktif edildi.");
           console.log(`CMD: Bütün yetkiler açıldı , Backup işlemi açıldı , Guardlar aktif edildi.`);


    }     
}

module.exports.configuration = {
  name: "ohalkapat",
  aliases: [],
  usage: "",
  description: ""
};