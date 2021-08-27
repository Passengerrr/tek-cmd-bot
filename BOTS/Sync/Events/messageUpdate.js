const Discord = require("discord.js");
const db = require("fera.db")
const system = require("../../../_BOOT/system.json")
const tokens = require("../../../_BOOT/tokens.json")
const roles = require("../../../_BOOT/roles.json")
const channels = require("../../../_BOOT/channels.json")
const extendss = require("../../../_BOOT/extends.json")
const client = global.client;

module.exports = async (oldMessage, newMessage) => {

    let mateaslog = oldMessage.guild.channels.cache.get(channels.messageUptade)
    const mateasEmB = new Discord.MessageEmbed().setTimestamp()
        if (oldMessage.author.bot) return;
        if (!oldMessage.guild) return;
        if (oldMessage.content == newMessage.content) return;
    
    mateaslog.send(mateasEmB.setAuthor(`${oldMessage.author.tag} | Mesaj Düzenlendi`, oldMessage.author.avatarURL()).setDescription(`<#${oldMessage.channel.id}> kanalında ${oldMessage.author.tag} -  tarafından bir mesaj güncellendi.
    ───────────────────────────────────────────────
    > Eski Mesaj: ${oldMessage.content}
    
    > Yeni Mesaj: ${newMessage.content}`).setColor("RED")
      
    );
    
}


module.exports.configuration = {
  name: "messageUpdate"
}