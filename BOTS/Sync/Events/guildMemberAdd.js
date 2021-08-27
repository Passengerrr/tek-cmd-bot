const { Discord, MessageEmbed } = require('discord.js');
const moment = require("moment");
const roles = require("../../../_BOOT/roles.json")
const channels = require("../../../_BOOT/channels.json")
const extendss = require("../../../_BOOT/extends.json")
const db = require("fera.db");


module.exports = async (member,client) => {

    if (member.user.bot) return;

    let durum = Date.now()-member.createdTimestamp < 1000 * 60 * 60 * 24 * 7;

    if (durum) {
        member.roles.set([roles.YeniHesap]).catch();
        member.setNickname(roles.YeniHesapName)
        if (member.guild.channels.cache.has(channels.registerchannel)) member.guild.channels.cache.get(channels.registerchannel).send(`${member} (\`${member.id}\`) adlı üye sunucuya giriş yaptı ancak hesabı yeni açıldığı için cezalıya atıldı.`);
    }else{
        let jailStatus = db.get(`jstatus.${member.id}.${member.guild.id}`);
        let muteStatus = db.get(`mstatus.${member.id}.${member.guild.id}`);
        let voiceStatus = db.get(`vstatus.${member.id}.${member.guild.id}`);       
        let jail = db.get(`jail.${member.id}.${member.guild.id}`);
        let cpuan = db.get(`cezapuan.${member.id}.${member.guild.id}`);

        setTimeout(function(){  
            member.roles.add(roles.Unregister)
                }, 1500)

                let isim = member.user.username.replace(/[^a-z^0-9^ü^ç^ğ^ö^ı]/ig, "");

                if (isim.length > 0) {   
                    setTimeout(function(){  //MATEAS COMEBACK 23.07.2021 12.17 
                      member.setNickname(`• ${isim}`)
                }, 3000);
                } else {
                    setTimeout(function(){  
                      member.setNickname(`• ${isim}`)
                }, 3000);
                }

      const taglılar = member.guild.members.cache.filter(m => m.user.username.includes(extendss.tag)).size
      const etiketliler =  member.guild.members.cache.filter(s => !s.bot).filter(member => member.user.discriminator == extendss.etiket).size;
                if(member.user.username.includes(extendss.tag)){
        
                setTimeout(function(){  
                member.guild.channels.cache.get(channels.taglog).send(`───────────────────────────────────────────────────────────────────────────\nSunucumuza katıldı. ${member} isminde tagımız olduğu için taglı rolünü verdim (Toplam Taglı: **${taglılar}** Toplam Etiket: **${etiketliler}**).`)
              }, 1000);
              
              setTimeout(function(){  
                  member.roles.add(roles.tagrol)
            }, 3000);
        }

        if (member.user.discriminator === extendss.etiket) {
            setTimeout(function(){  
            member.guild.channels.cache.get(channels.taglog).send(`───────────────────────────────────────────────────────────────────────────\nSunucumuza katıldı. ${member} etikimizi taşıdığı için taglı rolünü verdim (Toplam Taglı: **${taglılar}** Toplam Etiket: **${etiketliler}**).`)
              }, 1000);

              setTimeout(function(){  
                member.roles.add(roles.tagrol)
          }, 3000);
        }
        if (jailStatus === "true") {
            setTimeout(function(){  
            member.roles.set([roles.Cezalı]).catch();
        }, 10000)

        setTimeout(function(){  
        member.setNickname("• Cezalı")
        }, 5000)

const giveroleidcek = require("../../Settings/Moderation.json")

        setTimeout(function(){  
        member.roles.add(roles.etkinlikduyuru)
        member.roles.add(roles.çekilişkatılımcısı)
        }, 30000)
        setTimeout(function(){  
            if (member.guild.channels.cache.has(channels.cezalıchannel)) member.guild.channels.cache.get(channels.cezalıchannel).send(`:no_entry_sign: ${member} Merhabalar, sunucuya katıldın fakat database üzerinde cezalı olarak gözüküyorsun.Buraya gereksiz bi şekilde düştüysen yetkililere ulaş! \n\nVeritabanı üzerinde verilen cezalı sayısı: **${jail}** (Cezalı Komutu)\nCeza Puanı: **${cpuan}**`);

        }, 15000)

        setTimeout(function(){  
            if (member.guild.channels.cache.has(channels.cezalıchannel)) member.guild.channels.cache.get(channels.cezalıchannel).send(`${member} (\`${member.id}\`) adlı üye sunucuya giriş yaptı ancak database üzerinde cezalı olarak görüldüğü için \`${member.roles.cache.get(roles.Cezalı).name}\` rolünü verdim.`);
        }, 2000)
        }

        if (voiceStatus === "true") {
        setTimeout(function(){  
            member.roles.add(roles.Unregister)
                }, 1500)
            return;
        }

        if (muteStatus === "true") {
            setTimeout(function(){  
            member.roles.add(roles.Muted).catch();
        }, 10000)
        setTimeout(function(){  
            member.roles.add(roles.Unregister)
                }, 1500)
            return;
        }

    }
}

module.exports.configuration = {
    name: "guildMemberAdd"
}