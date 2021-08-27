const client = global.client;
const channels = require("../../../_BOOT/channels.json")
const system = require("../../../_BOOT/system.json")
const roles = require("../../../_BOOT/roles.json")
const emoji = require("../../../_BOOT/emojiler.json")
const db = require("fera.db")
const { MessageMenu, MessageMenuOption, MessageButton} = require('discord-buttons');
module.exports = async (msg , oldMember, newMember) => {
    if (msg.content.toLowerCase() === 'tag') {
      if (msg.member.user.bot) return;!
        msg.channel.send(`${system.tag},#${system.etiket}`);
    }

    if (msg.content.toLowerCase() === '!tag') {
      if (msg.member.user.bot) return;
        msg.channel.send(`${system.tag},#${system.etiket}`);
    }

    if (msg.content.toLowerCase() === '.tag') {
      if (msg.member.user.bot) return;
      msg.channel.send(`${system.tag},#${system.etiket}`);
    }

    if(!msg.guild) return;
    if(msg.content.startsWith(system.Moderationprefix+"afk")) return; 
    
    let afk = msg.mentions.users.first()
   
    const kisi = db.fetch(`afkid_${msg.author.id}_${msg.guild.id}`)    
    
    const isim = db.fetch(`afkAd_${msg.author.id}_${msg.guild.id}`)
   if(afk){
     if (msg.member.user.bot) return;
     const sebep = db.fetch(`afkSebep_${afk.id}_${msg.guild.id}`)
     const kisi3 = db.fetch(`afkid_${afk.id}_${msg.guild.id}`)
     if(msg.content.includes(kisi3)){
  
    msg.channel.send(`<@`+ msg.author.id+`> etiketlediğiniz kişi __${sebep}__ sebebiyle afk.`)
    
  }
   }
    if(msg.author.id === kisi){
      if (msg.member.user.bot) return;
         msg.channel.send(`<@${kisi}> Başarıyla Afk Modundan Çıktınız`)
     db.delete(`afkSebep_${msg.author.id}_${msg.guild.id}`)
     db.delete(`afkid_${msg.author.id}_${msg.guild.id}`)
     db.delete(`afkAd_${msg.author.id}_${msg.guild.id}`)
      msg.member.setNickname(isim)
    }
//

if (msg.author.id !== system.Mateas) return;
    if (msg.content === "!button") {

    let ed = new MessageButton()
   .setStyle('red') 
   .setLabel('Etkinlik Duyuru') 
   .setID('etkinlikduyuru'); 
 
   let ck = new MessageButton()
   .setStyle('blurple') 
   .setLabel('Çekiliş Katılımıcısı') 
   .setID('cekiliskatılımcısı'); 

   if (msg.content === "!button" || msg.author.id === system.Mateas || msg.author.bot) return msg.channel.send(`:tada: Selam! Sunucumuzda @everyone, @here kullanılmayacağı için aşağıda bulunan butonlara tıklayarak Etkinlik ve Çekiliş Katılımcısı rollerinizi alabilirsiniz!\n*Sunucuya katıldığında üzerine otamatik olarak verilmiştir*`, { 
    
    buttons: [ ck, ed]
  });
}


}


module.exports.configuration = {
  name: "message"
}