const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const pt = require('../../../src/assets/lang/portuguese.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('comandos')
    .setDescription(pt.description11),
  async execute(interaction, client) {   
    
  const comandos = new MessageEmbed()
  .setAuthor(`${pt.title2}`)
  .setDescription(`Olá, <@${interaction.member.id}> ${pt.description10}`)
  .setColor(`#8A87BC`)
  .setFooter(pt.description17);
  interaction.reply({ embeds: [comandos] })
  },
};
