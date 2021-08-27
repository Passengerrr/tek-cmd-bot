const Discord = require('discord.js');
const roles = require("../../../_BOOT/roles.json")
module.exports.execute = async (bot, message, args) => {

    if (!message.member.hasPermission('ADMINISTRATOR')) 
    if(!message.member.roles.cache.has(roles.ustcommandsrole)) return;

let mateassaa = message.guild.members.cache.filter(m => m.roles.cache.filter(r => r.id !== message.guild.id).size == 0)
// Khold#0001
if(args[0] == "ver") {
    mateassaa.forEach(r => {
r.roles.add(roles.Unregister)
})
const khold = new Discord.MessageEmbed()
.setAuthor(" "+message.author.username +" ", message.author.avatarURL())
.setColor("RANDOM")
.setDescription("Sunucuda rolü olmayan \`"+ mateassaa.size +"\` kişiye kayıtsız rolü verildi!")
message.channel.send(khold)
} else if(!args[0]) {
const khold1 = new Discord.MessageEmbed()
.setAuthor(""+message.author.username +" ", message.author.avatarURL())
.setColor("RANDOM")
.setDescription(`\`\`\`Sunucumuzda rolü olmayan "${mateassaa.size}" kişi var.\`\`\`\n\nKayıtsız rolünü dağıtmak için **!rolsüz ver** komutunuz uygulamanız yeterli`)
message.channel.send(khold1)
}


}

module.exports.configuration = {
    name: "Rolsüz",
    aliases: ['rolsuz',"rolsüz"],
    usage: "",
    description: ""
  };