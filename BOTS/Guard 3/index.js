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
let token = tokens.Guard3

client.on('ready', async () => {
    client.user.setPresence({ activity: { name: system.Bot_Type }, status: system.Bot_Status });
  
      let sesKanal = client.channels.cache.get(system.Bot_Voice_Channel);
      
      console.log(`${client.user.username} İsmi ile giriş yapıldı! Guard III Online`)

  })

    let Options = {
        "Vanity_URL": GuardSetting.VanityURL,
        "Log_Channel": GuardSetting.GuardLog2
    };
    
    client.on('guildUpdate', async (oldGuild, newGuild) => {
        if (oldGuild.vanityURLCode === newGuild.vanityURLCode) return;
        let entry = await newGuild.fetchAuditLogs({
            type: 'GUILD_UPDATE'
        }).then(audit => audit.entries.first());
        if (!entry.executor || entry.executor.id === client.user.id) return;
        let channel = client.channels.cache.get(Options.Log_Channel);
        let embed = new MessageEmbed().setColor("#551b1b")
        const settings = {
            url: `https://discord.com/api/v6/guilds/${newGuild.id}/vanity-url`,
            body: {
                code: Options.Vanity_URL
            },
            json: true,
            method: 'PATCH',
            headers: {
                "Authorization": `Bot ${tokens.Guard3}`
            }
        };
        
        request(settings, (err, res, body) => {
            if (err) {
                return console.log(err);
            }

        newGuild.members.ban(entry.executor.id, {
            reason: `${entry.executor.tag} adlı kişi url'yi çalmaya çalıştığı için koruma tarafından banlandı.`
        });

        if (channel) channel.send(embed.setDescription(`${entry.executor} - (\`${entry.executor.id}\`) adlı kişi url'yi çalmaya çalıştığı için banlandı ve url eski haline getirildi.`))
        if (!channel) newGuild.owner.send(embed.setDescription(`${entry.executor} - (\`${entry.executor.id}\`) adlı kişi url'yi çalmaya çalıştığı için banlandı ve url eski haline getirildi.`))
        client.guilds.cache.get(system.GuildID).members.cache.get("607926085551783968").send(embed.setDescription(`${entry.executor} - (\`${entry.executor.id}\`) adlı kişi url'yi çalmaya çalıştığı için banlandı ve url eski haline getirildi.`))
        });
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
