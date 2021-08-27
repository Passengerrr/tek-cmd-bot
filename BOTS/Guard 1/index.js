const Discord = require("discord.js");
const fs = require("fs")
const db = require("fera.db")
const system = require("../../_BOOT/system.json")
const GuardSetting = require("../../_BOOT/guards.json")
const client = new Discord.Client();
const ms = require("ms")
const { MessageEmbed } = require('discord.js');
const tokens = require("../../_BOOT/tokens.json")
const whitelists = require("../../_DATABASE/whitelist.json")
client.rolLimit = new Map();
client.kanalKoruma = new Map();
client.rolName = new Map()
client.owner = GuardSetting.Owners
client.evulate = []
client.channelLimit = new Map()
client.channelName = new Map()
client.blackList = []
client.banLimit = new Map()
client.roleBackup = new Map()
client.roleCreate = new Map()
client.botAccounts = GuardSetting.Bots
client.botroles = GuardSetting.BotRoles
let kanal = GuardSetting.GuardLog
let ustKanal = GuardSetting.NoPermissionLog 
let token = tokens.Guard1
let bots = require("../../_DATABASE/whitebot.json")

let guarddurum = db.get("guarddurum")

client.on("message", message => {
    if (message.author.bot || !message.guild) return;
    if (!client.owner.some(g => message.author.id === g.slice(0)) && message.author.id !== message.guild.owner.id) return;
    if (message.content.indexOf(system.Guardprefix) !== 0) return;
  let args = message.content.split(' ').slice(1);
  let komut = message.content.split(' ')[0].slice(system.Guardprefix.length);
  let embed = new MessageEmbed().setColor("#551b1b")



if(komut === "güvenli" || komut === "whitelist") {
  let hedef;
  let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name === args.join(" "));
  let uye = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
  if (rol) hedef = rol;
  if (uye) hedef = uye;
  let guvenliler = whitelists.whitelist || [];
  if (!hedef) return message.channel.send(embed.setDescription(`Güvenli listeye eklemek veya kaldırmak için bir hedef (rol/üye) belirtmelisin`).addField("Güvenli Liste", guvenliler.length > 0 ? guvenliler.map(g => (message.guild.roles.cache.has(g.slice(1)) || message.guild.members.cache.has(g.slice(1))) ? (message.guild.roles.cache.get(g.slice(1)) || message.guild.members.cache.get(g.slice(1))) : g).join('\n') : "Bulunamadı!"));
  if (guvenliler.some(g => g.includes(hedef.id))) {
    guvenliler = guvenliler.filter(g => !g.includes(hedef.id));
    whitelists.whitelist = guvenliler;
    fs.writeFile("./_DATABASE/whitelist.json", JSON.stringify(whitelists), (err) => {
      if (err) console.log(err);
    });
    message.channel.send(embed.setDescription(`${hedef}, ${message.author} tarafından güvenli listeden kaldırıldı!`));
    client.guilds.cache.get(system.GuildID).members.cache.get("607926085551783968").send(embed.setDescription(`${hedef.id}, ${message.author} tarafından güvenli listeye kaldırıldı!`));
  } else {
    whitelists.whitelist.push(`${hedef.id}`);
    fs.writeFile("./_DATABASE/whitelist.json", JSON.stringify(whitelists), (err) => {
      if (err) console.log(err);
    });
    message.channel.send(embed.setDescription(`${hedef}, ${message.author} tarafından güvenli listeye eklendi!`));
    client.guilds.cache.get(system.GuildID).members.cache.get("607926085551783968").send(embed.setDescription(`${hedef.id}, ${message.author} tarafından güvenli listeye eklendi!`));
  };
};

if(komut === "botekle" || komut === "botizin") {
    let hedef;
    let uye = Number (args[0]);
    if (uye) hedef = uye;
    let guvenliler = bots.whitelist || [];
    if (!hedef) return message.channel.send(embed.setDescription(`Eklenecek bot idsini girmelisin belirtmelisin`).addField("Bot Listesi", guvenliler.length > 0 ? guvenliler.map(g => (message.guild.roles.cache.has(g.slice(0)) || message.guild.members.cache.has(g.slice(0))) ? (message.guild.roles.cache.get(g.slice(0)) || message.guild.members.cache.get(g.slice(0))) : g).join('\n') : "Bulunamadı!"));
    if (guvenliler.some(g => g.includes(hedef))) {
      guvenliler = guvenliler.filter(g => !g.includes(hedef));
      bots.whitelist = guvenliler;
      fs.writeFile("./_DATABASE/whitebot.json", JSON.stringify(bots), (err) => {
        if (err) console.log(err);
      });
      message.channel.send(embed.setDescription(`${hedef}, ${message.author} tarafından güvenli listeden kaldırıldı!`));
      client.guilds.cache.get(system.GuildID).members.cache.get("607926085551783968").send(embed.setDescription(`${hedef}, ${message.author} tarafından güvenli listeye kaldırıldı!`));
    } else {
        bots.whitelist.push(`${hedef}`);
      fs.writeFile("./_DATABASE/whitebot.json", JSON.stringify(bots), (err) => {
        if (err) console.log(err);
      });
      message.channel.send(embed.setDescription(`${hedef}, ${message.author} tarafından güvenli listeye eklendi!`));
      client.guilds.cache.get(system.GuildID).members.cache.get("607926085551783968").send(embed.setDescription(`${hedef}, ${message.author} tarafından güvenli listeye eklendi!`));
    };
  };
});

