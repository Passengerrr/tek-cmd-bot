const db = require("fera.db");
const roles = require("../../../_BOOT/roles.json")
const { MessageEmbed } = require("discord.js")
module.exports.execute = async (client, message, args) => {
    if (!message.member.roles.cache.has(roles.BotCommands) && !message.member.hasPermission('ADMINISTRATOR')) return;
    let embed = new MessageEmbed().setColor("RED")
    let executor = message.member
	  let cezaid = db.get(`cezaid.${message.guild.id}`);
    let cezaID = Number (args[0]);
    if (!cezaID) return message.channel.send("Geçerli bir ceza numarası belirtmelisin.").then(x => x.delete({timeout: 5000}))
    let punishment = db.fetch(`punishments.${cezaID}.${message.guild.id}`) || {};
    let victim = client.users.fetch(punishment.kisi) || punishment.kisi;
    if (cezaid < cezaID) return message.channel.send(`Belirtilen ID'de ceza bulunamadı son ceza numarası: ${cezaid}`)
    if (cezaid >= cezaID) return message.channel.send(embed.setDescription(`<@!${victim.id || punishment.kisi}> kullanıcısının \`#${cezaID}\` ID'li ceza bilgisi.\n──────────────────────────────────────────\n\n\`•\` Ceza Numarası \`#${cezaID}\`\n \`•\` Ceza Alan Uye: ${victim.id || punishment.kisi}\n \`•\` Komut bilgisi: ${punishment.komut}\n\n\n \`•\` Ceza Tarihi: ${punishment.zaman}\n \`•\` Sebep: ${punishment.sebep}`))
  };

  
  module.exports.configuration = {
    name: "ceza",
    aliases: ['cezainfo'],
    usage: "",
    description: ""
  };
