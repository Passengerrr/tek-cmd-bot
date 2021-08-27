const Discord = require('discord.js');
const mongoose = require('mongoose');
const db = require('fera.db')
const moment = require("moment")
const client = new Discord.Client();
const emoji = require("../../_BOOT/emojiler.json")
const channels = require('./../../_BOOT/channels.json')
const tokens = require("../../_BOOT/tokens.json")
const system = require("../../_BOOT/system.json")
const whitelists = require("../../_DATABASE/whitelist.json")
const owner = require("../../_BOOT/guards.json")
mongoose.connect(system.Mongo_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true
}).catch(err => console.log(err))

const RoleData = require("./models/role.js")
const ChannelData = require("./models/channel.js")

client.on("ready", async () => {
    console.log(`${client.user.tag} İsmi ile giriş yapıldı! Database Online.`);    
});

let backupdurum = db.fetch(`backupdurum`)
let Tokens = tokens.axualurys
let danger = false;
let Bots = [] 

Tokens.forEach(token => {
    let bot = new Discord.Client();
      bot.on("ready", () => {
        bot.user.setPresence({ status: system.ABot_Status });
        bot.Busy = false;
        bot.Uj = 0;
        Bots.push(bot);
    })
    bot.login(token).then(e => {
    }).catch(e => {
        console.error(`${token.substring(Math.floor(token.length / 2))} giriş yapamadı.`);
    });
});

function guvenli(kisiID) {
    let uye = client.guilds.cache.get(system.GuildID).members.cache.get(kisiID);
    let guvenliler = whitelists.ownerlist || [];
    if (!uye || uye.id === client.user.id || uye.id === owner.Owners || uye.id === uye.guild.owner.id || guvenliler.some(g => uye.id === g.slice(0) || uye.roles.cache.has(g.slice(0)))) return true
    else return false;
  };

client.on("roleDelete", async (role) => {
    let backupdurum = db.fetch("backupdurum")
    if (backupdurum  == "true") return;
    let entry = await role.guild.fetchAuditLogs({type: 'ROLE_DELETE'}).then(audit => audit.entries.first()); 
    if (guvenli(entry.executor.id)) return;
    let logKanali = client.channels.cache.get(channels.databaselog);
    logKanali.send("Güvenlide Olmayan Biri Tarafından \`Rol Silindiği\` İçin Backuplandıma işlemi durduruldu.")
    db.set("backupdurum","true")
})

client.on("channelDelete", async (channel) => {
    let backupdurum = db.fetch("backupdurum")
    if (backupdurum  == "true") return;
    let entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_DELETE'}).then(audit => audit.entries.first());
    if (guvenli(entry.executor.id)) return;
    let logKanali = client.channels.cache.get(channels.databaselog);
    logKanali.send("Güvenlide Olmayan Biri Tarafından \`Kanal Silindiği\` İçin Backuplandıma işlemi durduruldu.")
    db.set("backupdurum","true")
})

client.on("roleUpdate", async (oldRole, newRole) => {
    let backupdurum = db.fetch("backupdurum")
    if (backupdurum  == "true") return;
    let entry = await newRole.guild.fetchAuditLogs({type: 'ROLE_UPDATE'}).then(audit => audit.entries.first());
    if (guvenli(entry.executor.id)) return;
    let logKanali = client.channels.cache.get(channels.databaselog);
    logKanali.send("Güvenlide Olmayan Biri Tarafından \`Rol Güncellendiği\` İçin Backuplandıma işlemi durduruldu.")
    db.set("backupdurum","true")
})

client.on("channelUpdate", async (oldChannel, newChannel) => {
    let backupdurum = db.fetch("backupdurum")
    if (backupdurum  == "true") return;
    let entry = await newChannel.guild.fetchAuditLogs({type: 'CHANNEL_UPDATE'}).then(audit => audit.entries.first());
    if (guvenli(entry.executor.id)) return;
    let logKanali = client.channels.cache.get(channels.databaselog);
    logKanali.send("Güvenlide Olmayan Biri Tarafından \`Kanal Güncellendiği\` İçin Backuplandıma işlemi durduruldu.")
    db.set("backupdurum","true")
})

