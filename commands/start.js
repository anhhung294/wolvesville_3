const {SlashCommandBuilder} = require('@discordjs/builders');
const shuffle = require('shuffle-array');
const guildModel = require('../models/guild.js');
const {MessageEmbed}  = require('discord.js');
const fs = require('fs');

const data = new SlashCommandBuilder()
.setName('start')
.setDescription('Start game.');

async function embedSendToUser(role){
    const data = await fs.readFileSync(`./roleInfo/${role}.txt`, 'utf-8');
    return new MessageEmbed()
    .setTitle('Your role:')
    .setThumbnail(`attachment://${role}.png`)
    .setColor('BLUE')
    .addField(role.toUpperCase(), data);
}

module.exports = {
    data : data,
    async execute(interaction){
        const memberStart = interaction.member;
        const voiceState = memberStart.voice;
        const voiceChannel = voiceState.channel;
        var guildDB = await guildModel.findOne({guildId: interaction.guildId});
        const rolesInGame = shuffle(guildDB.roles);
        var player = guildDB.player;
        
        
        if(!voiceChannel) return interaction.reply({
            content: `You are not in any voice channel!`,
            ephemeral: true   
        });

        if(guildDB.isGameStarted) return interaction.reply({
            content: 'The game was started!',
            ephemeral: true
        });

        const hostChannel = voiceChannel.messages.channel;

        guildDB.host_channel = hostChannel.id;

        const membersInVoice = await voiceChannel.members.filter(member => !member.user.bot).toJSON();
        
        if(membersInVoice.length!==rolesInGame.length) return interaction.reply({
            content: 'The number of people join in voice channel is different from the number of roles in game.',
            ephemeral: true
        });

        for(let i=0 ; i < membersInVoice.length; i++){
            let member = membersInVoice[i];
            let role = rolesInGame[i];

            player.push(`${member.id}-${role}`);
            
            await member.user.send({
                embeds:[await embedSendToUser(role)],
                files: [`./role_images/${role}.png`]
            }); 
        }
        
        await guildDB.save();

        await voiceChannel.setName('Werewolves Village');

        return interaction.reply('Game started');
    }
}