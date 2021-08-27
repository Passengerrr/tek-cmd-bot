const { MessageEmbed } = require("discord.js");
const db = require("fera.db");
const channels = require("../../../_BOOT/channels.json")
const system = require("../../../_BOOT/system.json")
const roles = require("../../../_BOOT/roles.json")
const emoji = require("../../../_BOOT/emojiler.json")
module.exports.execute = async (client, message, args) => {

    let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor("AQUA").setTimestamp();
    if (!message.member.roles.cache.has(roles.MuteSpear) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription(`Bu komudu kullanmak için gerekli izinlere sahip değilsin.`)).then(x => x.delete({timeout: 10000}));
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    let reason = args.splice(1).join(" ") || "Sebep belirtilmedi."
    if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send(embed.setDescription(`Bu üyenin yetkileri senden yüksek veya aynı yetkide olduğunuz için işlemi gerçekleştiremiyorum.`)).then(x => x.delete({timeout: 10000}));
    if (!member || reason.length < 1) return message.channel.send(embed.setDescription(`Komutu doğru kullanmalısın! \`Örnek: ${system.Moderationprefix || ""}unmute @üye [sebep]\``)).then(x => x.delete({timeout: 10000}));
    if (member.user.bot) return message.channel.send(embed.setDescription(`Bu komutu botlar üzerinde kullanamazsın!`)).then(x => x.delete({timeout: 10000}));

    let mutes = db.get("tempmute") || [];
    let vmutes = db.get("tempsmute") || [];

    member.roles.remove(roles.Muted).catch();
    if (mutes.some(x => x.id === member.id)) db.set("tempmute", mutes.filter(x => x.id !== member.id));
    if (vmutes.some(x => x.id === member.id)) db.set("tempsmute", vmutes.filter(x => x.id !== member.id));
    db.set(`mstatus.${message.guild.id}.${member.id}`, "false");
    db.set(`vstatus.${message.guild.id}.${member.id}`, "false");
    if (member.voice.channel) member.voice.setMute("false");

    message.channel.send(`${emoji.yes} ${member} adlı üyenin susturması ${reason} sebebi ile ${message.member.displayName} tarafından kaldırıldı.`);
    if (message.guild.channels.cache.has(channels.cezaaflog)) message.guild.channels.cache.get(channels.cezaaflog).send(`${emoji.yes} ${member} adlı üyenin susturması ${reason} sebebi ile ${message.member.displayName} tarafından kaldırıldı.`);
};

module.exports.configuration = {
  name: "unmute", 
  aliases: [],
  usage: "",
  description: ""
};