client.on("channelCreate", async channel => {
    let backupdurum = db.fetch("backupdurum")
    if (backupdurum  == "true") return;
    let entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_CREATE'}).then(audit => audit.entries.first());
    if (guvenli(entry.executor.id)) return;
    let logKanali = client.channels.cache.get(channels.databaselog);
    logKanali.send("Güvenlide Olmayan Biri Tarafından \`Kanal Oluşturulduğu\` İçin Backuplandıma işlemi durduruldu.")
    db.set("backupdurum","true")
})
  
client.on("roleCreate", async role => {
    let backupdurum = db.fetch("backupdurum")
    if (backupdurum  == "true") return;
    let entry = await role.guild.fetchAuditLogs({type: 'ROLE_CREATE'}).then(audit => audit.entries.first());
    if (guvenli(entry.executor.id)) return;
    let logKanali = client.channels.cache.get(channels.databaselog);
    logKanali.send("Güvenlide Olmayan Biri Tarafından \`Rol Oluşturulduğu\` İçin Backuplandıma işlemi durduruldu.")
    db.set("backupdurum","true")
})

function setRoleBackup() {
    let backupdurum = db.fetch(`backupdurum`)
    if (backupdurum  == "true") return;
    let guild = client.guilds.cache.get(system.GuildID);
    if (guild) {
        guild.roles.cache.filter(r => r.name !== "@everyone" && !r.managed).forEach(role => {
            let roleChannelOverwrites = [];
            guild.channels.cache.filter(c => c.permissionOverwrites.has(role.id)).forEach(c => {
                let channelPerm = c.permissionOverwrites.get(role.id);
                let pushlanacak = { id: c.id, allow: channelPerm.allow.toArray(), deny: channelPerm.deny.toArray() };
                roleChannelOverwrites.push(pushlanacak);
            });
            RoleData.findOne({ roleID: role.id}, async (err, savedRole) => {
                if (!savedRole) {
                    let newRoleSchema = new RoleData({
                        _id: new mongoose.Types.ObjectId(),
                        guildID: system.GuildID,
                        roleID: role.id,
                        name: role.name,
                        color: role.hexColor,
                        hoist: role.hoist,
                        position: role.position,
                        permissions: role.permissions,
                        mentionable: role.mentionable,
                        time: Date.now(),
                        members: role.members.map(m => m.id),
                        channelOverwrites: roleChannelOverwrites
                    });
                    newRoleSchema.save();
                } else {
                    savedRole.guildID = system.GuildID
                    savedRole.name = role.name;
                    savedRole.color = role.hexColor;
                    savedRole.hoist = role.hoist;
                    savedRole.position = role.position;
                    savedRole.permissions = role.permissions;
                    savedRole.mentionable = role.mentionable;
                    savedRole.time = Date.now();
                    savedRole.members = role.members.map(m => m.id);
                    savedRole.channelOverwrites = roleChannelOverwrites;
                    savedRole.save();
                };
            });
        }); //1000*60*60*3
        RoleData.find({guildID: system.GuildID}).sort().exec((err, roles) => {
            roles.filter(r => !guild.roles.cache.has(r.roleID) && Date.now()-r.time > 1000*60*60*3).forEach(r => {
                RoleData.findOneAndDelete({roleID: r.roleID});
            });
        });
    };
};
  