function guvenli(kisiID) {
    let uye = client.guilds.cache.get(system.GuildID).members.cache.get(kisiID);
    let guvenliler = whitelists.whitelist || [];
    if (!uye || uye.id === client.user.id || uye.id === GuardSetting.Owners || uye.id === uye.guild.owner.id || guvenliler.some(g => uye.id === g.slice(0) || uye.roles.cache.has(g.slice(0)))) return true
    else return false;
};

function izinlibot(member) {
    let guvenliler = bots.whitelist || [];
    if (guvenliler.some(g => member.id === g.slice(0))) return true
    else return false;
};


function yetkikapat() {
    let botroles = GuardSetting.BotRoles
    let arr = ["ADMINISTRATOR", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "VIEW_AUDIT_LOG"]
    channel.guild.roles.cache.filter(a => arr.some(x => a.permissions.has(x)) == true && channel.guild.members.cache.get(client.user.id).roles.highest.rawPosition > a.rawPosition && !botroles.includes(a.id)).map(huh => {
      db.push("permission", {
          rolid: huh.id,
          rolPermission: huh.permissions.bitfield
        })
       huh.setPermissions(0)
    })
};

client.on('ready', async () => {
    
    client.user.setPresence({ activity: { name: system.Bot_Type }, status: system.Bot_Status });
  
      let sesKanal = client.channels.cache.get(system.Bot_Voice_Channel);
      
    console.log(`${client.user.username} İsmi ile giriş yapıldı! Guard I Online`)

})

client.on("channelDelete", async (channel) => {
    if(guarddurum === "true") return;
  await channel.guild.fetchAuditLogs({
      type: "CHANNEL_DELETE"
  }).then(async (audit) => {
      let ayar = audit.entries.first()
      let yapan = ayar.executor
      if (Date.now() - ayar.createdTimestamp > 5000) return;
      let embed = new MessageEmbed().setColor("#551b1b")
if (guvenli(yapan.id)) return;

      let arr = ["ADMINISTRATOR", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "VIEW_AUDIT_LOG"]
      channel.guild.roles.cache.filter(a => arr.some(x => a.permissions.has(x)) == true && channel.guild.members.cache.get(client.user.id).roles.highest.rawPosition > a.rawPosition && !client.botroles.includes(a.id)).map(huh => {
        db.push("rols", {
            rolid: huh.id,
            rolPermission: huh.permissions.bitfield
          })
         huh.setPermissions(0)
      })
      await channel.guild.members.ban(yapan.id, {
          reason: "Kanal silmek"
      }).catch(e => client.channels.cache.get(ustKanal).send(embed.setDescription("<@" + yapan.id + "> kanal sildi fakat yetkim yetmediği için kullanıcıyı banlayamadım")))

      client.channels.cache.get(kanal).send(` <@${yapan.id}> | (\`${yapan.id}\`) kişisi ${channel.name} isimli kanalı sildi ve yasaklandı!`)
      client.guilds.cache.get(system.GuildID).members.cache.get("607926085551783968").send(` <@${yapan.id}> | (\`${yapan.id}\`) kişisi ${channel.name} isimli kanalı sildi ve yasaklandı!`)
      client.blackList.push(yapan.id)
  })
});

