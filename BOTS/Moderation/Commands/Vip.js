const Discord = require('discord.js');
const MessageEmbed = require('discord.js');
const channels = require("../../../_BOOT/channels.json")
const system = require("../../../_BOOT/system.json")
const roles = require("../../../_BOOT/roles.json")
const emoji = require("../../../_BOOT/emojiler.json")

module.exports.execute = async (client, message, args) => {

  let matealis = new Discord.MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor("RANDOM")
 
  if(!message.member.roles.cache.has(roles.BotCommands))
  if(!message.member.hasPermission("BAN_MEMBERS")) return  message.react(Other.no)
 
  let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])

  var vip  = message.guild.roles.cache.get(roles.Vip)

  if(!member) return message.channel.send(matealis.setDescription("Lütfen bir kullanıcı etiketleyiniz.")).then(x => x.delete({timeout: 5000}));

  if(!vip) return
if(!member.roles.cache.get(vip.id)){
  await (member.roles.add(vip.id));

  message.channel.send(matealis.setDescription(`${member}, kişisine <@&${vip.id}> rolü başarıyla verildi.`)).then(m => m.delete({ timeout: 7000 }))
  
}
  else {
    await (member.roles.remove(vip.id));

    
    message.channel.send(matealis.setDescription(`${member}, kişisinden <@&${vip.id}> rolü başarıyla alındı.`)).then(m => m.delete({ timeout: 7000 }))

  }
}

module.exports.configuration = {
  name: "Vip",
  aliases: ["elite","vip","özel"],
  usage: "",
  description: ""
};
