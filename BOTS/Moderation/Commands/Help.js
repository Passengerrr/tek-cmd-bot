const Discord = require("discord.js");
const { MessageEmbed } = require('discord.js')
const roles = require("../../../_BOOT/roles.json")

module.exports.configuration = {
    name: "help",
    aliases: [],
    usage: "",
    description: ""
};

module.exports.execute = async (client, message) => {
    let embedtier1 = new MessageEmbed().setDescription(`Kullanabilceğin komut listesi aşağıda sıralanmıştır;\n\n\n\`-afk\`\n\`-çek\`\n\`-help\`\n\`-info\`,\n\`-snipe\`,\n\`-nerede\`,\n\`-git\`\n\n**Prefixlerim**: ! (Ünlem), . (Nokta)`).setColor(`BLUE`)
    let embedtier2 = new MessageEmbed().setDescription(`Kullanabilceğin komut listesi aşağıda sıralanmıştır;\n\n\n\`-afk\`\n\`-ban\`\n\`-banbilgi\`\n\`-banlist\`\n\`-ceza\`\n\`-cezalar\`\n\`-çek\`\n\`-help\`\n\`-info\`,\n\`-snipe\`,\n\`-nerede\`,\n\`-git\`\n\n**Prefixlerim**: ! (Ünlem), . (Nokta)`).setColor(`BLUE`)
    let embedtier3 = new MessageEmbed().setDescription(`Kullanabilceğin komut listesi aşağıda sıralanmıştır;\n\n\n\`-afk\`\n\`-ban\`\n\`-banbilgi\`\n\`-banlist\`\n\`-ceza\`\n\`-cezalar\`\n\`-çek\`\n\`-help\`\n\`-info\`,\n\`-snipe\`,\n\`-nerede\`,\n\`-git\`\n\n**Prefixlerim**: ! (Ünlem), . (Nokta)`).setColor(`BLUE`)

    if (message.member.roles.cache.has(roles.BotCommands)) return message.channel.send(embedtier2);
    if(message.member.roles.cache.has(roles.ustcommandsrole) && message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embedtier3);
    message.channel.send(embedtier1);
}