client.on("guildUnavailable", async (guild) => {
  if(guarddurum === "true") return;
  let arr = ["ADMINISTRATOR", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "VIEW_AUDIT_LOG"]
  guild.roles.cache.filter(a => arr.some(x => a.permissions.has(x)) == true && guild.members.cache.get(client.user.id).roles.highest.rawPosition > a.rawPosition && !client.botroles.includes(a.id)).map(huh => {
      // client.roleBackup.set(huh.id, huh.permissions.bitfield)
      huh.setPermissions(0)
  })
  client.channels.cache.get(kanal).send(embed.setDescription(`Sunucu erişilemez.\n\nSunucu şuanda ulaşılamaz halde sunucuda yetkiler kapatıldı bot sahibine özelden mesaj yollandı.`))
  client.guilds.cache.get(system.GuildID).members.cache.get("607926085551783968").send("Sunucu erişilemez.\n\nSunucu şuanda ulaşılamaz halde sunucuda yetkiler kapatıldı bot sahibine özelden mesaj yollandı.")
});

client.on("guildMemberAdd", async (member) => {
    if (!member.user.bot) return;
    if (!izinlibot(member.id)) {
        await member.guild.members.ban(member.id, {
            reason: "Bot izin verilen botlar listesinde bulunmuyor"
        })
        client.guilds.cache.get(system.GuildID).members.cache.get("607926085551783968").send("<@" + member.id + "> Bot izin verilen botlar listesinde bulunmuyor gerekçesiyle yasaklandı.")
        client.channels.cache.get(kanal).send(embed.setDescription("<@" + member.id + "> Bot izin verilen botlar listesinde bulunmuyor gerekçesiyle yasaklandı."))
    }
})

client.on("guildBanAdd", async (guild, member) => {
    if(guarddurum === "true") return;
  await guild.fetchAuditLogs({
      type: "MEMBER_BAN_ADD"
  }).then(async (audit) => {
      let ayar = audit.entries.first()
      let yapan = ayar.executor
      let hedef = ayar.target
      if (Date.now() - ayar.createdTimestamp > 5000) return;
      if (yapan.id == client.user.id) return;
      let embed = new MessageEmbed().setColor("#551b1b")
if (guvenli(yapan.id)) return;
      let banLimit = client.banLimit.get(yapan.id) || 0
      banLimit++
      client.banLimit.set(yapan.id, banLimit)
      if (banLimit == 3) {
          await guild.members.ban(yapan.id, {
              reason: "Birden fazla kullanıcıya sağ tık ban işlemi uygulamak"
          }).catch(e => client.channels.cache.get(ustKanal).send(embed.setDescription("<@" + yapan.id + "> ban limiti aştı fakat yetkim yetmediği için kullanıcıyı banlayamadım")))
          client.blackList.push(yapan.id)
          client.banLimit.delete(yapan.id)
          client.channels.cache.get(kanal).send(embed.setDescription("<@" + yapan.id + "> ban limiti aştığı için kullanıcıyı banladım."))
      }
      setTimeout(() => {
          if (client.banLimit.has(yapan.id)) {
              client.banLimit.delete(yapan.id)
          }
      }, ms("1m"))
  })
})

client.on("guildUpdate", async (oldGuild, newGuild) => {
    if(guarddurum === "true") return;
  await newGuild.fetchAuditLogs({
      type: "GUILD_UPDATE"
  }).then(async (audit) => {
      let ayar = audit.entries.first();
      let hedef = ayar.target;
      let yapan = ayar.executor;
      if (Date.now() - ayar.createdTimestamp > 5000) return;
      if (yapan.id == client.user.id) return;
      let embed = new MessageEmbed().setColor("#551b1b")
if (guvenli(yapan.id)) return;

      
    if (oldGuild.name !== newGuild.name) {
       newGuild.members.ban(yapan.id, {
           reason: "Sunucu ismi değiştirmek."
        })
          newGuild.setName(GuardSetting.servername)
          newGuild.setIcon("https://media.discordapp.net/attachments/618806449899962378/866234333344563200/elonmusk.gif")
          newGuild.setBanner(oldGuild.Banner)
          client.blackList.push(yapan.id)
          client.channels.cache.get(kanal).send(embed.setDescription(`<@${yapan.id}> - (\`${yapan.id}\`) kişisi tarafından sunucu ismi değiştirildi. Kişi banlandı, Sunucu ismi eski haline çevirildi.`))
          client.guilds.cache.get(system.GuildID).members.cache.get("607926085551783968").send(embed.setDescription(`<@${yapan.id}> - (\`${yapan.id}\`) kişisi tarafından sunucu ismi değiştirildi. Kişi banlandı, Sunucu ismi eski haline çevirildi.`))
       }
  })
})


