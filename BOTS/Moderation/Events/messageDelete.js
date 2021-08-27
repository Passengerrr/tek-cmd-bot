const client = global.client;
const db = require("fera.db")
const { MessageButton } = require('discord-buttons')
const Discord = require("discord.js")

module.exports = async (message,client,member) => {

    if (message.author.bot) return;
    db.push(`snipe.${message.guild.id}`, { msg: message.content, tarih: Date.now(), admin: message.member.displayName, adminid: message.member.id,  guild: message.guild.id })
}
module.exports.configuration = {
  name: "messageDelete"
}