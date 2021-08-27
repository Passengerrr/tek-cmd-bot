const { MessageEmbed } = require("discord.js");
const db = require("fera.db");
const moment = require("moment");
const roles = require("../../../_BOOT/roles.json")
const extendss = require("../../../_BOOT/extends.json")
const system = require("../../../_BOOT/system.json")
const emoji = require('../../../_BOOT/emojiler.json')
module.exports.execute = async(client, message, args) => {

    if(!message.member.roles.cache.has(roles.BotCommands) && !message.member.hasPermission(8)) return;
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    let cpuan = db.get(`cezapuan.${message.guild.id}.${member.id}`);
    let embed = new MessageEmbed().setColor('RANDOM').setFooter(`Kullacının Ceza puanı: ${cpuan || '0'}`)

    if (!member) return message.channel.send(embed.setDescription(`${message.author}, Bir kullanıcıyı Etiketlemelisin.`)).then(m => m.delete({ timeout: 7000 }))
    
    args = args.filter(a => a !== "" && a !== " ").splice(1)
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase() + arg.slice(1)).join(" ");
    let yaş = args.filter(arg => !isNaN(arg))[0] || undefined;
    //if (!isim | !yaş) return message.channel.send(`${message.author}, Bir isim ve yaş Belirtmelisin.`).then(m => m.delete({ timeout: 7000 }))
    //let name = `${extendss.tag} ${isim} | ${yaş}`
    //if(member.user.username.includes(extendss.tag)) name = `${extendss.tag} ${isim} | ${yaş}` 
    if (!member.user.username.includes(extendss.tag) && !member.user.discriminator.includes(extendss.etiket) && !member.roles.cache.has(roles.Vip) && !member.roles.cache.has(roles.Booster)) return message.channel.send(`Sunucuya kayıt olmak için tag veya etiket almalısın ya da vip & booster rolü olan kişi isen kayıt olabilirsin.Vip rolü vermek için \`${system.Moderationprefix}vip @Member/ID\``)
    if (!isim) return message.channel.send(`${message.author}, Bir isim Belirtmelisin.`).then(m => m.delete({ timeout: 7000 }))
    let name = `${extendss.untag} ${isim}`  

    let jail = await db.get(`jail.${message.guild.id}.${member.id}`);
    let ban = await db.get(`ban.${message.guild.id}.${member.id}`);
    let cmute = await db.get(`cmute.${message.guild.id}.${member.id}`);
    let vmute = await db.get(`vmute.${message.guild.id}.${member.id}`);
    let data = db.get(`sicil.${message.guild.id}.${member.id}`)

    if (member.id === client.user.id) return message.channel.send(embed.setDescription(`Beni Kayıt Edemezsin!`)).then(m => m.delete({ timeout: 7000 }))
    if (member.id === message.author.id) return message.channel.send(embed.setDescription(`Kendini Kayıt Edemezsin!`)).then(m => m.delete({ timeout: 7000 }))
    if (cpuan > 60) return message.channel.send(embed.setDescription(`:no_entry_sign: Kayıt etmeye çalışılan kullancı (${member}) tehlike içermektedir.\nSunucu içerisinde ${data.length || '0'} (Cezalı: ${jail || 0} Mute: ${cmute || 0} V.Mute: ${vmute || 0} Yasalama: ${ban || 0} Cezapuan: ${cpuan}) ceza-i işlem uygulanmış.\n\nSunucunun düzenini bozacak kullanıcılar sunucuya alınmamaktadır herhangi bir yanlışlık olduğu düşünüyorsan **Üst Yetkililere ulaş**.`));

    
    let isimveri = await db.get(`isimler.${member.id}`)
    
   if(isimveri) {   
        isimveri = isimveri.reverse();
        let isimson = isimveri.lenght;
        let isimler = isimveri.filter(member => member.userID === member.id).map((value, index) => `\`${value.isim}\`${value.kayıtsekil}`).slice(isimson , 7)

        message.channel.send(embed.setDescription(`
        ${member} kişisinin ismi başarıyla "${name}" olarak değiştirildi.Bu kullancı daha önceden kayıt olmuş.\n\n${emoji.no} Kullanıcının (${isimveri.length}) adet veri kaydı bulunmakta.Kullanıcının en son isimleri aşağıda sıralanmıştır.\n
        ${isimler.join("\n") || "Bu kullanıcı önceden kayıt olmadığı için isim geçmişini görüntüleyemedim."}\n\n Kişinin geçmiş isimlerine \`!isimler @üye\` komutuyla bakarak kayıt yapmanız önerilir.`)).then(m => m.delete({ timeout: 12000 }))
   }

   if(!isimveri) {
     message.channel.send(embed.setDescription(`${member} kişisinin ismi başarıyla \`${name}\` olarak değiştirildi.`)).then(m => m.delete({ timeout: 12000 }))
   }
   member.setNickname(name)

