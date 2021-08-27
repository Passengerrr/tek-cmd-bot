const Discord = require("discord.js");
const db = require("fera.db")
const system = require("../../../_BOOT/system.json")
const tokens = require("../../../_BOOT/tokens.json")
const roles = require("../../../_BOOT/roles.json")
const channels = require("../../../_BOOT/channels.json")
const extendss = require("../../../_BOOT/extends.json")
const client = global.client;


module.exports = async (message, client, member) => {

    let mateasımmm = message.guild.channels.cache.get(channels.messageDelete)
    if(mateasımmm) {
      if (message.author.bot || message.channel.type == "dm") return;
    const mtsEmB = new Discord.MessageEmbed().setTimestamp()
      if (message.attachments.first()) {
    mateasımmm.send(mtsEmB.setAuthor(`${message.author.tag} | Fotoğraf Silindi`, message.author.avatarURL()).setDescription(`<#${message.channel.id}> kanalında <@!${message.author.id}> tarafından bir fotoğraf silindi.\n───────────────────────────────────────────────\n\n\`\`\`> ${message.attachments.first().proxyURL}\`\`\``).setColor("RED").setThumbnail(message.member.avatarURL));
        } else {
    mateasımmm.send(mtsEmB.setAuthor(`${message.author.tag} | Mesaj Silindi`, message.author.avatarURL()).setDescription(`<#${message.channel.id}> kanalında <@!${message.author.id}> tarafından bir mesaj silindi.\n───────────────────────────────────────────────\n> ${message.content}`).setColor("RED").setThumbnail(message.member.avatarURL));
        }}
    
}


module.exports.configuration = {
  name: "messageDelete"
}