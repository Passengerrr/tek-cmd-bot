const { MessageEmbed } = require("discord.js");
const db = require("fera.db");
const { table } = require('table');
const moment = require("moment")
const roles = require("../../../_BOOT/roles.json")
const system = require('../../../_BOOT/system.json')
const emoji = require("../../../_BOOT/emojiler.json")
module.exports.execute = async (client, message, args) => {

  if (!message.member.roles.cache.has(roles.BotCommands) && !message.member.hasPermission("ADMINISTRATOR")) return;

  let user = message.mentions.users.first() || client.users.cache.get(args[0]) || client.users.fetch(args[0]) || message.author;

let data = db.get(`sicil.${message.guild.id}.${user.id}`) || [];
let siciltable = [
      ["ID", "Ceza", "Tarih", "Sebep"]
];

let siciltabledosya = [
  ["ID", "Ceza", "Tarih", "Yetkili", "Sebep"]
];
    let config = {
      border: {
          topBody: ``, 
          topJoin: ``,
          topLeft: ``,
          topRight: ``,

          bottomBody: ``,
          bottomJoin: ``,
          bottomLeft: ``,
          bottomRight: ``,

          bodyLeft: `│`,
          bodyRight: `│`,
          bodyJoin: `│`,

          joinBody: ``,
          joinLeft: `  `,
          joinRight: `  `,
          joinJoin: ``
      }
  };
//
data = data.reverse();
  data.map(x => {
    siciltable.push([x.id, (x.zaman), x.komut, x.sebep])
})

data.map(x => {
  siciltabledosya.push([x.id, x.komut, x.zaman, client.users.cache.get(x.modid).tag, x.sebep])
})
let sonceza = data.lenght;
let sicildatas = table(siciltable.slice(sonceza , 10), config)
let sicildatass = table(siciltable.slice(0 , sonceza), config)

if(!data ||!data.length) return message.channel.send('Bu kullanıcının ceza verisini database üzerinde bulunamadı.')

message.channel.send(`${user} Kullanısının toplam ${data.length} cezası bulunmakta son 10 cezası aşağıda belirtilmiştir. Tüm ceza bilgi dosyasını indirmek için :no_entry_sign: emojisine, ceza sayılarına bakmak için :grey_question: emojisine basabilirsin.Tekli bir cezaya bakmak için \`${system.Moderationprefix}Ceza ID\` komutunu uygulayınız.\`\`\`${sicildatas}\`\`\``).then(msg => {
  msg.react("🚫").then(async(r) => {
    await msg.react('❔');
  });
  msg.delete({ timeout: 30000 })


msg.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '🚫' || reaction.emoji.name == '❔'),
{ max: 1, time: 60000 }).then(async collected => {
  if (collected.first().emoji.name == '🚫') {
    msg.channel.send(`${user} kullanıcısının toplam ${data.length} cezası aşağıdaki belgede yazmaktadır.`, { files: [{ attachment: Buffer.from(sicildatass), name: `${user.id}_cezalar.txt` }] }).then(msg => {
      msg.delete({ timeout: 25000 })
    })
  } else {
    let cpuan = db.get(`cezapuan.${user.id}.${message.guild.id}`);
    let jail = await db.get(`jail.${user.id}.${message.guild.id}`);
    let ban = await db.get(`ban.${user.id}.${message.guild.id}`);
    let cmute = await db.get(`cmute.${user.id}.${message.guild.id}`);
    let vmute = await db.get(`vmute.${user.id}.${message.guild.id}`);
    msg.edit(` ${client.users.cache.get(user.id).tag} kullanıcısının ceza bilgileri aşağıda belirtilmiştir:\n\nChat Mute: ${cmute || '0'} kez.\nSes Mute: ${vmute || '0'} kez.\nCezalı Bilgisi: ${jail || '0'} kez.\nBan Bilgisi: ${ban || '0'} kez.\n\nKullanıcı toplamda ${data.length} kez kural ihlali yapmış, kullanıcının ceza puanı ${cpuan || '0'}.`, {code: "js"})
    msg.delete({ timeout: 20000 })
}
}
).catch(error => message.channel.send("Emojiye basılmadığı için herhangi başka detay gösterilemedi").then(msg => {
  msg.delete({ timeout: 5000 })
  msg.react(emoji.no)
}))
})
};

module.exports.configuration = {
  name: "cezalar",
  aliases: ['sicil'],
  usage: "",
  description: ""
};