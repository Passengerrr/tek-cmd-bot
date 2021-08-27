const { MessageEmbed } = require("discord.js");
const Discord = require('discord.js');
const db = require("fera.db");
const emoji = require("../../../_BOOT/emojiler.json")
const roles = require("../../../_BOOT/roles.json")
const channels = require("../../../_BOOT/channels.json")
const system = require("../../../_BOOT/system.json")
const moment = require("moment")
module.exports.execute = async (client, message, args) => {

  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor("RANDOM").setTimestamp();
  if (!message.member.roles.cache.has(roles.BanSpear) && !message.member.hasPermission("ADMINISTRATOR")) return;



    let bandb = db.get(`bandb.${message.author.id}.${message.guild.id}`);
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])   
    let memberfetch = client.users.fetch(args[0]);
    let reason = args.splice(1).join(" ");
    if (!member) return message.channel.send(`Geçerli bir kullanıcı belirtmelisin.`).then(x => x.delete({timeout: 10000}));
    if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send(`Bu üyenin yetkileri senden yüksek veya aynı yetkide olduğunuz için işlemi gerçekleştiremiyorum.`).then(x => x.delete({timeout: 10000}));
    if (!member || reason.length < 1) return message.channel.send(`Komutu doğru kullanmalısın! \`Örnek: ${system.Moderationprefix || ""}ban @member [sebep]\``).then(x => x.delete({timeout: 10000}));
    if(!reason) return message.channel.send(`${message.member} lütfen bir member belirtiniz.`)
    if (member.user.bot) return message.channel.send(`Bu komutu botlar üzerinde kullanamazsın!`).then(x => x.delete({timeout: 10000}));
    
    if (bandb >= 2) {
        if (message.guild.channels.cache.has(channels.yetkiasma)) message.guild.channels.cache.get(channels.yetkiasma).send(embed.setDescription(`${message.author} (\`${message.author.id}\`) adlı yetkili 30 dakikada 2 tane ban attığı için ban yetkisi alındı.`)).catch();
        message.member.roles.remove(roles.BanSpear).catch();
        db.delete(`bandb.${message.author.id}.${message.guild.id}`);
        return;
    }
    let atilanAy = moment(Date.now()).format("MM");
    let atilanSaat = moment(Date.now()).format("HH:mm:ss");
    let atilanGün = moment(Date.now()).format("DD");
    let banAtılma = `${atilanGün} ${atilanAy.replace("01", "Ocak").replace("02", "Şubat").replace("03", "Mart").replace("04", "Nisan").replace("05", "Mayıs").replace("06", "Haziran").replace("07", "Temmuz").replace("08", "Ağustos").replace("09", "Eylül").replace("10", "Ekim").replace("11", "Kasım").replace("12", "Aralık")} ${atilanSaat}`;

    let cezaID = db.get(`cezaid.${message.guild.id}`)+1
    message.channel.send(embed.setDescription(`${member} (\`${member.id}\`) adlı üye ${reason} sebebi ile sunucudan yasaklandı. (\`#${cezaID}\`)`).setImage("https://media.discordapp.net/attachments/607927671720116292/855701936044638228/oobune.gif"));
    member.send(embed.setDescription(`**${message.guild.name}** adlı sunucudan **${reason}** gerekçesiyle yasaklandın!`)).catch(error => message.channel.send("Kullanıcıya dm atılamadı").then(msg => {
      msg.delete({ timeout: 5000 })
      msg.react(emoji.no)
    }))
    member.ban({reason: reason})
    db.push("bans", {id: member.id});
    db.add(`cezaid.${message.guild.id}`, +1);
    db.set(`punishments.${cezaID}.${message.guild.id}`, { mod: message.member.displayName, sebep: reason, kisi: member.id, id: cezaID, zaman: banAtılma, komut: "Yasaklanma" });
    db.push(`sicil.${message.guild.id}.${member.id}`, { modid: message.member.id, sebep: reason, id: cezaID, zaman: banAtılma, komut: "Yasaklama"});
    db.add(`cezapuan.${message.guild.id}.${member.id}`, +50);
    db.add(`banCez.${message.author.id}.${message.guild.id}`, +1);
    db.add(`ban.${message.guild.id}.${member.id}`, +1);
    db.add(`cezaid.${message.guild.id}`, +1);
    db.add(`lastceza.${message.guild.id}`, +1);

    if (!message.member.hasPermission("ADMINISTRATOR")) { db.add(`bandb.${message.author.id}.${message.guild.id}`, +1)};
    let cpuan = db.get(`cezapuan.${message.guild.id}.${member.id}`);

    setTimeout(function(){
        if (channels.cezapuanlog && client.channels.cache.has(channels.cezapuanlog)) client.channels.cache.get(channels.cezapuanlog).send(`${member} - (\`${member.id}\`) aldığı "Ban" (\`Ceza ID #${cezaID}\`) cezası ile **${cpuan || '0'}** ceza puanına ulaştı.`).catch();
      }, 15000);

    setTimeout(function(){   
    if (message.guild.channels.cache.has(channels.banlog)) message.guild.channels.cache.get(channels.banlog).send(`${emoji.yes} ${member} (\`${member.id}\`) adlı üye ${reason} sebebi ile ${message.author} (\`${message.author.id}\`) tarafından sunucudan yasaklandı. (\`#${cezaID}\`)`)
  }, 10000);
};



module.exports.configuration = {
  name: "ban",
  aliases: ['yasakla'],
  usage: "",
  description: ""
};