const { MessageEmbed } = require('discord.js');
const en = require('../../../src/assets/lang/english.json');

exports.run = (client, message, args) => {  

  const comandos = new MessageEmbed()
  .setAuthor(`${pt.title2}`)
  .setDescription(`Olá, <@${message.author.id}> ${pt.description10}`)
  .setColor(`#8A87BC`)
  .setFooter(pt.description17);
  message.reply({ embeds: [comandos] })

  }