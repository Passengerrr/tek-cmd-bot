const Discord = require('discord.js');
const db = require('fera.db')
const ayar = require('../../../_BOOT/guards.json')
module.exports.execute = async (client, message, args) => {
    client.botroles = ayar.BotRoles

    if (ayar.Owners.includes(message.author.id)){


      message.channel.send("Bütün yetkiler kapatıldı , Backup işlemi durduruldu , Guardlar aktif edildi.");
      console.log(`Guard Systeam: Bütün yetkiler kapatıldı , Backup işlemi durduruldu , Guardlar aktif edildi.`);


        let yetkiler = ["ADMINISTRATOR", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "VIEW_AUDIT_LOG"]
        message.guild.roles.cache.filter(a => yetkiler.some(x => a.permissions.has(x)) == true && message.guild.members.cache.get(client.user.id).roles.highest.rawPosition > a.rawPosition && !client.botroles.includes(a.id)).map(yetkiliroller => {
          
            db.push("permission1", {
              rolid: yetkiliroller.id,
              rolPermission: yetkiliroller.permissions.bitfield
            })

           yetkiliroller.setPermissions(0)

        })
        
        db.set("guarddurum","false")    
        db.set("backupdurum","true")    

    }     
}

module.exports.configuration = {
  name: "ohal",
  aliases: ["guard","bakım","backup-mod"],
  usage: "",
  description: ""
};