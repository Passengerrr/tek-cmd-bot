const Discord = require('discord.js');
const db = require('fera.db')
const ayar = require('../../../_BOOT/guards.json')
const emoji = require('../../../_BOOT/emojiler.json')
module.exports.execute = async (client, message, args) => {
    client.botroles = ayar.BotRoles

    if (ayar.Owners.includes(message.author.id)){

      message.react(emoji.yes)
      message.channel.send("Roller kapalı hale getirildi.");
      

        let yetkiler = ["ADMINISTRATOR", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD"]
        message.guild.roles.cache.filter(a => yetkiler.some(x => a.permissions.has(x)) == true && message.guild.members.cache.get(client.user.id).roles.highest.rawPosition > a.rawPosition && !client.botroles.includes(a.id)).map(yetkiliroller => {
          
            db.push("permission", {
              rolid: yetkiliroller.id,
              rolPermission: yetkiliroller.permissions.bitfield
            })

           yetkiliroller.setPermissions(0)

        })
        
    }     
}

module.exports.configuration = {
  name: "koruma",
  aliases: [],
  usage: "",
  description: ""
};