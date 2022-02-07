const { Client, Intents, Collection, Discord, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS] });
const config = require('../src/util/config.json');
const fs = require('fs');

client.on('ready', () => {
console.log('Online')
});

//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-

//Handler
client.on('messageCreate', message => {
     if (message.author.bot) return;
     if (message.channel.type == 'dm') return;
     if (!message.content.toLowerCase().startsWith(config.prefix.toLowerCase())) return;
     if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) return;

    const args = message.content
        .trim().slice(config.prefix.length)
        .split(/ +/g);
    const command = args.shift().toLowerCase();

    try {
        const commandFile = require(`../src/comandos/prefix/${command}.js`)
        commandFile.run(client, message, args);
    } catch (err) {
    console.error("");
  }
});
//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-

//Executar comando com (/) na pasta comandos.
client.commands = new Collection();
const Slashcommands = fs.readdirSync('./src/comandos/slash').filter(file => file.endsWith('.js'));

for (const file of Slashcommands) {
    const command = require(`../src/comandos/slash/${file}`);
    if (["MESSAGE", "USER"].includes(file.type)) delete file.description;    
    client.commands.set(command.data.name, command);
}

//Registar os comandos com (/)
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand() || interaction.isContextMenu()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        return interaction.reply(`O comando ${command} não foi possível executar no servidor ${message.guild.name}!`);
    } 
    
    // Context Menu Handling
    if (interaction.isContextMenu()) {
        await interaction.deferReply({ ephemeral: false });
        const command = client.commands.get(interaction.commandName);
        if (command) command.run(client, interaction);
    }
    
});

//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-//-


//Token
client.login(config.token);    
