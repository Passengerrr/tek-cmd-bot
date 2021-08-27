const { MessageEmbed } = require('discord.js');
const roles = require("../../../_BOOT/roles.json")



module.exports.execute = async(client, message, args) => {

    let embed = new MessageEmbed().setColor('RANDOM').setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
    let tag = args[0]
    if (!tag) return message.channel.send("Taglı rolü verilecek bir tag belirtiniz")
    let rol = roles.tagrol

    let taglilar = message.guild.members.cache.filter(s => s.user.username.includes(tag) && !s.roles.cache.has(rol))



    taglilar.array().forEach(async(member, index) => {

        setTimeout(async() => {

            await member.roles.add(rol)

        }, index * 1000)

    })


    embed.setDescription(`

**${taglilar.size}** Adet kullanıcıya taglı rolü verilecektir.

`)

    message.channel.send(embed)

}

module.exports.configuration = {
    name: "tagdağıt",
    aliases: ["tagtara"],
    usage: "",
    description: ""
  };
  

