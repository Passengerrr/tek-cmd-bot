const Discord = require("discord.js");
const roles = require("../../../_BOOT/roles.json")
module.exports.execute = async (client, message, args) => {
if(!message.member.permissions.has('ADMINISTRATOR')) return;

if(!message.member.roles.cache.get(roles.ustcommandsrole) && !message.member.hasPermission('ADMINISTRATOR')) return;

  let firstChannel = args[0]
  let secondChannel = args[1]

     
  if(!firstChannel || !secondChannel) return message.channel.send(`Taşınılacanak kanalı ve gidilecek kanalı **belirtmedin!**`)

  
  if(!message.guild.channels.cache.get(firstChannel) || !message.guild.channels.cache.get(secondChannel)) return message.channel.send(`Belirttiğin kanallar sunucuda **bulunmuyor!**`)

  
  let firstChannelMembers = message.guild.channels.cache.get(firstChannel).members.array();
  if(firstChannelMembers.length <= 0) return message.channel.send(`Taşınılacanak kanalda kimse **bulunmuyor!**`) 

  firstChannelMembers.forEach((x, i) => {
    setTimeout(async () => {
     x.voice.setChannel(secondChannel, "Toplu taşıma işlemi")
    }, i*500)
  })
   
  await message.channel.send(`**${message.guild.channels.cache.get(firstChannel).name}** Adlı kanaldaki \`${firstChannelMembers.length}\` üye **${message.guild.channels.cache.get(secondChannel).name}** adlı kanala taşındı!`)

};

module.exports.configuration = {
  name: "topluçek",
  aliases: [],
  usage: "",
  description: ""
};