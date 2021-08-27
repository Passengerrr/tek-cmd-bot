const Discord = require('discord.js');
const tokens = [
    "ODc0Mzc5MTY2MjUyOTI0OTQw.YRGHDg.1f2sihhRE4OhcgqT_PANltTh0ts",
    "ODc0Mzc5MTkxOTIyMDc3NzA2.YRGHFA.F6GSZ6IWCh3ggVRvTukPMgL15FU",
    "ODc0Mzc5MjIwNDI2NTU1NDYz.YRGHGw.WtOJDPQEC7ONRtr4mJoIVfe_7WE",
    "ODc0Mzc5MjYxOTY2OTQyMjM4.YRGHJQ.96dwTmx-RDKsA0GAAmecX3RsLYc"
];
const chnls = [
    "874381864746508388",
    "874381879804035092",
    "874381890440802394",
    "874381902272937994"
];
const selamlı = [];
for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index];
    const client = new Discord.Client();
    client.login(token);
    let concon;
    client.on('ready', async () => {
        console.log(`${client.user.username} İsmi ile giriş yapıldı! Welcomes Online`);
        await client.user.setActivity({
            name: "Welcome Bot's",
            type: "LISTENING"
        });
        concon = await client.channels.cache.get(chnls[index]).join()
    });
    let ses;
    client.on('voiceStateUpdate', async (prev, cur) => {
        if (cur.member.user.bot) return;
        if (cur.channel && (cur.channel.id === chnls[index])) {
            if (cur.channelID === prev.channelID) return;
            if (selamlı.includes(cur.member.id) && (cur.member.roles.highest.rawPosition < cur.guild.roles.cache.get("863835918191034369").rawPosition)) {
                //console.log(selamlı);
                ses = await concon.play('./Sounds/tekrardan.mp3');
                return;
            }
            if ((cur.member.roles.highest.rawPosition < cur.guild.roles.cache.get("863835918191034369").rawPosition)) { 
                ses = await concon.play('./Sounds/yetkili.mp3');
                selamlı.push(cur.member.user.id);
            } else if (cur.member.roles.highest.rawPosition > cur.guild.roles.cache.get('863856803107700736').rawPosition) {
                ses = await concon.play('./Sounds/yetkili.mp3');
                selamlı.push(cur.member.user.id);
            }
        }
        if (prev.channel && (prev.channel.id === chnls[index]) && (prev.channel.members.size === 1) && ses) ses.end();
    });
    client.on('guildMemberUpdate', async (prev, cur) => {
        if (concon.channel.members.some(biri => biri.user.id === cur.user.id)) {
            if ((prev.roles.highest.rawPosition < cur.roles.highest.rawPosition)) {
                ses = await concon.play('./Sounds/elveda.mp3');
            }
        } else return;
    });
    client.on('voiceStateUpdate', async (prev, cur) => {
        if (cur.member.id === client.user.id) concon = await client.channels.cache.get(chnls[index]).join();
    })
}