const prefixes = system.Moderationprefix
const prefix = prefixes.filter(p => message.content.startsWith(p))[0];

var filter = msj => msj.author.id === message.author.id && msj.author.id !== client.user.id;
message.channel.awaitMessages(filter, { max: 1, time: 10000 }).then(async collected => {
    if(Date.now()-member.user.createdTimestamp < 1000*60*60*24*15 && !message.member.roles.cache.has(roles.BotCommands) && !message.member.hasPermission("ADMINISTRATOR")) return;
    if(member.roles.cache.has(roles.YeniHesap) && member.roles.cache.has(roles.Cezalı) && !message.member.hasPermission('ADMINISTRATOR')) return;
    if(collected.first().content.toLowerCase() === `${prefix}kadın` || collected.first().content.toLowerCase() === `${prefix}k`) {
      if(member.roles.cache.has(roles.WomanRole) || member.roles.cache.has(roles.ManRole)) return message.channel.send(`Bu Kullanıcı Zaten Kayıtlı,tekrar kayıt edilemez.`).then(m => m.delete({ timeout: 7000 }));
      setTimeout(function(){  
        member.roles.add(roles.WomanRole)
      }, 3000);

      setTimeout(function(){  
        member.roles.add(roles.WomanRoles)
      }, 5000);
      
      setTimeout(function(){  
        member.roles.remove(roles.Unregister)
      }, 3000);
      let cinsiyet = `<@&${message.guild.roles.cache.get(roles.WomanRole).id}>`
        let name = `${member.displayName}`
        await db.add(`kayıt.${message.author.id}.k`, 1)
        await db.add(`kayıt.${message.author.id}.t`, 1)

      db.push(`isimler.${member.id}`, { 
        isim: name,
        kayıtsekil: `(${cinsiyet})`
      })
        message.channel.send(embed.setDescription(`${member}, kullanıcısı başarıyla kadın olarak kayıt edildi.`)).then(msg => {
          msg.delete({ timeout: 10000 })
        })
    }

  if(collected.first().content.toLowerCase() === `${prefix}erkek` || collected.first().content.toLowerCase() === `${prefix}e`) { 
    if(member.roles.cache.has(roles.WomanRole) || member.roles.cache.has(roles.ManRole)) return message.channel.send(`Bu Kullanıcı Zaten Kayıtlı,tekrar kayıt edilemez.`).then(m => m.delete({ timeout: 7000 }));
    setTimeout(function(){  
      member.roles.add(roles.ManRole)
    }, 3000);

    setTimeout(function(){  
      member.roles.add(roles.ManRoles)
    }, 5000);
    
      let cinsiyet = `<@&${message.guild.roles.cache.get(roles.ManRole).id}>`
      let name = `${member.displayName}`
      await db.add(`kayıt.${message.author.id}.e`, 1)
      await db.add(`kayıt.${message.author.id}.t`, 1)

    db.push(`isimler.${member.id}`, { 
      isim: name,
      kayıtsekil: `(${cinsiyet})`
    })
    setTimeout(function(){  
      member.roles.remove(roles.Unregister)
    }, 3000);
      message.channel.send(embed.setDescription(`${member}, kullanıcısı başarıyla erkek olarak kayıt edildi.`)).then(msg => {
        msg.delete({ timeout: 10000 })
      }) && message.react(emoji.yes)
    
    }}).catch(error => db.push(`isimler.${member.id}`, { isim: name, kayıtsekil: `(İsim Değiştirme)` } ))

}

module.exports.configuration = {
  name: "İsim",
  aliases: ['name','i',"isim","nick"],
  usage: "",
  description: ""
};