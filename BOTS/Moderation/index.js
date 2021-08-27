const Discord = require('discord.js');
const client = new Discord.Client();
require("discord-buttons")(client);
const chalk = require('chalk');
const moment = require('moment')
var Jimp = require('jimp');
const db = require('fera.db');
const express = require('express');
const path = require('path');
const snekfetch = require('snekfetch');
const fs = require("fs");
const mongoose = require('mongoose');
const { config } = require('process');
const roles = require('../../_BOOT/roles.json')
const tokens = require("../../_BOOT/tokens.json")
const emoji = require("../../_BOOT/emojiler.json")
const channels = require("../../_BOOT/channels.json")
const system = require("../../_BOOT/system.json")
const { MessageEmbed } = require('discord.js');
const commands = new Map();
global.commands = commands;
const aliases = new Map();
global.aliases = aliases;

global.client = client;
fs.readdir("./BOTS/Moderation/Commands", (err, files) => {
if(err) return console.error(err);
files = files.filter(file => file.endsWith(".js"));
    files.forEach(file => {
    let prop = require(`./Commands/${file}`);
    if(!prop.configuration) return;
    if(typeof prop.onLoad === "function") prop.onLoad(client);
    commands.set(prop.configuration.name, prop);
    if(prop.configuration.aliases) prop.configuration.aliases.forEach(aliase => aliases.set(aliase, prop));
    });
});


fs.readdir("./BOTS/Moderation/Events", (err, files) => {
  if(err) return console.error(err);
  files.filter(file => file.endsWith(".js")).forEach(file => {
      let prop = require(`./Events/${file}`);
      if(!prop.configuration) return;
      client.on(prop.configuration.name, prop);
  });
});

client.on("message", (message) => {

const prefixes = system.Moderationprefix
const prefix = prefixes.filter(p => message.content.startsWith(p))[0];
if (!prefix || !message.channel || message.channel.type == "dm") return;
if (message.member.roles.cache.has(roles.Unregister)) return;
let args = message.content
  .substring(prefix.length)
  .split(" ");
let command = args[0];
let bot = message.client;
args = args.splice(1);
let mateas;
if (commands.has(command)) {
  let embed = new MessageEmbed().setColor("RANDOM")
  mateas = commands.get(command);
  
  mateas.execute(bot, message, args)
  if (args[0]) { 
  client.channels.cache.get(channels.KomutLog).send(`\`${message.member.displayName}\` - (\`${message.author.id}\`) kullanıcısı <#${message.channel.id}> kanalında **${mateas.configuration.name}** komutunu kullandı`)
}}
 else if (aliases.has(command)) {
  mateas = aliases.get(command);
  let embed = new MessageEmbed().setColor("#551b1b")
  mateas.execute(bot, message, args)
 if (args[0]) {
  client.channels.cache.get(channels.KomutLog).send(`\`${message.member.displayName}\` - (\`${message.author.id}\`) kullanıcısı <#${message.channel.id}> kanalında **${mateas.configuration.name}** komutunu kullandı`)
 }
}
})
client.on("ready", () => {
  console.log(`${client.user.tag} İsmi ile giriş yapıldı! Moderation Online`);
  
  client.user.setPresence({ activity: { name: system.Bot_Type }, status: system.Bot_Status });
  client.channels.cache.get(system.Bot_Voice_Channel).join();
})


client.login(tokens.Moderation)