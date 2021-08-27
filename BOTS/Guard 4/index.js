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
let token = tokens.Guard4

let guarddurum = db.get("guarddurum")

client.on('ready', async () => {
    client.user.setPresence({ activity: { name: system.Bot_Type }, status: system.Bot_Status });
  
      let sesKanal = client.channels.cache.get(system.Bot_Voice_Channel);
      
    console.log(`${client.user.username} İsmi ile giriş yapıldı! Guard II Online`)

})

function guvenli(kisiID) {
    let uye = client.guilds.cache.get(system.GuildID).members.cache.get(kisiID);
    let guvenliler = whitelists.whitelist || [];
    if (!uye || uye.id === client.user.id || uye.id === GuardSetting.Owners || uye.id === uye.guild.owner.id || guvenliler.some(g => uye.id === g.slice(0) || uye.roles.cache.has(g.slice(0)))) return true
    else return false;
  };

client.on("roleDelete", async (role) => {
    if(guarddurum === "true") return;
  await role.guild.fetchAuditLogs({
      type: "ROLE_DELETE"
  }).then(async (audit) => {
      let ayar = audit.entries.first()
      let yapan = ayar.executor 
      if (Date.now() - ayar.createdTimestamp > 5000) return;
      let embed = new MessageEmbed().setColor("RANDOM")
if (guvenli(yapan.id)) return;
      let arr = ["ADMINISTRATOR", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "VIEW_AUDIT_LOG"]
      role.guild.roles.cache.filter(a => arr.some(x => a.permissions.has(x)) == true && role.guild.members.cache.get(client.user.id).roles.highest.rawPosition > a.rawPosition && !client.botroles.includes(a.id)).map(huh => {
          huh.setPermissions(0)
      })
      await role.guild.members.ban(yapan.id, {
          reason: "Rol silmek"
      }).catch(e => client.channels.cache.get(ustKanal).send(embed.setDescription(":no_entry_sign:  <@" + yapan.id + "> rol sildi fakat yetkim yetmediği için kullanıcıyı banlayamadım")))
      client.blackList.push(yapan.id)
  })
});

client.on("roleUpdate", async (oldRole, newRole) => {
    if(guarddurum === "true") return;
  await newRole.guild.fetchAuditLogs({
      type: "ROLE_UPDATE"
  }).then(async (audit) => {
      let ayar = audit.entries.first()
      let hedef = ayar.target
      let yapan = ayar.executor
      if (Date.now() - ayar.createdTimestamp > 5000) return;
      if (yapan.id == client.user.id) return;
      let embed = new MessageEmbed().setColor("RANDOM")
if (guvenli(yapan.id)) return;
      if (oldRole.permissions !== newRole.permissions) {
          let arr = ["ADMINISTRATOR", "BAN_MEMBERS", "VIEW_AUDIT_LOG", "KICK_MEMBERS", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD"]
          if (arr.some(x => newRole.permissions.has(x)) == true) {
          //    newRole.setPermissions(0);
          }
          newRole.guild.roles.cache.filter(a => arr.some(x => a.permissions.has(x)) == true && newRole.guild.members.cache.get(client.user.id).roles.highest.rawPosition > a.rawPosition && !client.botroles.includes(a.id)).map(huh => {
              // client.backup.set(huh.id, huh.permissions.bitfield)
           //   huh.setPermissions(0)
          })
          await newRole.guild.members.ban(yapan.id, {
              reason: "Rollere gereksiz izin tanımak"
          }).catch(e => client.channels.cache.get(ustKanal).send(embed.setDescription(":no_entry_sign:  <@" + yapan.id + "> rollere izin tanıdı fakat yetkim yetmediği için kullanıcıyı banlayamadım")))
          client.blackList.push(yapan.id)
      }

  })
});


client.on("roleUpdate", async (oldRole, newRole) => {
    if(guarddurum === "true") return;
  await newRole.guild.fetchAuditLogs({
      type: "ROLE_UPDATE"
  }).then(async (audit) => {
      let ayar = audit.entries.first()
      let hedef = ayar.target
      let yapan = ayar.executor
      if (Date.now() - ayar.createdTimestamp > 5000) return;
      if (yapan.id == client.user.id) return
      let embed = new MessageEmbed().setColor("RANDOM")
if (guvenli(yapan.id)) return;
      if (oldRole.name !== newRole.name) {
          newRole.guild.members.ban(yapan.id, {
              reason: "Rol isimlerini değiştirmek."
          }).catch(e => client.channels.cache.get(ustKanal).send(embed.setDescription(":no_entry_sign:  <@" + yapan.id + "> rol ismi değişti fakat yetkim yetmediği için kullanıcıyı banlayamadım")))
          await newRole.setName(oldRole.name)
          client.blackList.push(yapan.id)
          let arr = ["ADMINISTRATOR", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "VIEW_AUDIT_LOG"]
          newRole.guild.roles.cache.filter(a => arr.some(x => a.permissions.has(x)) == true && newRole.guild.members.cache.get(client.user.id).roles.highest.rawPosition > a.rawPosition && !client.botroles.includes(a.id)).map(huh => {
              //client.roleBackup.set(huh.id, huh.permissions.bitfield)
          //    huh.setPermissions(0)
          })
      }

  })
});


client.on("roleCreate", async role => {
    await role.guild.fetchAuditLogs({
        type: "ROLE_CREATE"
    }).then(async (audit) => {
        let ayar = audit.entries.first()
        let hedef = ayar.target
        let yapan = ayar.executor
        if (Date.now() - ayar.createdTimestamp > 5000) return;
        if (yapan.id == client.user.id) return;
        let embed = new MessageEmbed().setColor("RANDOM")
if (guvenli(yapan.id)) return;
            client.channels.cache.get(kanal).send(embed.setDescription(` (\`${yapan.id}\`) | <@${yapan.id}> kişisi ${role.name} rolünü açtı rolü sildim kullanıcıyı banladım.`))
            role.guild.members.ban(yapan.id, {
                reason: "Rol Açmak."
            }).catch(e => client.channels.cache.get(ustKanal).send(embed.setDescription(":no_entry_sign:  <@" + yapan.id + "> rol ismi değişti fakat yetkim yetmediği için kullanıcıyı banlayamadım")))
            role.delete({ reason: "İzinsiz Rol Açmak" }).catch(e => { })	
            client.blackList.push(yapan.id)
            let arr = ["ADMINISTRATOR", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "VIEW_AUDIT_LOG"]
            role.guild.roles.cache.filter(a => arr.some(x => a.permissions.has(x)) == true && role.guild.members.cache.get(client.user.id).roles.highest.rawPosition > a.rawPosition && !client.botroles.includes(a.id)).map(huh => {
                //client.roleBackup.set(huh.id, huh.permissions.bitfield)
            //    huh.setPermissions(0)
            })
        
  
    })
  });






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
