const { MessageEmbed } = require('discord.js');
const fetch = require('cross-fetch');
const config = require('../../util/config.json');
const pt = require('../../../src/assets/lang/portuguese.json');

exports.run = async (client, message, args) => {  
   
    if(!args.length)
    return message.reply(pt.description0);
 
//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-

   //Region
   let region = args[0].toUpperCase();
   const availlableRegions = ['BR', 'NA', 'OCE', 'LAS', 'LAN', 'EUNE', 'EUW', 'KR', 'JP', 'RU', 'TR'];
   if(!availlableRegions.find(availlableRegion => availlableRegion === region)) 
   return message.reply(`**${region}** ${pt.description1} **${availlableRegions.join(', ')}**`);

   //Summoner
   let summoner = args.slice(1).join(' ');
   if(!args[1]) 
   return message.reply(pt.description2);
   if(summoner.length < 3) return message.reply(pt.description3);

   let nick = `${summoner}`;
   const nomedeinvocador = encodeURIComponent(nick);
   if(nick.length > 16) return message.reply(pt.description4);   

    const pix = new MessageEmbed()
    .setDescription(`${pt.pix} **${message.author.username}** ${pt.pix0} **\`${summoner}\`** \n${pt.pix1} **\`${region}\`** \n\n${pt.pix2}`)
    .setColor('#8A87BC');
    const m = await message.reply({ embeds: [pix] })   
   
    callNickname(nomedeinvocador);

    async function callNickname(nomedeinvocador) {
        fetch(`https://lols.gg/pt/name/checker/${region}/${nomedeinvocador}/`, { method: 'GET' })
        .then(function (response) {
            switch (response.status) {
                case 200:
                    return response.text();
                case 404:
                    throw response;
            }
        })
        .then(function (lolsgg) {
            if(!lolsgg.includes('disponível em ') || !lolsgg.includes('está disponível!') || !lolsgg.includes('provavelmente está disponível!')  || !lolsgg.includes('Caracteres inválidos:')) {
            
            }
           
            if(lolsgg.includes('disponível em ')) {
                lolsgg = lolsgg.split('disponível em ')[1];
                lolsgg = lolsgg.split(' dias')[0];

            //Embed Unavailable
            const unavailable = new MessageEmbed()
            .setAuthor(`${pt.title0} ${nick} ${pt.title1} ${region}`, client.user.displayAvatarURL())
            .setDescription(`${pt.description5} **${nick}**\n <:Sadge1:879398255635603516> **${nick}** ${pt.description6} **${lolsgg}** ${pt.description7}`)
            .setThumbnail(client.user.displayAvatarURL())
            .setColor(`#DD2E44`);
            m.edit({ embeds: [unavailable] })
            };

            //Embed ban
            if(lolsgg.includes('provavelmente está disponível!')) {
            const ban = new MessageEmbed()
            .setAuthor(`${pt.title0} ${nick} ${pt.title1} ${region}`, client.user.displayAvatarURL())
            .setDescription(`${pt.description5} **${nick}**\n <:POGGIES1:879394611192270918> **${nick}** ${pt.description8}`)
            .setThumbnail(client.user.displayAvatarURL())
            .setColor(`#FAAC58`)
            return m.edit({ embeds: [ban] })
            };

            //Embed Available
            if(lolsgg.includes('está disponível!')) {
            const available  = new MessageEmbed()
            .setAuthor(`${pt.title0} ${nick} ${pt.title1} ${region}`, client.user.displayAvatarURL())
            .setDescription(`${pt.description5} **${nick}**\n <:POGGIES1:879394611192270918> **${nick}** ${pt.description9}`)
            .setThumbnail(client.user.displayAvatarURL())
            .setColor(`#77B255`)
            m.edit({ embeds: [available] })
            };
           
            //message Invalid characters
            if(lolsgg.includes('Caracteres inválidos:')) {
            const invalid = new MessageEmbed()
            .setDescription(`**${nick}** ${pt.description19}`)
            .setColor('#DD2E44');    
            m.edit({ embeds: [invalid] })
            };           
        })
        .catch(function (response) {
            console.log(response.statusText);
      });
    };
}
