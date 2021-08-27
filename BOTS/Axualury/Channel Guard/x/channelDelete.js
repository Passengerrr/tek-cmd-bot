const Discord = require("discord.js");
const db = require("fera.db")
const system = require("../../../../_BOOT/system.json")
const GuardSetting = require("../../../../_BOOT/guards.json")
const client = global.client;
const { MessageEmbed } = require('discord.js');
const tokens = require("../../../../_BOOT/tokens.json")
const whitelists = require("../../../../_DATABASE/whitelist.json")
let kanal = GuardSetting.GuardLog
let ustKanal = GuardSetting.NoPermissionLog

module.exports = async (channel) => {  
    function guvenli(kisiID) {
        let uye = client.guilds.cache.get(system.GuildID).members.cache.get(kisiID);
        let guvenliler = whitelists.whitelist || [];
        if (!uye || uye.id === client.user.id || uye.id === GuardSetting.Owners || uye.id === uye.guild.owner.id || guvenliler.some(g => uye.id === g.slice(0) || uye.roles.cache.has(g.slice(0)))) return true
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


    let guarddurum = db.get("guarddurum")
    if(guarddurum === "true") return;
    await channel.guild.fetchAuditLogs({
        type: "CHANNEL_DELETE"
    }).then(async (audit) => {
        let ayar = audit.entries.first()
        let yapan = ayar.executor
        if (Date.now() - ayar.createdTimestamp > 5000) return;
        let embed = new MessageEmbed().setColor("#551b1b")
  if (guvenli(yapan.id)) return;
  yetkikapat();
        await channel.guild.members.ban(yapan.id, {
            reason: "Kanal silmek"
        }).catch(e => client.channels.cache.get(ustKanal).send(embed.setDescription("<@" + yapan.id + "> kanal sildi fakat yetkim yetmediği için kullanıcıyı banlayamadım")))
  

    })
}


module.exports.configuration = {
    xchannel: "channelDelete"
}