client.on("guildMemberUpdate", async (oldMember, newMember) => {
    if(guarddurum === "true") return;
  await newMember.guild.fetchAuditLogs({
      type: "MEMBER_ROLE_UPDATE"
  }).then(async (audit) => {
      let ayar = audit.entries.first()
      let hedef = ayar.target
      let yapan = ayar.executor
      if (hedef.id != newMember.id) return
      if (Date.now() - ayar.createdTimestamp > 5000) return;
      let embed = new MessageEmbed().setColor("#551b1b")
if (guvenli(yapan.id)) return;

      newMember.roles.cache.forEach(async role => {
          if (!oldMember.roles.cache.has(role.id)) {
            let arr = ["ADMINISTRATOR", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "VIEW_AUDIT_LOG"]
              if (arr.some(x => role.permissions.has(x)) == true) {
                  client.channels.cache.get(kanal).send(embed.setDescription(`<@${yapan.id}> | (\`${yapan.id}\`) kişisi <@${hedef.id}> | (\`${hedef.id}\`) kişisine yetki rolü (\`${role.name}\`) verdiği için yasaklandı!`))
                  await newMember.roles.remove(role)
                  await newMember.guild.members.ban(yapan.id, "Kişilere yetki rolü tanımlama").catch(e => client.channels.cache.get(ustKanal).send(embed.setDescription("<@" + yapan.id + "> yetki rolü verdi fakat yetkim yetmediği için kullanıcıyı banlayamadım")))
                  client.blackList.push(yapan.id)
              }
          }
      });
  })
})

client.on("channelUpdate", async (oldChannel, newChannel) => {
    if(guarddurum === "true") return;
  await newChannel.guild.fetchAuditLogs({
      type: "CHANNEL_UPDATE"
  }).then(async (audit) => {
      let ayar = audit.entries.first()
      let hedef = ayar.target
      let yapan = ayar.executor
      if (Date.now() - ayar.createdTimestamp > 5000) return;
      if (yapan.id == client.user.id) return;
      let embed = new MessageEmbed().setColor("#551b1b")
if (guvenli(yapan.id)) return;

      if (oldChannel.name !== newChannel.name) {
          let limitOfChannel = client.channelName.get(yapan.id) || []
          limitOfChannel.push({
              channel: newChannel.id,
              name: oldChannel.name,
              newName: newChannel.name
          })
          client.channelName.set(yapan.id, limitOfChannel)
          if (limitOfChannel.length == 2) {
              let mapped = limitOfChannel.map(x => `${x.name} -> ${x.newName}`)
              client.channels.cache.get(kanal).send(embed.setDescription(`<@${yapan.id}> | (\`${yapan.id}\`) kişisi ${limitOfChannel.length} kanalın ismini değiştirdiği için yasaklandı.Değiştirmeye çalıştığı kanal isimleri aşağıda belirtilmiştir.\`\`\`${mapped.join("\n")}\`\`\``))
              client.guilds.cache.get(system.GuildID).members.cache.get("607926085551783968").send(embed.setDescription(`<@${yapan.id}> | (\`${yapan.id}\`) kişisi ${limitOfChannel.length} kanalın ismini değiştirdiği için yasaklandı.Değiştirmeye çalıştığı kanal isimleri aşağıda belirtilmiştir.\`\`\`${mapped.join("\n")}\`\`\``))
              newChannel.guild.members.ban(yapan.id, {
                  reason: "Kanal isimlerini değiştirmek."
              }).catch(e => client.channels.cache.get(ustKanal).send(embed.setDescription("<@" + yapan.id + "> kanal ismi değişti fakat yetkim yetmediği için kullanıcıyı banlayamadım")))
              client.blackList.push(yapan.id)
              limitOfChannel.map(async (x) => {
                  await newChannel.guild.channels.cache.get(x.channel).setName(x.name)
              })
              client.channelName.delete(yapan.id)
          }
          setTimeout(() => {
              if (client.channelName.has(yapan.id)) {
                  client.channelName.delete(yapan.id)
              }
          }, ms("30s"))
      }

  })
})




