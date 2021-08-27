const Discord = require("discord.js"),
client = new Discord.Client();
module.exports.execute = async (client, message, args) => {
  if (!message.member.hasPermission('ADMINISTRATOR')) return message.react(ayarlar.emojiler.red);
      
  const everyone = message.guild.roles.cache.find((a) => a.name === "@everyone");
  if (message.channel.permissionsFor(everyone).has("SEND_MESSAGES")) {
      message.channel.updateOverwrite(everyone.id, {
          SEND_MESSAGES: false
      }).catch(err => message.channel.send(`Kanal kilitlenirken bir sorun yaşandı. | Hata kodu: ${err}`));
      message.channel.send(`:no_entry_sign: Kanal başarıyla \`kilitlendi\`!`);   
  } else {
      message.channel.updateOverwrite(everyone.id, {
          SEND_MESSAGES: true
      }).catch(err => message.channel.send(`Kanal kilidi açılırken bir sorun yaşandı. | Hata kodu: ${err}`));
      message.channel.send(`Kanal kilidi başarıyla \`açıldı\`!`);
  }
}
module.exports.configuration = {
  name: "kilit",
  aliases: [],
  usage: "",
  description: ""
};