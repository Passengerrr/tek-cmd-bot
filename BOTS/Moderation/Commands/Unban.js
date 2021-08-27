const { MessageEmbed } = require("discord.js");
const db = require("fera.db");
const channels = require("../../../_BOOT/channels.json")
const roles = require("../../../_BOOT/roles.json")
module.exports.execute = async (client, message, args) => {
    let embed = new MessageEmbed().setColor("WHITE").setTimestamp();
    if (!message.member.roles.cache.has(roles.CezalıSpear) && !message.member.hasPermission("ADMINISTRATOR")) return;
  if (!args[0] || isNaN(args[0])) return message.channel.send("Geçerli bir kullanıcı IDsi girmelisin.").then(x => x.delete({timeout: 5000}));
  let victim = await client.users.fetch(args[0]);
  if (victim) {
    message.guild.members.unban(victim.id).catch(err => message.channel.send("Belirtilen ID numarasına sahip bir ban bulunamadı!"))
    let bans = db.get("bans") || [];
    if (bans.some(yasak => yasak.id === victim.id)) db.set("bans", bans.filter(x => x.id !== victim.id));
    if(channels.cezaaflog && client.channels.cache.has(channels.cezaaflog)) client.channels.cache.get(channels.cezaaflog).send(embed.setDescription(`${victim} (\`${victim.id}\`) adlı üyenin banı kaldırıldı.`));
  } else {
    message.channel.send("Geçerli bir kullanıcı IDsi girmelisin.").then(x => x.delete({timeout: 5000}));
  };
};

module.exports.configuration = {
  name: "unban",
  aliases: [],
  usage: "",
  description: ""
};