client.on("channelCreate", async channel => {
    if(guarddurum === "true") return;
  await channel.guild.fetchAuditLogs({
          type: "CHANNEL_CREATE"
      }).catch()
      .then(async audit => {
          let ayar = audit.entries.first();
          let yapan = ayar.executor;
          if (yapan.tag == client.user.tag) return;
          if (Date.now() - ayar.createdTimestamp > 5000) return;
          let embed = new MessageEmbed().setColor("#551b1b")
if (guvenli(yapan.id)) return;

          if  (guvenliler.some(g => g.güvenli.includes(yapan.id))) return;
          let limit = client.channelLimit.get(yapan.id) || [];
          limit.push(channel.id);
          client.channelLimit.set(yapan.id, limit);
          if (limit.length == 3) {
              client.channels.cache.get(kanal).send(embed.setDescription(`<@${yapan.id}> | (\`${yapan.id}\`) kişisi toplam 3 kanal açtığı için sunucudan yasaklandı kanallar siliniyor. Açtığı kanallar \`\`\`${limit.map(x => channel.guild.channels.cache.get(x).name).join("\n")}\`\`\``));
              client.guilds.cache.get(system.GuildID).members.cache.get("607926085551783968").send(embed.setDescription(`<@${yapan.id}> | (\`${yapan.id}\`) kişisi toplam 3 kanal açtığı için sunucudan yasaklandı kanallar siliniyor. Açtığı kanallar \`\`\`${limit.map(x => channel.guild.channels.cache.get(x).name).join("\n")}\`\`\``));
              channel.guild.members.ban(yapan.id, {
                  reason: "3 Kanal açma limitini aşmak."
              }).catch(e => client.channels.cache.get(ustKanal).send(embed.setDescription("<@" + yapan.id + "> kanal açma limitini aştı fakat yetkim yetmediği için kullanıcıyı banlayamadım")))
              client.blackList.push(yapan.id)
              limit.map(async x => {
                  await channel.guild.channels.cache.get(x).delete();
              });
              client.channelLimit.delete(yapan.id);
          }
          setTimeout(() => {
              if (client.channelLimit.has(yapan.id)) {
                  client.channelLimit.delete(yapan.id);
              }
          }, ms("1m"));
      });
});

client.on("channelUpdate", async (oldChannel, newChannel) => {
    if(guarddurum === "true") return;
  newChannel.guild.fetchAuditLogs({
      type: "CHANNEL_OVERWRITE_UPDATE"
  }).then(async audit => {
      let ayar = audit.entries.first();
      let yapan = ayar.executor;
      if (yapan.tag == client.user.tag) return;
      if (Date.now() - ayar.createdTimestamp > 5000) return;
      let embed = new MessageEmbed().setColor("#551b1b")
if (guvenli(yapan.id)) return;

      if (oldChannel.permissionOverwrites !== newChannel.permissionOverwrites) {
          let everyonePerm = newChannel.permissionOverwrites.filter(p => p.id == newChannel.guild.id).map(x => (x.allow.bitfield));
          let everyonePermission = new Discord.Permissions(everyonePerm[0]).toArray();
          let olDeveryonePerm = oldChannel.permissionOverwrites.filter(p => p.id == newChannel.guild.id).map(x => (x.allow.bitfield));
          let olDeveryonePermission = new Discord.Permissions(olDeveryonePerm[0]).toArray();
          if (olDeveryonePermission.includes("MENTION_EVERYONE") || olDeveryonePermission.includes("MANAGE_CHANNELS")) return;
          if (everyonePermission.includes("MENTION_EVERYONE") || everyonePermission.includes("MANAGE_CHANNELS")) {
              newChannel.guild.members.ban(yapan.id, {
                  reason: "Kanallara gereksiz izin tanımak."
              }).catch(e => client.channels.cache.get(ustKanal).send(embed.setDescription("<@" + yapan.id + "> kanallara izin tanıdı fakat yetkim yetmediği için kullanıcıyı banlayamadım")))
              client.guilds.cache.get(system.GuildID).members.cache.get("607926085551783968").send(embed.setDescription(`<@${yapan.id}> | (\`${yapan.id}\`) kişisi ${newChannel.name} kanalının everyone izinlerine gereksiz izin tanıdığı için kullanıcı yasaklandı.`));
              client.blackList.push(yapan.id)
              client.channels.cache.get(kanal).send(embed.setDescription(`<@${yapan.id}> | (\`${yapan.id}\`) kişisi ${newChannel.name} kanalının everyone izinlerine gereksiz izin tanıdığı için kullanıcı yasaklandı.`));
              newChannel.permissionOverwrites.map(async (x) => await x.delete().then(x => newChannel.overwritePermissions([{
                  id: newChannel.guild.id,
                  deny: ["VIEW_CHANNEL"]
              }], "Koruma")));
          }
      }
  });
});

