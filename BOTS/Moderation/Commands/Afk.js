const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js")
const db = require("quick.db");
const system = require("../../../_BOOT/system.json")
module.exports.execute = async (client, message, args) => {
  const kisi = db.fetch(`afkid_${message.author.id}_${message.guild.id}`);
  if (kisi) return;
  const sebep = args[0];
  if (!args[0]) {
    let kullanıcı = message.guild.members.cache.get(message.author.id);
    const b = kullanıcı.displayName;
    await db.set(
      `afkSebep_${message.author.id}_${message.guild.id}`,
      "Sebep Girilmemiş"
    );

    await db.set(
      `afkid_${message.author.id}_${message.guild.id}`,
      message.author.id
    );
    await db.set(`afkAd_${message.author.id}_${message.guild.id}`, b);

    const mateas = await db.fetch(
      `afkSebep_${message.author.id}_${message.guild.id}`
    );

   message.channel.send(`${kullanıcı} Başarıyla Afk Oldunuz Durumunuzu Afk Olarak Ayarladım Afk Olmanızın Sebebi: __${mateas}__`);
    message.member.setNickname(`[AFK] ` + b);
  }
  if (args[0]) {
    let sebep = args.join(" ");
    let kullanıcı = message.guild.members.cache.get(message.author.id);
    const b = kullanıcı.displayName;
    await db.set(`afkSebep_${message.author.id}_${message.guild.id}`, sebep);
    await db.set(
      `afkid_${message.author.id}_${message.guild.id}`,
      message.author.id
    );
    await db.set(`afkAd_${message.author.id}_${message.guild.id}`, b);
    const mateas = await db.fetch(
      `afkSebep_${message.author.id}_${message.guild.id}`
    );
  message.channel.send(`${kullanıcı} Başarıyla Afk Oldunuz Durumunuzu Afk Olarak Ayarladım Afk Olmanızın Sebebi: __${mateas}__`);

  message.member.setNickname(`[AFK] ` + b).catch(err => message.channel.send(""))
  }
};

module.exports.configuration = {
  name: "afk",
  aliases: [],
  usage: "",
  description: ""
};