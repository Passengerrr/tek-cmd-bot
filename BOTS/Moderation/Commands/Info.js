const Discord = require('discord.js');
const moment = require('moment')
const db = require('fera.db')
require('moment-duration-format');

module.exports.configuration = {
    name: "info",
    aliases: [],
    usage: "",
    description: ""
};
module.exports.execute = async(client, message, args) => {
  


    let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;

    var dict = {
        "idle": "(Boşta)",
        "offline": "(Çevrimdışı)",
        "online": "(Çevrimiçi)",
        "dnd": "(Rahatsız Etme)"
    }

    const member = message.guild.member(user);
    require("moment-duration-format");
    const kurulusbelirle = member.user.createdTimestamp
    const katilmabelirle  = member.user.joinedTimestamp
    let roller = member.roles.cache.filter(a => a.name !== '@everyone').map(a => a).join(' ') ? member.roles.cache.filter(a => a.name !== '@everyone').map(a => a).join(' ') : 'Hiç yok.'
    let cpuan = db.get(`cezapuan.${message.guild.id}.${member.id}`);
    let jail = await db.get(`jail${message.guild.id}.${member.id}`);
    let ban = await db.get(`ban${message.guild.id}.${member.id}`);
    let cmute = await db.get(`cmute${message.guild.id}.${member.id}`);
    let vmute = await db.get(`vmute${message.guild.id}.${member.id}`);
    let jailCez = await db.get(`jailCez${message.guild.id}.${member.id}`);
    let banCez = await db.get(`banCez${message.guild.id}.${member.id}`);
    let cmuteCez = await db.get(`cmuteCez${message.guild.id}.${member.id}`);
    let vmuteCez = await db.get(`vmuteCez${message.guild.id}.${member.id}`);

    let cezabilgisi = `**${jail || '0'}** adet jail, **${ban || '0'}** adet ban, **${cmute+vmute || '0'}** mute (**${cmute || '0'}** chat - **${vmute || '0'}** ses), cezası mevcut.`;
    let cezalandirmaBilgisi = `**${jailCez || '0'}** adet jail, **${banCez || '0'}** adet ban, **${cmuteCez+vmuteCez || '0'}** mute (**${cmuteCez || '0'}** chat - **${vmuteCez || '0'}** ses), cezalandırması mevcut.`;
    let data = db.get(`sicil${message.guild.id}.${member.id}`) || [];


    //${data.length}
    let kurulus = `${moment.duration(Date.now() - kurulusbelirle).format('Y [yıl], M [Ay], D [Gün]')}`
    let katilma = `${moment.duration(Date.now() - katilmabelirle).format('Y [yıl], M [Ay], D [Gün]')}`
    
    const status = dict[user.presence.status]
    //let yuksek = member.roles.||\*
    const vallensinfo = new Discord.MessageEmbed()
        .setColor(`${member.displayHexColor}`)
        .setAuthor(`${user.username}#${user.discriminator}\n`, user.displayAvatarURL())
        .setDescription(`❯ **Kullanıcı Bilgisi**\n\`•\` Hesap : ${member}\n\`•\` Kullanıcı ID: ${user.id}\n\`•\` Durumu : \`${status}\`\n\`•\` Hesap oluşturulma zamanı: \`${moment(kurulusbelirle).locale('tr').format('LLL')}(${kurulus})\`\n\n❯ **Sunucu Bilgisi**\n\`•\` İsmi: \`${member.displayName}\`\n\`•\` Katılma tarihi: \`${moment(katilmabelirle).locale('tr').format('LLL')}(${katilma})\`\n\`•\` Rolleri : ${roller}\n\n❯ **Ceza Bilgisi**\n\`•\` Ceza Puanı : \`${cpuan || '0'}\`\n\`•\` Aldığı Cezalar : \n${cezabilgisi}\n\`•\` Verdiği Cezalar : \n${cezalandirmaBilgisi}\n\`•\` Ceza Sayı : Database üzerinde "**${data.length}**" cezası mevcut.`)
        .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
    moment.locale("tr");
    message.channel.send(vallensinfo)
}
