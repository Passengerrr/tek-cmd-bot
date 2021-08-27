const { MessageEmbed } = require("discord.js");
const db = require("fera.db");
const channels = require("../../../_BOOT/channels.json")
const system = require("../../../_BOOT/system.json")
const roles = require("../../../_BOOT/roles.json")
module.exports.execute = async (client, message, args) => {

    let embed = new MessageEmbed().setTitle(message.member.displayName, message.author.avatarURL({dynamic: true}))
    if (!message.member.roles.cache.has(roles.CezalıSpear) && !message.member.hasPermission("ADMINISTRATOR")) return;
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    let reason = args.splice(1).join(" ");
    if (!member || reason.length < 1) return message.channel.send(`Komutu doğru kullanmalısın! \`Örnek: ${system.Moderationprefix || ""}unjail @üye [sebep]\``).then(x => x.delete({timeout: 10000}));
    if (member.user.bot) return message.channel.send(`Bu komutu botlar üzerinde kullanamazsın!`).then(x => x.delete({timeout: 10000}));
    if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send(`Bu üyenin yetkileri senden yüksek veya aynı yetkide olduğunuz için işlemi gerçekleştiremiyorum.`).then(x => x.delete({timeout: 10000}));


    setTimeout(function(){  
      member.roles.cache.has(roles.Booster) ? member.roles.set([roles.Booster, roles.Unregister]) : member.roles.set([roles.Unregisterü]);
    }, 3000);

      let isim = member.user.username.replace(/[^a-z^0-9^ü^ç^ğ^ö^ı]/ig, "");

      if (isim.length > 0) {   
          setTimeout(function(){  
            member.setNickname(`• ${isim}`)
      }, 3000);
      } else {
          setTimeout(function(){  
            member.setNickname(`• ${isim}`)
      }, 3000);
      }
    message.channel.send(`${member} adlı üyenin cezası ${reason} sebebi ile kaldırıldı.`);
    if (message.guild.channels.cache.has(channels.cezaaflog)) message.guild.channels.cache.get(channels.cezaaflog).send(`${member} (\`${member.id}\`) adlı üyenin jaili ${message.author} adlı yetkili tarafından \`${reason}\` sebebi ile kaldırıldı.`)
  
  //DATABASE İŞLEMLER
    let jails = db.get("jails") || [];
    if (jails.some(x => x.id === member.id)) db.set("jails", jails.filter(x => x.id !== member.id));
    let jstatus = db.get(`jstatus.${member.id}.${message.guild.id}`)
    db.set(`jstatus.${member.id}.${message.guild.id}`, "false")
};

module.exports.configuration = {
  name: "unjail",
  aliases: [],
  usage: "",
  description: ""
};