function setChannelBackup() {
    let guild = client.guilds.cache.get(system.GuildID);
    if (guild) {
        let backupdurum = db.fetch(`backupdurum`)
        if (backupdurum  == "true") return;
        guild.channels.cache.filter(kanal => kanal.deleted !== true).forEach(channel => {
            let permissionss = {};
            let sayi = Number(0);
            channel.permissionOverwrites.forEach((perm) => {
                let thisPermOverwrites = {};
                perm.allow.toArray().forEach(p => {
                    thisPermOverwrites[p] = true;
                });
                perm.deny.toArray().forEach(p => {
                    thisPermOverwrites[p] = false;
                });
                permissionss[sayi] = {permission: perm.id == null ? guild.id : perm.id, thisPermOverwrites};
                sayi++;
            })
            ChannelData.findOne({ channelID: channel.id}, async (err, savedChannel) => {
                if (!savedChannel) {
                    if(channel.type === "voice"){
                        let newChannelSchema = new ChannelData({
                            _id: new mongoose.Types.ObjectId(),
                            guildID: system.GuildID,
                            channelID: channel.id,
                            name: channel.name,
                            parentID: channel.parentID,
                            position: channel.position,
                            time: Date.now(),
                            type: channel.type,
                            permissionOverwrites: permissionss,
                            userLimit: channel.userLimit,
                            bitrate: channel.bitrate
                        });
                        newChannelSchema.save();
                    } else if(channel.type === "category"){
                        let newChannelSchema = new ChannelData({
                            _id: new mongoose.Types.ObjectId(),
                            guildID: system.GuildID,
                            channelID: channel.id,
                            name: channel.name,
                            position: channel.position,
                            time: Date.now(),
                            type: channel.type,
                            permissionOverwrites: permissionss,
                        });
                        newChannelSchema.save();
                    } else {
                        let newChannelSchema = new ChannelData({
                            _id: new mongoose.Types.ObjectId(),
                            guildID: system.GuildID,
                            channelID: channel.id,
                            name: channel.name,
                            parentID: channel.parentID,
                            position: channel.position,
                            time: Date.now(),
                            nsfw: channel.nsfw,
                            rateLimitPerUser: channel.rateLimitPerUser,
                            type: channel.type,
                            topic: channel.topic ? channel.topic : "Weka's Backup ?",
                            permissionOverwrites: permissionss,
                        });
                        newChannelSchema.save();
                    }
                } else {
                    if(channel.type === "voice"){
                        savedChannel.guildID = system.GuildID
                        savedChannel.name = channel.name;
                        savedChannel.parentID = channel.parentID;
                        savedChannel.position = channel.position;
                        savedChannel.type = channel.type;
                        savedChannel.time = Date.now();
                        savedChannel.permissionOverwrites = permissionss;
                        savedChannel.userLimit = channel.userLimit;
                        savedChannel.bitrate = channel.bitrate;
                        savedChannel.save();
                    } else if(channel.type === "category"){
                        savedChannel.guildID = system.GuildID
                        savedChannel.name = channel.name;
                        savedChannel.position = channel.position;
                        savedChannel.type = channel.type;
                        savedChannel.time = Date.now();
                        savedChannel.permissionOverwrites = permissionss;
                        savedChannel.save();
                    } else {
                        savedChannel.guildID = system.GuildID
                        savedChannel.name = channel.name;
                        savedChannel.parentID = channel.parentID;
                        savedChannel.position = channel.position;
                        savedChannel.nsfw = channel.nsfw;
                        savedChannel.rateLimitPerUser = channel.rateLimitPerUser;
                        savedChannel.type = channel.type;
                        savedChannel.time = Date.now();
                        savedChannel.topic = channel.topic ? channel.topic : "Weka's Backup ?";
                        savedChannel.permissionOverwrites = permissionss;
                        savedChannel.save();
                    }
                };
            });
        })
        ChannelData.find({guildID: system.GuildID}).sort().exec((err, channels) => {
            channels.filter(r => !guild.channels.cache.has(r.channelID) && Date.now()-r.time > 1000*60*60*3).forEach(r => {
                ChannelData.findOneAndDelete({channelID: r.channelID});
            });
        });
    };
};

