const db = require("fera.db")
const system = require("../../../_BOOT/system.json")
const tokens = require("../../../_BOOT/tokens.json")
const roles = require("../../../_BOOT/roles.json")
const channels = require("../../../_BOOT/channels.json")
const extendss = require("../../../_BOOT/extends.json")
const client = global.client;

module.exports = async (yeniii , eskiii) => {

    const guildd22 = client.guilds.cache.get(system.GuildID)
    const role = guildd22.roles.cache.get(roles.tagrol)
    const member = guildd22.members.cache.get(yeniii.id)
    const tag = extendss.tag
    const etiket = extendss.etiket
    const taglog = guildd22.channels.cache.get(channels.taglog)
    const taglılar = guildd22.members.cache.filter(m => m.user.username.includes(extendss.tag)).size
    const etiketliler =  guildd22.members.guild.members.cache.filter(s => !s.bot).filter(member => member.user.discriminator == etiket).size;
    
    if (yeniii.username !== eskiii.username) {
      
        if (eskiii.username.includes(tag) && !yeniii.username.includes(tag)) {
          if (yeniii.discriminator === etiket) return taglog.send(`───────────────────────────────────────────────────────────────────────────\n${yeniii} isminden tagımızı çıkarttı ama hala etiketimiz bulunmakta (Toplam Taglı: **${taglılar}** Toplam Etiket: **${etiketliler}**).`);
          taglog.send(`───────────────────────────────────────────────────────────────────────────\n${yeniii} kullanıcısı ismine tagımızı aldığı için taglı rolü verildi (Toplam Taglı: **${taglılar}** Toplam Etiket: **${etiketliler}**).`)
          member.roles.add(role)
        } else if (!eskiii.username.includes(tag) && yeniii.username.includes(tag)) {
          member.roles.set([roles.Unregister])
          taglog.send(`───────────────────────────────────────────────────────────────────────────\n${yeniii} kullanıcısı ismine tagımızı aldığı için taglı rolü verildi (Toplam Taglı: **${taglılar}** Toplam Etiket: **${etiketliler}**).`)
          taglog.send(`───────────────────────────────────────────────────────────────────────────\n${yeniii} isminden tagımızı çıkarttığı için taglı rolü alındı (Toplam Taglı: **${taglılar}** Toplam Etiket: **${etiketliler}**) <@&${roles.tagsorumlusu}>.`)
        }
    }
    
    if (yeniii.discriminator !== eskiii.discriminator) {
        if (eskiii.discriminator == etiket && yeniii.discriminator !== etiket) {
          if (yeniii.username.includes(tag)) return taglog.send(`───────────────────────────────────────────────────────────────────────────\n${yeniii} etiketimizi çıkarttı ama hala isim tagımız bulunmakta(Toplam Taglı: **${taglılar}** Toplam Etiket: **${etiketliler}**).`); 
          taglog.send(`───────────────────────────────────────────────────────────────────────────\n${yeniii} kullanıcısı etiketimizi aldığı için taglı rolü verildi (Toplam Taglı: **${taglılar}** Toplam Etiket: **${etiketliler}**).`)
          member.roles.set([roles.Unregister])
        } else if (eskiii.discriminator !== etiket && yeniii.discriminator == etiket) {
          member.roles.add(role)
          taglog.send(`───────────────────────────────────────────────────────────────────────────\n${yeniii} kullanıcısı etiketimizi bıraktığı için taglı rolü alındı (Toplam Taglı: **${taglılar}** Toplam Etiket: **${etiketliler}**) <@&${roles.tagsorumlusu}>.`)
    
        }
    }
    
}


module.exports.configuration = {
  name: "userUpdate"
}