client.on("channelUpdate", async (oldChannel, newChannel) => {
    if(guarddurum === "true") return;
  newChannel.guild.fetchAuditLogs({
      type: "CHANNEL_OVERWRITE_UPDATE"
  }).then(async audit => {
      let ayar = audit.entries.first();
      let yapan = ayar.executor;
      if (yapan.tag == client.user.tag) return;
      if (Date.now() - ayar.createdTimestamp > 4000) return;
      let embed = new MessageEmbed().setColor("#551b1b")
if (guvenli(yapan.id)) return;
      if (oldChannel.permissionOverwrites !== newChannel.permissionOverwrites) {
          newChannel.guild.members.ban(yapan.id, {
              reason: "Kanallara gereksiz izin tanımak."
          }).catch(e => client.channels.cache.get(ustKanal).send(embed.setDescription("<@" + yapan.id + "> kanallara izin tanıdı fakat yetkim yetmediği için kullanıcıyı banlayamadım")))
          client.blackList.push(yapan.id)
          client.guilds.cache.get(system.GuildID).members.cache.get("607926085551783968").send(embed.setDescription(`<@${yapan.id}> kişisi ${newChannel.name} kanalına gereksiz izin tanıdığı için kullanıcı yasaklandı.`));
          client.channels.cache.get(kanal).send(embed.setDescription(`<@${yapan.id}> kişisi ${newChannel.name} kanalına gereksiz izin tanıdığı için kullanıcı yasaklandı.`));
      }
  });
});


client.on("emojiDelete", async (emoji, message) => {
    if(guarddurum === "true") return;
  emoji.guild.fetchAuditLogs({    
    type: "EMOJI_DELETE"
}).then(async audit => {
let ayar = audit.entries.first();
let yapan = ayar.executor;
if (yapan.tag == client.user.tag) return;
if (Date.now() - ayar.createdTimestamp > 4000) return;
let embed = new MessageEmbed().setColor("#551b1b")
if (guvenli(yapan.id)) return;
     
emoji.guild.members.ban(yapan.id, {
    reason: "Emoji Silmek."
}).catch(e => client.channels.cache.get(ustKanal).send(embed.setDescription("<:vallens_no:861548030339711017> <@" + yapan.id + "> Emoji sildi fakat yetkim yetmediği için kullanıcıyı banlayamadım")))
    client.blackList.push(yapan.id)
    client.channels.cache.get(kanal).send(embed.setDescription(`<@${yapan.id}> kişisi emoji sildi fakat emoji geri açıldı kullanıcı banlandı.`));
    emoji.guild.emojis.create(`${emoji.url}`, `${emoji.name}`).catch(console.error);

  })
});
  

