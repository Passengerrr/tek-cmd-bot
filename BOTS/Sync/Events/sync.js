const db = require("fera.db")
const system = require("../../../_BOOT/system.json")
const tokens = require("../../../_BOOT/tokens.json")
const roles = require("../../../_BOOT/roles.json")
const channels = require("../../../_BOOT/channels.json")
const extendss = require("../../../_BOOT/extends.json")
const client = global.client;

module.exports = async (ready) => {  
        setInterval(() => {
          checkingAll();
          }, 5000);
        
        setInterval(() => {
          checkGuildUserStatus();
          }, 5000);


          function checkingAll() {
            let jail = db.get("jails") || [];
            let mute = db.get("tempmute") || [];
            let vmute = db.get("tempsmute")
          
            let bans = db.get("bans") || [];
            let ban = db.get("ban") || [];
            let sesmuteler = db.get("tempsmute") || [];
          
          
            for (let jailUye of jail) {
                let kullanici = client.guilds.cache.get(system.GuildID).members.cache.get(jailUye.id);
                if (kullanici && !kullanici.roles.cache.has(roles.Cezalı)) {
                    kullanici.roles.cache.has(roles.Booster) ? kullanici.roles.set([roles.Booster, roles.Cezalı]) : kullanici.roles.set([roles.cezalı]).catch();
                    if (kullanici.voice.channel) kullanici.voice.kick();
                };
            };
          
            for (let muteUye of mute) {
                let kullanici = client.guilds.cache.get(system.GuildID).members.cache.get(muteUye.id);
                if (Date.now() >= muteUye.bitis) {
                    if (kullanici && kullanici.roles.cache.has(roles.Muted)) kullanici.roles.remove(roles.Muted).catch();
                    db.set("tempmute", mute.filter(x => x.id !== muteUye.id));
                    db.set(`mstatus.${kullanici.guild.id}.${kullanici.id}`, "false");
                    }else{
                    if (kullanici && !kullanici.roles.cache.has(roles.Muted)) kullanici.roles.add(roles.Muted).catch();
                };
            };
          
            for (let vmuteUye of vmute) {
                let kullanici = client.guilds.cache.get(system.GuildID).members.cache.get(vmuteUye.id);
                if (Date.now() >= vmuteUye.kalkmaZamani) {
                    db.set("tempsmute", mute.filter(x => x.id !== vmuteUye.id));
                    db.set(`vstatus.${kullanici.guild.id}.${kullanici.id}`, "false");
                    }else{
                };
            };
           
            for (let yasak of bans) {
                let kullanici = client.guilds.cache.get(system.GuildID).members.cache.get(yasak.id);
                if (kullanici) {
                    kullanici.ban({reason: "Ban Kontrol"}).catch();
              };
            };
          };
          
          
          function checkGuildUserStatus() {
            let jail = db.get("jails") || [];
            let mute = db.get("tempmute") || [];
            let vmute = db.get("tempsmute") || [];
          
            let sunucu = client.guilds.cache.get(system.GuildID);
            client.guilds.cache.get(system.GuildID).members.cache.forEach(x => {
                if (db.has(`jstatus.${sunucu.id}.${x.id}`) && jail.some(y => y.id !== x.id)) {
                    db.set(`jstatus.${sunucu.id}.${x.id}`, "false");
                };
                if (db.has(`mstatus.${sunucu.id}.${x.id}`) && mute.some(y => y.id !== x.id)) {
                    db.set(`mstatus.${sunucu.id}.${x.id}`, "false");
                };
                if (db.has(`vstatus.${sunucu.id}.${x.id}`) && vmute.some(y => y.id !== x.id)) {
                    db.set(`vstatus.${sunucu.id}.${x.id}`, "false");
                };
            });
          };
}


module.exports.configuration = {
    name: "ready"
}