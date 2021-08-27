const Discord = require("discord.js");
const qdb = require("quick.db");
const system = require("../../../_BOOT/system.json")
const emoji = require("../../../_BOOT/emojiler.json")
const roles = require("../../../_BOOT/roles.json")
const extendss = require("../../../_BOOT/extends.json")

module.exports.configuration = {
    name: "Yasaklı-Tag",
    aliases: ['yasaklıtag',"bannedtag","yasaklı-tag","banned-tag"],
    usage: "",
    description: ""
};

module.exports.execute = async (client, message, args) => {
  if (!message.guild) return
  const db = new qdb.table("mateasytag");

    if (message.author.id === message.guild.ownerID) {
        const mateassaam = args[0]
        const mateassaa = args[1]
        if (mateassaam === "ekle") {
            var mateascik = await db.get(`mateasytag.yasaklitaglar`) || [];
            if (!await db.get(`mateasytag.yasaklitaglar`))
                mateascik = await db.set(`mateasytag.yasaklitaglar`, []);
            if (mateassaa) {
                if (mateascik.includes(mateassaa)) {
                    return message.reply(`Bu Tag Zaten Listede Bulunuyor.`).then(x => x.delete({timeout: 10000}));
                } else {
                    await db.push(`mateasytag.yasaklitaglar`, mateassaa)
                    let yasaktaglıüye = message.guild.members.cache.filter(u => u.user.username.includes(mateassaa)).size;
                    message.channel.send(`${mateassaa} tagını yasakladınız,bu tagda **${yasaktaglıüye}** kullanıcı bulunmakta.`).then(x => x.delete({timeout: 10000}));
                }
            } else {
                return message.react(emoji.no)
            }
        }
        if (mateassaam === "sil") {
            var mateascik = await db.get(`mateasytag.yasaklitaglar`) || [];
            if (!await db.get(`mateasytag.yasaklitaglar`))
                mateascik = await db.set(`mateasytag.yasaklitaglar`, []);
            if (mateassaa) {
                if (mateascik.includes(mateassaa)) {
                    let gecicidur = db.get(`gecicidurma`)      
                    db.set(`gecicidurma`,`true`)
                    var arr = mateascik
                    tagkaldır(arr, mateassaa)
                    await db.set(`mateasytag.yasaklitaglar`, arr);
                    let mateasi = message.guild.members.cache.filter(x => x.roles.cache.get(roles.YasaklıTag) && x.user.username.includes(mateassaa))
                    mateasi.array().forEach(async (user, index) => {
                        setTimeout(async () => {
                        await user.roles.set([roles.Unregister]).catch(() => {}) 
                    }, index * 500)
                    db.set(`gecicidurma`,`false`)
                    })
                } else {
                    return message.react(emoji.no)
                }
            } else {
                return message.react(emoji.no)
            }
        }
        if (mateassaam === "liste") {
          let mateascik = await db.get(`mateasytag.yasaklitaglar`);
          if (!await db.get(`mateasytag.yasaklitaglar`))
              mateascik = await db.set(`mateasytag.yasaklitaglar`, []);
          message.channel.send(new Discord.MessageEmbed()
              .setColor("RANDOM")
              .setAuthor(`${message.guild.name}`)
              .setColor(`#42130e`)
              .setDescription(`Sunucumuzda yasaklanmış taglar aşağıda sıralanmıştır.\nBu taglara sahip kişiler sunucuya girdiğinde/aldığında otamatik olarak yasaklı tag bölümüne atılırlar.\n───────────────────────────────────────────────\n\n${mateascik.map(x => {return {Id: x,Total: message.guild.members.cache.filter(u => u.user.username.includes(x)).size};}).sort((a, b) => b.Total - a.Total).splice(0, 15).map((user, index) => `**${index + 1}.**   ${user.Id}   (**${user.Total} kişi**)`).join("\n") || "Yasaklı Tag Bulunamadı"}`))}
        if (!mateassaam) {
            let mateascik = await db.get(`mateasytag.yasaklitaglar`);
            if (!await db.get(`mateasytag.yasaklitaglar`))
                mateascik = await db.set(`mateasytag.yasaklitaglar`, []);
            message.channel.send(`
Yasaklı tag işlemleri için;
.yasaklıtag ekle <tag> , .yasaklıtag sil <tag> , .yasaklıtag liste
`)
        }
    } else {
        return message.react(emoji.no)
    }
};
function tagkaldır(arr, value) { var index = arr.indexOf(value); if (index > -1) { arr.splice(index, 1); } return arr; }