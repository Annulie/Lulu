const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const wait = require('util').promisify(setTimeout);
const fs = require('fs');
const fetch = require('cross-fetch');
const pt = require('../../../src/assets/lang/portuguese.json');
const config = require('../../util/config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription(pt.description12)
    .addStringOption(option => option
    .setName('região')
    .setDescription(pt.description13)
    .setRequired(true))
    .addStringOption(option => option
    .setName('nome_de_invocador')
    .setDescription(pt.description13)
    .setRequired(true)),
  async execute(interaction, client, arg) {

 //-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-

   const region = interaction.options.getString('região').toUpperCase();
   const lol = interaction.options.getString('nome_de_invocador');

   let summoner = lol; 
   let runeterra = region;
   const availlableRegions = ['BR', 'NA', 'OCE', 'LAS', 'LAN', 'EUNE', 'EUW', 'KR', 'JP', 'RU', 'TR'];
   if(!availlableRegions.find(availlableRegion => availlableRegion === region)) 
   return interaction.reply({  content: `**${region}** ${pt.description1} **${availlableRegions.join(', ')}**`, ephemeral: true })

   let nick = lol;
   const nomedeinvocador = encodeURIComponent(lol);

    if(summoner.length < 3) return interaction.reply({ content: `${pt.description18}`, ephemeral: true });
    if(nick.length > 16) interaction.reply({ content: `${pt.description4}`, ephemeral: true });     

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
            if(!lolsgg.includes('disponível em ') || !lolsgg.includes('está disponível!') || !lolsgg.includes('provavelmente está disponível!') || !lolsgg.includes('Caracteres inválidos:')) {
            
            }
            if(lolsgg.includes('disponível em ')) {
                lolsgg = lolsgg.split('disponível em ')[1];
                lolsgg = lolsgg.split(' dias')[0];

            //Embed Unavailable
            const unavailable = new MessageEmbed()
            .setAuthor(`${pt.title0} ${nick} ${pt.title1} ${runeterra}`)
            .setDescription(`${pt.description5} **${nick}**\n <:Sadge1:879398255635603516> **${nick}** ${pt.description6} **${lolsgg}** ${pt.description7}`)
            .setColor(`#DD2E44`);
            interaction.reply({ embeds: [unavailable], ephemeral: true })
            };

            //Embed ban
            if(lolsgg.includes('provavelmente está disponível!')) {
            const ban = new MessageEmbed()
            .setAuthor(`${pt.title0} ${nick} ${pt.title1} ${runeterra}`)
            .setDescription(`${pt.description5} **${nick}**\n <:POGGIES1:879394611192270918> **${nick}** ${pt.description8}`)
            .setColor(`#FAAC58`)
            return interaction.reply({ embeds: [ban], ephemeral: true })
            };

            //Embed Available
            if(lolsgg.includes('está disponível!')) {
            const available  = new MessageEmbed()
            .setAuthor(`${pt.title0} ${nick} ${pt.title1} ${runeterra}`)
            .setDescription(`${pt.description5} **${nick}**\n <:POGGIES1:879394611192270918> **${nick}** ${pt.description9}`)
            .setColor(`#77B255`)
            interaction.reply({ embeds: [available], ephemeral: true })
            };
   
            //Msg Invalid characters
            if(lolsgg.includes('Caracteres inválidos:')) {
            interaction.reply({ content: `**${nick}** ${pt.description19}`, ephemeral: true })
            };          
        })
        .catch(function (response) {
            console.log(response.statusText);
        });
      };
  },
};
