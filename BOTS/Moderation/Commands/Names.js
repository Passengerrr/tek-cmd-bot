const { MessageEmbed } = require("discord.js");
const db = require("fera.db");
const moment = require("moment");
const roles = require("../../../_BOOT/roles.json")
module.exports.execute = async(client, message, args) => {

  if (!message.member.roles.cache.has(roles.BotCommands) && !message.member.hasPermission("ADMINISTRATOR")) return;

    let embed = new MessageEmbed().setColor('RANDOM')
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!uye) return message.channel.send(`Bir Kullanıcı Belirtmelisin`).then((msg) => msg.delete({ timeout:5000 }))
    let data = await db.fetch(`isimler.${uye.id}`)
    if (!data) return message.channel.send(`Bu Kullanıcının geçmiş isimleri bulunamadı.`).then((msg) => msg.delete({ timeout:5000 }))    
    data = data.reverse();
    let isimler = data.map((value, index) => ` \`• ${value.isim}\` ${value.kayıtsekil}`).splice(0, 30)
    let datax = db.get(`sicil.${uye.id}.${message.guild.id}`) || [];
    let cpuan = db.get(`cezapuan.${uye.id}.${message.guild.id}`);

    message.channel.send(embed.setDescription(`\n${uye}, Kullanıcısının toplam ${isimler.length} kayıtı bulundu.Geçmiş isimleri aşağıda sıralanmıştır;\n\n${isimler.join("\n")}\n────────────────────────────────────────────\nKullanıcının Cezapuanı: ${cpuan || '0'} Verilen Ceza Sayısı: ${datax.length || '0'} \nDiğer ceza verilerine bakmak için \`.cezalar @Uye\` komutunu uygulayın.`));
    if (data.length > 30) return message.channel.send(embed.setDescription(`${uye}, Kullanıcısının toplam ${data.length} kayıtı bulundu.\nKullancının 30 ya da daha fazla isim kayıtı olduğu için son 30 ismi görüntülendir.\n${isimler.join("\n")}`));
}
module.exports.configuration = {
  name: "Names",
  aliases: ["isimler","names","nicks"],
  usage: "",
  description: ""
};