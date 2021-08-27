const { MessageEmbed } = require("discord.js");
const db = require("fera.db");
const moment = require("moment")
const roles = require("../../../_BOOT/roles.json")
const channels = require("../../../_BOOT/channels.json")
const system = require("../../../_BOOT/system.json")
module.exports.execute = async (client, message, args) => {
    let executor = message.member
    let cezaID = db.get(`cezaid.${message.guild.id}`)+1
    let embed = new MessageEmbed().setColor("#992D22")
    if (!message.member.roles.cache.has(roles.CezalıSpear) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`Bu komudu kullanmak için gerekli izinlere sahip değilsin.`).then(x => x.delete({timeout: 10000}));
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    let reason = args.splice(1).join(" ");
    if (!member || reason.length < 1) return message.channel.send(`Komutu doğru kullanmalısın! \`Örnek: ${system.Moderationprefix || ""}jail @üye [sebep]\``).then(x => x.delete({timeout: 10000}));
    if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send(embed.setDescription(`Bu üyenin yetkileri senden yüksek veya aynı yetkide olduğunuz için işlemi gerçekleştiremiyorum.`)).then(x => x.delete({timeout: 10000}));
    let jstatus = db.get(`jstatus.${message.guild.id}.${member.id}`)
    if (jstatus  === "true") return message.channel.send("Bu Kullanıcının aktif **JAIL** cezası bulunmaktadır.").then(x => x.delete({timeout: 10000})); 
    if (member.user.bot) return message.channel.send(`Bu komutu botlar üzerinde kullanamazsın!`).then(x => x.delete({timeout: 10000}));
    if (message.member.roles.cache.has(roles.Cezalı)) return;
    let atilanAy = moment(Date.now()).format("MM");
    let atilanSaat = moment(Date.now()).format("HH:mm:ss");
    let atilanGün = moment(Date.now()).format("DD");
    let jailAtılma = `${atilanGün} ${atilanAy.replace("01", "Ocak").replace("02", "Şubat").replace("03", "Mart").replace("04", "Nisan").replace("05", "Mayıs").replace("06", "Haziran").replace("07", "Temmuz").replace("08", "Ağustos").replace("09", "Eylül").replace("10", "Ekim").replace("11", "Kasım").replace("12", "Aralık")} ${atilanSaat}`;


    db.push("jails", { id: member.id });
    db.add(`cezaid.${message.guild.id}`, +1);
    db.set(`punishments.${cezaID}.${message.guild.id}`, { mod: message.author.id, sebep: reason, kisi: member.id, id: cezaID, zaman: jailAtılma, komut: "Cezalı", Bitis:"Süresiz" });
    db.push(`jstatus.${message.guild.id}.${member.id}`, "true")
    db.push(`sicil.${message.guild.id}.${member.id}`, { modid: message.member.id, sebep: reason, id: cezaID, zaman: jailAtılma, komut: "Cezalı", Bitis:"Süresiz" });
    db.add(`cezapuan.${message.guild.id}.${member.id}`, +35);
    db.add(`jailCez.${message.author.id}.${message.guild.id}`, +1);
    db.add(`jail.${message.guild.id}.${member.id}`, +1);
    db.add(`lastceza.${message.guild.id}`, +1);

    let cezapuan = db.get(`cezapuan.${message.guild.id}.${member.id}`);

  


let booster = false;
if(member.roles.cache.has(roles.Booster)) booster = true;

    if (member.voice.channel) member.voice.kick();
    message.channel.send(`${member}, üyesine ${reason} Sebebiyle Cezalı verildi. (Ceza Numarası:\`#${cezaID}\`)`)
    member.setNickname("• Cezalı")
    setTimeout(() => {
    if (message.guild.channels.cache.has(channels.cezalılog)) message.guild.channels.cache.get(channels.cezalılog).send(embed.setDescription(`${member}, üyesine <@&${roles.Cezalı.id}> rolü ${message.author} tarafından verildi.(\`#${cezaID}\`) \n Sebep: ${reason} `))
  }, 10000);
  setTimeout(() => {
  if (channels.cezapuanlog && client.channels.cache.has(channels.cezapuanlog)) client.channels.cache.get(channels.cezapuanlog).send(`${member} - (\`${member.id}\`) aldığı "Jail" (\`Ceza ID #${cezaID}\`) cezası ile **${cezapuan || '0'}** ceza puanına ulaştı.`).catch();
}, 15000);
let jailrolu = roles.Cezalı
let boosterrolu = roles.Booster

    setTimeout(() => {
      booster ? member.roles.set([boosterrolu, jailrolu]) : member.roles.set([jailrolu])
    }, 3000);
};

module.exports.configuration = {
  name: "cezalı",
  aliases: [],
  usage: "",
  description: ""
};