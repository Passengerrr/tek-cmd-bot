const client = global.client;
const db = require("fera.db")

module.exports = async (member) => {
    let name = `${member.displayName}`
    let cinsiyet = (`(Sunucudan Ayrılma)`)   
db.push(`isimler.${member.id}`, { 
    isim: name,
    kayıtsekil: cinsiyet
})  
}

module.exports.configuration = {
  name: "guildMemberRemove"
}