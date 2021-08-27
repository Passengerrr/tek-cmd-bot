const { Collection, MessageEmbed, Client } = require('discord.js');
const Mongoose = require('mongoose');
const moment = require('moment')
require('moment-duration-format');
const Bot = new Client();
const channels = require("../../_BOOT/channels.json")
const system = require("../../_BOOT/system.json")
const emoji = require("../../_BOOT/emojiler.json")
const tokens = require("../../_BOOT/tokens.json")
const ayar = require("../../_BOOT/extends.json")
const invites = {};
const queue = require('util').promisify(setTimeout);


Mongoose.connect(system.Mongo_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

// 

const MiafSchema = Mongoose.Schema({
    memberID: { type: String, default: null },
    inviterID: { type: String, default: null },
    Total: { type: Number, default: 0 },
    basarili: { type: Number, default: 0 },
    basarisiz: { type: Number, default: 0 },
    Fake: { type: Boolean, default: false }
});
const ShinoaMiafData = Mongoose.model('MiafShinoaData', MiafSchema);
const Invites = new Collection();

Bot.on("ready", () => {
    let guilda = system.GuildID
    Bot.user.setPresence({ activity: { name: system.Bot_Type }, status: system.Bot_Status });
    Bot.channels.cache.get(system.Bot_Voice_Channel).join();
    })



Bot.on('inviteCreate', (invite) => {
    const Set = Invites.get(invite.guild.id);
    Set.set(invite.code, invite);
    Invites.set(invite.guild.id, Set);
});

Bot.on('inviteDelete', (invite) => {
    const Set = Invites.get(invite.guild.id);
    Set.delete(invite.code);
    Invites.set(invite.guild.id, Set);
});
//    Bot.guilds.cache.get(system.GuildID).fetchInvites().then((x) => Invites.set(x.first().guilda, x));
Bot.on('guildMemberAdd', async (member) => {
    if (member.user.bot) return;
    const Set = (Invites.get(member.guild.id) || new Collection()).clone();
    const Sunucu = member.guild
    const Fake = Date.now() - member.user.createdTimestamp < 15 ? true : false;
    const IC = Sunucu.channels.cache.get(channels.invitechannel);


    let kurulus = member.user.createdTimestamp
    let süphe;
    if (Date.now() - kurulus < 1000 * 60 * 60 * 24 * 10 ? süphe = "Şüpheli" : süphe = "Güvenli");
    let isim = member.user.username.replace(/[^a-z^0-9^ü^ç^ğ^ö^ı]/ig, "");

    let olusturma = `${moment.duration(Date.now() - kurulus).format('Y [yıl], M [Ay], D [Gün]')}`
    let channel = member.guild.channels.cache.get(channels.registerchannel);

    if (süphe === "Güvenli") {
        Sunucu.fetchInvites().then(async invites => {
            const invite = invites.find(index => Set.has(index.code) && Set.get(index.code).uses < index.uses) || Set.find(values => !invites.has(values.code)) || Sunucu.vanityURLCode;
            Invites.set(Sunucu.id, invites);
            let basarili = 0
            if (invite.inviter && invite.inviter.id !== member.id) {
                const Database = await ShinoaMiafData.findOne({ memberID: invite.inviter.id }) || new ShinoaMiafData({ memberID: invite.inviter.id });
                if (Fake) Database.basarisiz += 1;
                else basarili = Database.basarili += 1;
                Database.Total += 1;
                Database.save();
                ShinoaMiafData.findOneAndUpdate({ memberID: member.id }, { $set: { inviterID: invite.inviter.id, Fake: Fake } }, { upsert: true, setDefaultsOnInsert: true }).exec();
            }
        if (channel) {
            if (invite === Sunucu.vanityURLCode) mesajIcerik = `${ayar.tag}(\`${ayar.etiket}\`)'e hoş geldin ${member}! Hesabın ${moment(kurulus).locale('tr').format('LLL')} tarihinde oluşturulmuş.\nSunucuya erişebilmek için tagımızı ya da etiketimizi almanız gerekli tag ve etikete \`.tag\` yazarak erişebilirsiniz.\n\nSeninle beraber ${member.guild.memberCount} kişiyiz.:tada::tada:`;
            else if (invite.inviter.id === member.id) mesajIcerik = `${ayar.tag}(\`${ayar.etiket}\`)'e hoş geldin ${member}! Hesabın ${moment(kurulus).locale('tr').format('LLL')} tarihinde oluşturulmuş.\nSunucuya erişebilmek için tagımızı ya da etiketimizi almanız gerekli tag ve etikete \`.tag\` yazarak erişebilirsiniz.\n\nSeninle beraber ${member.guild.memberCount} kişiyiz.:tada::tada:`
            else mesajIcerik = `${ayar.tag}(\`${ayar.etiket}\`)'e hoş geldin ${member}! Hesabın ${moment(kurulus).locale('tr').format('LLL')} tarihinde oluşturulmuş.\nSunucuya erişebilmek için tagımızı ya da etiketimizi almanız gerekli tag ve etikete \`.tag\` yazarak erişebilirsiniz.\n\nSeninle beraber ${member.guild.memberCount} kişiyiz.<@!${invite.inviter.id}> tarafından davet edildi ve bu kişinin ${basarili} daveti oldu!:tada::tada:`;
            channel.send(mesajIcerik);
        }
    })
} else {


if(channel) channel.send(`
${ayar.tag}(\`2020\`)'a hoş geldin ${member}! Hesabın ${moment(kurulus).locale('tr').format('LLL')} tarihinde oluşturulmuş. :no_entry_sign: 
Seninle beraber ${member.guild.memberCount} kişiyiz.
Hesabın riskli seviyede olduğu için cezalıya attım.`);
}



Sunucu.fetchInvites().then(async invites => {
    const invite = invites.find(index => Set.has(index.code) && Set.get(index.code).uses < index.uses) || Set.find(values => !invites.has(values.code)) || Sunucu.vanityURLCode;
    Invites.set(Sunucu.id, invites);
    let basarili = 0
    let mesajIcerik = `${member} sunucuya giriş yaptı.`;

    if (invite.inviter && invite.inviter.id !== member.id) {
        const Database = await ShinoaMiafData.findOne({ memberID: invite.inviter.id }) || new ShinoaMiafData({ memberID: invite.inviter.id });
        if (Fake) Database.basarisiz += 1;
        else basarili = Database.basarili += 1;
        Database.Total += 1;
        Database.save();
        ShinoaMiafData.findOneAndUpdate({ memberID: member.id }, { $set: { inviterID: invite.inviter.id, Fake: Fake } }, { upsert: true, setDefaultsOnInsert: true }).exec();
    }

    if (IC) {
        if (invite === Sunucu.vanityURLCode) mesajIcerik = `${member} sunucuya \`Özel URL\` kullanarak girdi!`;
        else if (invite.inviter.id === member.id) mesajIcerik = `${member} kendi daveti ile sunucuya giriş yaptı.`
        else mesajIcerik = `${member} katıldı! **Davet eden**: ${invite.inviter.tag} \`(${basarili} davet)\` ${Fake ? `${emoji.no}` : `${system.yes}` }`;
        IC.send(mesajIcerik);
    }

}).catch(console.error);
});

Bot.on('guildMemberRemove', async (member) => {
if (member.user.bot) return;
let basarili = 0 
let mesajIcerik = `${member} sunucudan ayrıldı.`;
const MemberData = await ShinoaMiafData.findOne({ memberID: member.id }) || {}
let IC = member.guild.channels.cache.get(channels.invitechannel);

if (!MemberData && IC) return channels.invitechannel.send(mesajIcerik);

const Database = await ShinoaMiafData.findOne({ memberID: MemberData.inviterID }) || new ShinoaMiafData({ memberID: MemberData.inviterID });

if (MemberData.Fake === true && data.inviterID && Database.basarisiz > 0) Database.basarisiz -= 1;
else if (MemberData.inviterID && Database.basarili > 0) Database.basarili -= 1;
basarili = Database.basarili
Database.Total -= 1;
Database.save();

const InviterMember = member.guild.member(MemberData.inviterID);

if (IC) {
    mesajIcerik = `${member} sunucudan ayrıldı. ${InviterMember ? `**Davet eden**: ${InviterMember.user.tag} \`(${basarili} davet)\`` : 'Davetçi bulunamadı!'}`;
    IC.send(mesajIcerik);
}
});

Bot.on('message', async (message) => {
if (message.author.bot || (message.channel.type === 'dm' && !message.guild) || !message.content.startsWith(system.Inviteprefix)) return;

const embed = new MessageEmbed().setColor(message.member.displayHexColor);
const args = message.content.slice(system.Inviteprefix.length).trim().split(/ +/);
const command = args.shift().toLowerCase();

if (command === 'invite' || command === 'davetler' || command === 'davetlerim' || command === 'invites') {
    const Member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    const Database = await ShinoaMiafData.findOne({ memberID: Member.id }) || { Total: 0, basarili: 0, basarisiz: 0 };
    if (Database.Total) {
        embed.setDescription(`${Member.id === message.author.id ? 'Senin' : `**${Member.user.tag}** sahip olduğun`} \`${Database.Total}\` davetin var. (${system.yes} \`${Database.basarili}\` Davet, ${system.no} \`${Database.basarisiz}\` Fake Davet)`);
    } else {
        embed.setDescription(`${system.no}  Kullanıcının verilerini bulamadım.`);
    }
    embed.setAuthor(Member.user.tag, Member.user.avatarURL({ dynamic: true }), `https://discord.com/users/${Member.id}`);
    message.channel.send(embed);
}  else if (command === 'NULLLLLLLLLLLLLLLLLLLLASDASDASDPOAADASSAJJIOKSDLĞPNMOKMKOPOKDFOPKDOPKKDFĞPKDKNISOĞAĞAĞAĞAĞAĞAĞAĞAĞAĞAĞAĞAĞAĞADASDJDIASASDAOSDJASDASNIDÜNASDÜNASBDBUJAhdusaHDGUAS9dsöASJDIBSAUOIYISFP' || command === 'NULLLLLLLLLLLLLLLLLLLLASDASDASDPOAADASSAJJIOKSDLĞPNMOKMKOPOKDFOPKDOPKKDFĞPKDKNISOĞAĞAĞAĞAĞAĞAĞAĞAĞAĞAĞAĞAĞAĞADASDJDIASASDAOSDJASDASNIDÜNASDÜNASBDBUJAhdusaHDGUAS9dsöASJDIBSAUOIYISFP' || command === 'NULLLLLLLLLLLLLLLLLLLLASDASDASDPOAADASSAJJIOKSDLĞPNMOKMKOPOKDFOPKDOPKKDFĞPKDKNISOĞAĞAĞAĞAĞAĞAĞAĞAĞAĞAĞAĞAĞAĞADASDJDIASASDAOSDJASDASNIDÜNASDÜNASBDBUJAhdusaHDGUAS9dsöASJDIBSAUOIYISFP' || command === 'NULLLLLLLLLLLLLLLLLLLLASDASDASDPOAADASSAJJIOKSDLĞPNMOKMKOPOKDFOPKDOPKKDFĞPKDKNISOĞAĞAĞAĞAĞAĞAĞAĞAĞAĞAĞAĞAĞAĞADASDJDIASASDAOSDJASDASNIDÜNASDÜNASBDBUJAhdusaHDGUAS9dsöASJDIBSAUOIYISFP' || command === 'NULLLLLLLLLLLLLLLLLLLLASDASDASDPOAADASSAJJIOKSDLĞPNMOKMKOPOKDFOPKDOPKKDFĞPKDKNISOĞAĞAĞAĞAĞAĞAĞAĞAĞAĞAĞAĞAĞAĞADASDJDIASASDAOSDJASDASNIDÜNASDÜNASBDBUJAhdusaHDGUAS9dsöASJDIBSAUOIYISFP') {
    const InviteTop = await ShinoaMiafData.find({}).exec();
    if (!InviteTop || !InviteTop.length) return message.channel.send(embed.setDescription('Sunucunuzda davet yapan hiç üye yok.'));
    const topls = InviteTop.filter(x => x.Total !== 0 && x.Id).sort((x,y) => y.Total - x.Total).map((value,index)=> `**${index+1}.** <@${value.Id}> • \`${value.Total}\` davet (\`${value.Unsuccessful}\` fake, \`${value.Successful}\` davet)`).slice(0, 10)

    await message.channel.send(embed.setDescription(`${topls.join('\n')}`).setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true })));
}
});

Bot.login(tokens.Voucher).then(() => console.log(`${Bot.user.tag} İsmi ile giriş yapıldı! Voucher Online`)).catch(err => console.error('Bot bağlanırken sorun yaşandı!'));