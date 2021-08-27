const client = global.client;
const { MessageButton } = require('discord-buttons')
const channels = require("../../../_BOOT/channels.json")
const system = require("../../../_BOOT/system.json")
const roles = require("../../../_BOOT/roles.json")
const emoji = require("../../../_BOOT/emojiler.json")

module.exports = async (button) => {
    if (button.id === 'etkinlikduyuru') {
        if (button.clicker.member.roles.cache.get(roles.etkinlikduyuru)) {
            await button.clicker.member.roles.remove(roles.etkinlikduyuru)
            await button.think(true);
            await button.reply.edit("Etkinlik Duyuru Rolü Üzerinizden Alındı!")
        } else {
            await button.clicker.member.roles.add(roles.etkinlikduyuru)
            await button.think(true);
            await button.reply.edit("Etkinlik Duyuru Rolü Üzerinize Verildi!")
        }
    }
    
    
    if (button.id === 'cekiliskatılımcısı') {
      if (button.clicker.member.roles.cache.get(roles.çekilişkatılımcısı)) {
          await button.clicker.member.roles.remove(roles.çekilişkatılımcısı)
          await button.think(true);
          await button.reply.edit("Çekiliş Katılımcısı Rolü Üzerinizden Alındı!")
      } else {
          await button.clicker.member.roles.add(roles.çekilişkatılımcısı)
          await button.think(true);
          await button.reply.edit("Çekiliş Katılımcısı Rolü Üzerinize Verildi!")
      }
    }
}

module.exports.configuration = {
  name: "clickButton"
}