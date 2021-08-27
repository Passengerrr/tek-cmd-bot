const { MessageEmbed } = require("discord.js");
const db = require("fera.db");
const channels = require("../../../_BOOT/channels.json")
const system = require("../../../_BOOT/system.json")
const roles = require("../../../_BOOT/roles.json")
const emoji = require("../../../_BOOT/emojiler.json")

module.exports.execute = async(client, message, args) => {

    if(!message.member.roles.cache.has(roles.BotCommands) && !message.member.hasPermission(8));

    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    let embed = new MessageEmbed().setColor('RANDOM').setTimestamp()
    if (!uye) return;

    args = args.filter(a => a !== "" && a !== " ").splice(1)
    if (uye.id === client.user.id) return message.channel.send(embed.setDescription(`Beni Kayıt Edemezsin!`)).then(m => m.delete({ timeout: 7000 }))
    if (uye.id === message.author.id) return message.channel.send(embed.setDescription(`Kendini Kayıt Edemezsin!`)).then(m => m.delete({ timeout: 7000 }))
    if (uye.roles.cache.has(roles.WomanRole)) return message.channel.send(embed.setDescription(`Bu Kullanıcı Zaten Kayıtlı,tekrar kayıt edilemez.`)).then(m => m.delete({ timeout: 7000 }))

        message.channel.send(embed.setDescription(`${uye}, kullanıcısı başarıyla Kadın olarak kayıt edildi.`)).then(m => m.delete({ timeout: 12000 }))

        setTimeout(function(){  
          uye.roles.add(roles.WomanRole)
          uye.roles.add(roles.WomanRoles)
        }, 3000);
        
          let cinsiyet = (message.guild.roles.cache.get(roles.WomanRole).name)
          let name = `${uye.displayName}`
          await db.add(`kayıt.${message.author.id}.k`, 1)
          await db.add(`kayıt.${message.author.id}.t`, 1)
  
        db.push(`isimler.${uye.id}`, { 
          isim: name,
          kayıtsekil: `(${cinsiyet})`
        })
      }

module.exports.configuration = {
  name: "Woman",
  aliases: ['kiz',"kız","k","kadın"],
  usage: "",
  description: ""
};