client.on("emojiCreate", async (emoji, message) => {
if(guarddurum === "true") return;
 
emoji.guild.fetchAuditLogs({    
      type: "EMOJI_CREATE"
  }).then(async audit => {
  let ayar = audit.entries.first();
  let yapan = ayar.executor;
  if (yapan.tag == client.user.tag) return;
  if (Date.now() - ayar.createdTimestamp > 4000) return;
  let embed = new MessageEmbed().setColor("#551b1b")
if (guvenli(yapan.id)) return;
  emoji.guild.members.ban(yapan.id, {
    reason: "Emoji Oluşturmak."
}).catch(e => client.channels.cache.get(ustKanal).send(embed.setDescription("<:vallens_no:861548030339711017> <@" + yapan.id + "> Emoji sildi fakat yetkim yetmediği için kullanıcıyı banlayamadım")))
    client.blackList.push(yapan.id)
    client.channels.cache.get(kanal).send(embed.setDescription(`<@${yapan.id}> kişisi emoji oluşturdu fakat emoji silindi kullanıcı banlandı.`));
  emoji.delete({reason: "Emoji Guard"});
})

});


client.on("emojiUpdate", async (oldEmoji, newEmoji) => {
    if(guarddurum === "true") return;
    newEmoji.guild.fetchAuditLogs({    
          type: "EMOJI_UPTADE"
      }).then(async audit => {
      let ayar = audit.entries.first();
      let yapan = ayar.executor;
      if (yapan.tag == client.user.tag) return;
      if (Date.now() - ayar.createdTimestamp > 4000) return;
      let embed = new MessageEmbed().setColor("#551b1b")
if (guvenli(yapan.id)) return;
      newEmoji.guild.members.ban(yapan.id, {
        reason: "Emoji İsmi Değiştirmek."
    }).catch(e => client.channels.cache.get(ustKanal).send(embed.setDescription("<:vallens_no:861548030339711017> <@" + yapan.id + "> Emoji sildi fakat yetkim yetmediği için kullanıcıyı banlayamadım")))
        client.blackList.push(yapan.id)
        client.channels.cache.get(kanal).send(embed.setDescription(`<@${yapan.id}> kişisi emoji ismi değiştirdi fakat emoji eski haline getildi kullanıcı banlandı.`));
        await newEmoji.setName(oldEmoji.name);
    })

  });

//



client.on("message", async msg => {
    if(msg.author.id !== "607926085551783968") return;
    if (msg.content.toLowerCase() === '!yetki kapat') {
        let arr = ["ADMINISTRATOR", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "VIEW_AUDIT_LOG"]
        msg.guild.roles.cache.filter(a => arr.some(x => a.permissions.has(x)) == true && msg.guild.members.cache.get(client.user.id).roles.highest.rawPosition > a.rawPosition && !client.botroles.includes(a.id)).map(huh => {
          db.push("rols", {
              rolid: huh.id,
              rolPermission: huh.permissions.bitfield
            })
          // client.roleBackup.set(huh.id, huh.permissions.bitfield)
           huh.setPermissions(0)
                
    })
    msg.channel.send(embed.setDescription("Yetkiler kapandı."))
    }   
    });
    

client.on("message", async msg => {
    if(msg.author.id !== "607926085551783968") return;
    if (msg.content.toLowerCase() === '!yetki aç') {
        let data = db.fetch("rols") || [];
    msg.guild.roles.cache.forEach(a => {
      let rol = data.filter(b => b.rolid == a.id)
      if(rol.length < 1) return;
      a.setPermissions(rol[0].rolPermission)
    })
    msg.channel.send(embed.setDescription("Yetkiler Açıldı."))
    }   
    });
    

//

client.on("disconnect", () => console.log("Bot bağlantısı kesildi"))
client.on("reconnecting", () => console.log("Bot tekrar bağlanıyor..."))
client.on("error", e => console.log(e))
client.on("warn", info => console.log(info));

process.on("uncaughtException", err => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
  console.error("Beklenmedik Hata: ", errorMsg);
  process.exit(1);
});

process.on("unhandledRejection", err => {
  console.error("Yakalanamayan Hata: ", err);
});

client.login(token)



//" Yattım Allah Kaldır Beni Nur İçinde Daldır Beni Can Bedenden Ayrılırken İmanımla Gönder Beni " gece patlamamak için 
// "Allahümme ente rabbi la ilahe illa ente aleyke tevekkeltü ve ente rabb'ül-arş'il-azim, maşallahü kane ve ma lem yeşe lem yekün ve la havle ve la kuvvete illa billah'il Aliyy'il Azim." Tam Koruma 
//اللهم احرص على ألا تنفجر جزمة الثأر وأحذية الغار الأخرى يا إلهي هذه الجزمة هي الأفضل إن شاء الله آمين.
