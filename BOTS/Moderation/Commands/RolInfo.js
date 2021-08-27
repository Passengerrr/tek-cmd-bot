const Discord = require('discord.js');
const roles = require("../../../_BOOT/roles.json")
module.exports.execute = async (client, message, args) => {

    if (!message.member.hasPermission('ADMINISTRATOR')) 
    if(!message.member.roles.cache.has(roles.ustcommandsrole)) return;
    
 const filter = (reaction, user) => {
        return ["✅"].includes(reaction.emoji.name) && user.id === message.author.id; 
    };
    if (!args[0]) return message.channel.send("**Bir rol girin.**")
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name.toLowerCase() === args.join(' ').toLocaleLowerCase());
        if (!role) return message.channel.send("**Geçerli bir rol gir.**");
        let membersWithRole = message.guild.members.cache.filter(member => {
            return member.roles.cache.find(r => r.name === role.name);
        }).map(member => {
            return member.user;
        })

        const status = {
            false: "Hayır",
            true: "Evet"
        }
    let sesteolmayan = message.guild.members.cache.filter(s => s.roles.cache.has(role.id)).filter(s => s.presence.status !== "offline").filter(s => !s.voice.channel).map(s => s).join(' ')
    let sesteolan = message.guild.members.cache.filter(s => s.roles.cache.has(role.id)).filter(s => s.voice.channel).map(s => s).join(', ')

    let rolkisigostre =  membersWithRole.join(",")  
    if (role.members.size > 15 ) return message.channel.send(`Rol ismi: ${role.name}\nID: ${role.id}\nRol rengi: ${role.hexColor}\n──────────────────────────────────\nRolde ${role.members.size} kişi var.\nRoldeki kişi sayısı 15'den fazla olduğu için görüntüleyemem.`)

        message.channel.send(`
Rol ismi: ${role.name}
ID: ${role.id}
Rol rengi: ${role.hexColor}
──────────────────────────────────
Rolde ${role.members.size} kişi var.
Roldeki üyeler: 
${rolkisigostre}
`)      

}

module.exports.configuration = {
  name: "rolbilgi",
  aliases: ['rolinfo'],
  usage: "",
  description: ""
};