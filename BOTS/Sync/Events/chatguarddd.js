const client = global.client;
const config = require("../../../_BOOT/chatguard.json")
const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const whitelist = require("../../../_DATABASE/whitelistchat.json")
const Owners = require("../../../_BOOT/guards.json")

module.exports = message => {
  if (message.author.bot || !message.guild) return;
  if (message.author.id !== Owners.Owners && message.author.id !== message.guild.owner.id) return;
  if (message.content.indexOf(config.prefix) !== 0) return;
let args = message.content.split(' ').slice(1);
let komut = message.content.split(' ')[0].slice(config.prefix.length);
let embed = new MessageEmbed().setColor("RANDOM").setFooter(`mateas.`);


if (komut === "eval" && message.author.id === Owners.Owners) {
  if (!args[0]) return
    let code = args.join(' ');
    function clean(text) {
    if (typeof text !== 'string') text = require('util').inspect(text, { depth: 0 })
    text = text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
    return text;
  };
  try { 
    var evaled = clean(eval(code));
    if(evaled.match(new RegExp(`${client.token}`, 'g'))) evaled.replace(client.token, "Yasaklı komut");
    message.channel.send(`${evaled.replace(client.token, "Yasaklı komut")}`, {code: "js", split: true});
  } catch(err) { message.channel.send(err, {code: "js", split: true}) };
};

if(komut === "chatwhite" || komut === "chatgüvenli") {
let hedef;
let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name === args.join(" "));
let uye = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
if (rol) hedef = rol;
if (uye) hedef = uye;
let guvenliler = whitelist.whitelist || [];
if (!hedef) return message.channel.send(embed.setDescription(`Güvenli listeye eklemek veya kaldırmak için bir hedef (rol/üye) belirtmelisin`).addField("Güvenli Liste", guvenliler.length > 0 ? guvenliler.map(g => (message.guild.roles.cache.has(g.slice(0)) || message.guild.members.cache.has(g.slice(0))) ? (message.guild.roles.cache.get(g.slice(0)) || message.guild.members.cache.get(g.slice(0))) : g).join('\n') : "Bulunamadı!"));
if (guvenliler.some(g => g.includes(hedef.id))) {
  guvenliler = guvenliler.filter(g => !g.includes(hedef.id));
  whitelist.whitelist = guvenliler;
  fs.writeFile("./_DATABASE/whitelistchat.json", JSON.stringify(whitelist), (err) => {
    if (err) console.log(err);
  });
  message.channel.send(embed.setDescription(`${hedef}, ${message.author} tarafından güvenli listeden kaldırıldı!`));
} else {
  whitelist.whitelist.push(`${hedef.id}`);
  fs.writeFile("./_DATABASE/whitelistchat.json", JSON.stringify(whitelist), (err) => {
    if (err) console.log(err);
  });
  message.channel.send(embed.setDescription(`${hedef}, ${message.author} tarafından güvenli listeye eklendi!`));
};
};

}


module.exports.configuration = {
  name: "message"
}