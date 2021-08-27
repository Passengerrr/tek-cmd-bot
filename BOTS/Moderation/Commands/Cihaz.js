const { MessageEmbed } = require("discord.js");

module.exports.execute = (client, message, args) => {
  
  let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
  const member = message.guild.member(user) || message.guild.members.cache.get(args[0])
  if(member.presence.status === "offline") return message.channel.send(`Aktif olmayan bir kullanıcının cihazına bakamazsın.`);
  let p = Object.keys(member.presence.clientStatus).join(',')
  let cihazisim = p
  .replace(`mobile`,`Mobil Telefon`)
  .replace(`desktop`,`Bilgisayar (Uygulama)`)
  .replace(`web`,`İnternet Tarayıcısı`)
  message.channel.send(`${user.tag.replace("`","")} üyesinin şuanda kullandığı cihaz: \`${cihazisim}\``);
}
module.exports.configuration = {
  name: "cihaz",
  aliases: [],
  usage: "",
  description: ""
};