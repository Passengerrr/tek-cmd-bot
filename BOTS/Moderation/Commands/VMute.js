const { MessageEmbed } = require("discord.js");
const db = require("fera.db");
const ms = require("ms");
const moment = require("moment");
const channels = require("../../../_BOOT/channels.json")
const system = require("../../../_BOOT/system.json")
const roles = require("../../../_BOOT/roles.json")
const emoji = require("../../../_BOOT/emojiler.json")

module.exports.execute = async (client, message, args) => {
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor(`RANDOM`).setTimestamp();
    if (!message.member.roles.cache.has(roles.MuteSpear) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription(`Bu komudu kullanmak için gerekli izinlere sahip değilsin.`)).then(x => x.delete({timeout: 10000}));
  let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if(!member) return message.channel.send(embed.setDescription("Geçerli bir üye belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send(embed.setDescription(`Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`)).then(x => x.delete({timeout: 5000}));
  let muteler = db.get(`tempsmute`) || [];
  let sure = args[1];
  let reason = args.splice(2).join(" ");
  if(!sure || !ms(sure) || !reason) return message.channel.send(embed.setDescription("Geçerli bir süre (1s/1m/1h/1d) ve sebep belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  yaziSure = sure.replace(/y/, ' yıl').replace(/d/, ' gün').replace(/s/, ' saniye').replace(/m/, ' dakika').replace(/h/, ' saat')
  let vmutedurum = db.get(`vstatus.${message.guild.id}.${member.id}`)
  if(vmutedurum == "true") return message.channel.send(`${emoji.no} Belirtilen kullanıcının aktif \`Ses Mute\` Cezası bulunduğu için tekrardan mute atılamaz.`)

  if (!muteler.some(j => j.id == member.id)) {
    db.push(`tempsmute`, {id: member.id, kalkmaZamani: Date.now()+ms(sure)})

  }
  let atilanAy = moment(Date.now()).format("MM");
  let atilanSaat = moment(Date.now()).format("HH:mm:ss");
  let atilanGün = moment(Date.now()).format("DD");
  let bitişAy = moment(Date.now()+ms(sure)).format("MM");
  let bitişSaat = moment(Date.now()+ms(sure)).format("HH:mm:ss");
  let bitişGün = moment(Date.now()+ms(sure)).format("DD");
  let muteAtılma = `${atilanGün} ${atilanAy.replace("01", "Ocak").replace("02", "Şubat").replace("03", "Mart").replace("04", "Nisan").replace("05", "Mayıs").replace("06", "Haziran").replace("07", "Temmuz").replace("08", "Ağustos").replace("09", "Eylül").replace("10", "Ekim").replace("11", "Kasım").replace("12", "Aralık")} ${atilanSaat}`;
  let muteBitiş = `${bitişGün} ${bitişAy.replace("01", "Ocak").replace("02", "Şubat").replace("03", "Mart").replace("04", "Nisan").replace("05", "Mayıs").replace("06", "Haziran").replace("07", "Temmuz").replace("08", "Ağustos").replace("09", "Eylül").replace("10", "Ekim").replace("11", "Kasım").replace("12", "Aralık")} ${bitişSaat}`;
  let cezaID = db.get(`cezaid.${message.guild.id}`)+1
  db.add(`cezaid.${message.guild.id}`, +1);
  db.set(`punishments.${cezaID}.${message.guild.id}`, { mod: message.author.id, sebep: reason, kisi: member.id, id: cezaID, zaman: muteAtılma, komut: "V.Mute" });
  db.push(`sicil.${message.guild.id}.${member.id}`, { modid: message.author.id, sebep: reason, id: cezaID, zaman: muteAtılma, komut: "V.Mute" });
  db.add(`cezapuan.${message.guild.id}.${member.id}`, +10);
  db.add(`vmuteCez.${message.author.id}.${message.guild.id}`, +1);
  db.add(`vmute.${message.guild.id}.${member.id}`, +1);
  db.set(`vstatus.${message.guild.id}.${member.id}`, "true");
  db.add(`lastceza.${message.guild.id}`, +1);
  db.push("tempsmute", { id: member.id, kalkmaZamani: Date.now()+ms(sure) });

  let cpuan = db.get(`cezapuan.${message.guild.id}.${member.id}`);
  if (member.voice.channel) member.voice.setMute(true).catch();
  message.channel.send(`${emoji.yes} ${member} ${yaziSure} boyunca  boyunca ses kanallarında susturuldu. (Ceza Numarası: \`#${cezaID}\`)`).catch();
  message.react(emoji.yes)
  setTimeout(() => {
  if(channels.vmutelog && client.channels.cache.has(channels.vmutelog)) client.channels.cache.get(channels.vmutelog).send(embed.setDescription(`${member} (\`${member.user.username}\` - \`${member.id}\`) adlı üye ${yaziSure} boyunca ses kanallarından susturuldu. (\`#${cezaID}\`) \n \n\`•\` Yetkili: ${message.author} (\`${message.author.id}\`) \n\`•\` Ses kanalından susturulma: ${muteAtılma} \n\`•\` Ses kanalından susturulma bitiş: ${muteBitiş} \n\`•\` Sebep: ${reason}`)).catch();
  }, 10000)
  setTimeout(() => {
  if (channels.cezapuanlog && client.channels.cache.has(channels.cezapuanlog)) client.channels.cache.get(channels.cezapuanlog).send(`${member} - (\`${member.id}\`) aldığı "V.Mute" (\`Ceza ID #${cezaID}\`) cezası ile **${cpuan || '0'}** ceza puanına ulaştı.`).catch();
  }, 6000)
  setTimeout(() => {
    let vmutedurum = db.get(`vstatus.${message.guild.id}.${member.id}`)
    if (vmutedurum  === "false") return;
    if(vmutedurum == "true") {
      message.guild.channels.cache.get(channels.vmutelog).send(`${emoji.yes} ${member} kullanıcısnın aktif olan mute cezası bitti.*Ses kanallarına girdiğin anda muten açılacak*.(Ceza Numarası: \`#${cezaID}\`)`) 
      db.set(`vstatus.${message.guild.id}.${member.id}`, "false")
  }
  }, ms(sure))
};

module.exports.configuration = {
  name: "V.Mute",
  aliases: ["vmute","sesmute","voicemute","s.mute"],
  usage: "",
  description: ""
};