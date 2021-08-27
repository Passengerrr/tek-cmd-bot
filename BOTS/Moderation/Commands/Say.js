const { MessageEmbed } = require("discord.js");
const extendss = require("../../../_BOOT/extends.json")
const roles = require("../../../_BOOT/roles.json")
module.exports.execute = (client, message, args) => { 
  if(!message.member.roles.cache.get(roles.BotCommands) && !message.member.hasPermission('ADMINISTRATOR')) return;

  const taggg = message.guild.members.cache.filter(m => m.user.username.includes(extendss.tag)).size
  const etiketlikrl =  message.guild.members.cache.filter(s => !s.bot).filter(member => member.user.discriminator == extendss.etiket).size;
  const swtop = message.guild.memberCount
  const online = message.guild.members.cache.filter(off => off.presence.status !== 'offline').size
  const ses = message.guild.channels.cache.filter(channel => channel.type == "voice").map(channel => channel.members.size).reduce((a, b) => a + b) 

  const mateassa = new MessageEmbed()
  .setColor('RANDOM')
  message.channel.send(mateassa.setDescription(`\`>\` Sunucumuzda Toplam \`${swtop}\` üye bulunmakta (\`${online}\`) Aktif!\n\`>\` Sunucuda taglı olarak \`${etiketlikrl+taggg}\` üye bulunmakta(İsim: \`${taggg}\` Etiket: \`${etiketlikrl}\`).\n\`>\` Ses kanallarında \`${ses}\` üye bulunmakta.`).setColor("RANDOM"));
};

module.exports.configuration = {
  name: "Say",
  aliases: ["say"],
  usage: "",
  description: ""
};