client.on("message", async message => {
    let messageArray = message.content.split(" ");
    let args = messageArray.slice(1);
    let cmd = messageArray[0]
    if (cmd === '!yaz') {
        console.log("test")
        message.channel.send(args[0])
    }

    if (cmd === "!kur") {
        if (!owner.Owners.includes(message.author.id)) return;
        if (!args[0] || isNaN(args[0])) return message.channel.send(`Geçerli bir Kanal ID'si belirtmelisin.`);
        ChannelData.findOne({channelID: args[0]}, async (err, channelData) => {
            if (!channelData) return message.channel.send("Belirtilen Kanal ID'si ile ilgili veri tabanında veri bulunamadı!");
            await message.channel.send(`${channelData.name} Kanalının backup'ını kullanıcak.`).then(msg => {
                msg.react(emoji.yes);
                const onay = (reaction, user) => reaction.emoji.name === emoji.yesisim && user.id === message.author.id;
                const collect = msg.createReactionCollector(onay, { time: 60000 });
                collect.on("collect", async r => {
                    setTimeout(async function(){
                        msg.delete().catch(err => console.log(`Backup mesajı silinemedi.`));
                        message.guild.channels.create(channelData.name, {type: channelData.type}).then(channel => {
                            if(channel.type === "voice"){
                                channel.setBitrate(channelData.bitrate);
                                channel.setUserLimit(channelData.userLimit);
                                channel.setParent(channelData.parentID);
                                channel.setPosition(channelData.position);
                                if(Object.keys(channelData.permissionOverwrites[0]).length > 0) {
                                    for (let i = 0; i < Object.keys(channelData.permissionOverwrites[0]).length; i++) {
                                        channel.createOverwrite(channelData.permissionOverwrites[0][i].permission, channelData.permissionOverwrites[0][i].thisPermOverwrites);
                                    };
                                };
                            } else if(channel.type === "category"){
                                if(Object.keys(channelData.permissionOverwrites[0]).length > 0) {
                                    for (let i = 0; i < Object.keys(channelData.permissionOverwrites[0]).length; i++) {
                                        channel.createOverwrite(channelData.permissionOverwrites[0][i].permission, channelData.permissionOverwrites[0][i].thisPermOverwrites);
                                    };
                                };
                            } else {
                                channel.setRateLimitPerUser(channelData.setRateLimitPerUser);
                                channel.setTopic(channelData.topic);
                                channel.setParent(channelData.parentID);
                                channel.setPosition(channelData.position);
                                if(Object.keys(channelData.permissionOverwrites[0]).length > 0) {
                                    for (let i = 0; i < Object.keys(channelData.permissionOverwrites[0]).length; i++) {
                                        channel.createOverwrite(channelData.permissionOverwrites[0][i].permission, channelData.permissionOverwrites[0][i].thisPermOverwrites);
                                    };
                                };
                            };
                        });
                    }, 450)
                })
            })
        });
    }

    if (cmd === "!rolal") {
    if (backupdurum  == "true") return;
    setRoleBackup()
    message.channel.send("Rol backup datası düzenlendi.")
    }

    if (cmd === "!kanalal") {
    if (backupdurum  == "true") return;
    setChannelBackup()
    message.channel.send("Kanal backup datası düzenlendi.")
    }

    
    if (cmd === "!dağıt") {
        if (!owner.Owners.includes(message.author.id)) return;
        if (!args[0] || isNaN(args[0])) return message.channel.send(`Geçerli bir Rol ID'si belirtmelisin.`);
        RoleData.findOne({roleID: args[0]}, async (err, roleData) => {
            if (!roleData) return message.channel.send("Belirtilen Rol ID'si ile ilgili veri tabanında veri bulunamadı!");
            await message.channel.send(`${roleData.name} rolün backup'ını kullanılacak.`).then(msg => {
                msg.react(emoji.yes);
                const onay = (reaction, user) => reaction.emoji.name === emoji.yesisim && user.id === message.author.id;
                const collect = msg.createReactionCollector(onay, { time: 60000 });
                collect.on("collect", async r => {
                    setTimeout(async function(){
                        msg.delete().catch(err => console.log(`Backup mesajı silinemedi.`));
                        let yeniRol = await message.guild.roles.create({
                            data: {
                                name: roleData.name,
                                color: roleData.color,
                                hoist: roleData.hoist,
                                permissions: roleData.permissions,
                                position: roleData.position,
                                mentionable: roleData.mentionable
                            }
                        });
                        setTimeout(() => {
                            let kanalPermVeri = roleData.channelOverwrites;
                            if (kanalPermVeri) kanalPermVeri.forEach((perm, index) => {
                                let kanal = message.guild.channels.cache.get(perm.id);
                                if (!kanal) return;
                                setTimeout(() => {
                                    let yeniKanalPermVeri = {};
                                    perm.allow.forEach(p => {
                                        yeniKanalPermVeri[p] = true;
                                    });
                                    perm.deny.forEach(p => {
                                        yeniKanalPermVeri[p] = false;
                                    });
                                    kanal.createOverwrite(yeniRol, yeniKanalPermVeri).catch(console.error);
                                }, index*5000);
                            });
                        }, 5000);
                        let length = roleData.members.length;
                        if(length <= 0) return console.log(`[${roleData.roleID}] Kayıtlı üye olmadığından dolayı rol dağıtımı gerçekleştirmedim.`);
                        let availableBots = Bots.filter(e => !e.Busy);
                        if(availableBots.length <= 0) availableBots = Bots.sort((x,y) => y.Uj - x.Uj).slice(0, Math.round(length / Bots.length));
                        let perAnyBotMembers = Math.floor(length / availableBots.length);
                        if(perAnyBotMembers < 1) perAnyBotMembers = 1;
                        for (let index = 0; index < availableBots.length; index++) {
                            const bot = availableBots[index];
                            if(yeniRol.deleted){
                                console.log(`[${roleData.roleID}] Olayından sonra ${bot.user.username} - rol tekrar silindi, döngü kırılıyor.`);
                                break;
                            }
                            processBot(bot, true, perAnyBotMembers);
                            let ids = roleData.members.slice(index * perAnyBotMembers, (index + 1) * perAnyBotMembers);
                            if(ids.length <= 0) {processBot(bot, false, -perAnyBotMembers); break;}
                            let guild = bot.guilds.cache.first();
                            ids.every(async id => {
                                if(yeniRol.deleted){
                                    processBot(bot, false, -perAnyBotMembers);
                                    console.log(`[${roleData.roleID}] Olayından sonra ${bot.user.username} - rol tekrar silindi, döngü kırılıyor. #2`);
                                    return false;
                                }
                                let member = guild.member(id);
                                if(!member){
                                    console.log(`[${roleData.roleID}] Olayından sonra ${bot.user.username} - ${id}'yi bulamadım.`);
                                    return true;
                                }
                                await member.roles.add(yeniRol.id).then(e => {console.log(`${bot.user.username} - ${id} ${yeniRol.name} rolünü aldı.`);}).catch(e => {console.log(`[${roleData.roleID}] Olayından sonra ${bot.Bot.user.username} - ${id}'ye rol veremedim.`);});
                            });
                            processBot(bot, false, -perAnyBotMembers);
                        }
                    }, 450)
                })
            })
        });
    }
});






client.on('ready', async () => {
    setInterval(() => {
        let backupdurum = db.fetch(`backupdurum`)
        if (backupdurum  == "true") return;
            setRoleBackup();
            setChannelBackup();
            client.channels.cache.get(channels.databaselog).send("Backup alındı \`Kanal\` , \`Rol\` veritabanı düzenlendi.")
        }, 1000*60*60*3);
})

function giveBot(length){
    if(length > Bots.length) length = Bots.length;
    let availableBots = Bots.filter(e => !e.Busy);
    if(availableBots.length <= 0) availableBots = Bots.sort((x,y) => x.Uj - y.Uj).slice(0, length);
    return availableBots;
}

function processBot(bot, busy, job, equal = false){
    bot.Busy = busy;
    if(equal) bot.Uj = job;
    else bot.Uj += job;
    let index = Bots.findIndex(e => e.user.id == bot.user.id);
    Bots[index] = bot;
}

client.on("ready", () => {
    client.user.setPresence({ activity: { name: system.Bot_Type }, status: system.Bot_Status });
    let sesKanal = client.channels.cache.get(system.Bot_Voice_Channel).join();
})
client.login(tokens.Database);