const { MessageEmbed, MessageAttachment } = require("discord.js");
const db = require("fera.db");
const moment = require("moment");
const roles = require("../../../_BOOT/roles.json")

module.exports.execute = async(client, message, args) => {

  if(!message.member.roles.cache.get(roles.BotCommands) && !message.member.hasPermission('ADMINISTRATOR')) return;

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.author;
    let embed = new MessageEmbed().setTimestamp().setColor("RANDOM")

        let erkek = await db.get(`kayıt.${member.id}.e`)
        let toplam = await db.get(`kayıt.${member.id}.t`)
        let kız = await db.get(`kayıt.${member.id}.k`)
        if(toplam === null) toplam = "0"
        if(toplam === undefined) toplam = "0"
        if(erkek === null) erkek = "0"
        if(erkek === undefined) erkek = "0"
        if(kız === null) kız = "0"
        if(kız === undefined) kız = "0"


        message.channel.send(embed.setDescription(`
        ${member}, Kullanıcısının teyit bilgileri; Toplam kayıtların: **${toplam}** (Erkek: **${erkek}** Kız: **${kız}**)`)
        ).catch().then(qwe => qwe.delete({ timeout: 20000 }))

}

module.exports.configuration = {
  name: "teyit",
  aliases: [],
  usage: "",
  description: ""
};