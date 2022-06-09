const {SlashCommandBuilder} = require('@discordjs/builders');
const shuffle = require('shuffle-array');
const guildModel = require('../models/guild.js');
const {MessageEmbed}  = require('discord.js');

const data = new SlashCommandBuilder()
.setName('start')
.setDescription('Start game.');

function embedSendToUser(member, role){
    return new MessageEmbed()
    .setTitle('Your role:')
    .setThumbnail(`attachment://${role}.png`)
    .setColor('BLUE')
    .addField(role, '\u200b');
}

module.exports = {
    data : data,
    async execute(interaction){
        const memberStart = interaction.member;
        const voiceState = memberStart.voice;
        var guildDB = await guildModel.findOne({guildId: interaction.guildId});
        const rolesInGame = shuffle(guildDB.roles);
        var player = guildDB.player;
        
        
        if(!voiceState.channel) return interaction.reply({
            content: `You are not in any voice channel!`,
            ephemeral: true   
        });

        if(guildDB.isGameStarted) return interaction.reply({
            content: 'The game was started!',
            ephemeral: true
        });

        if(guildDB.host_channel!==interaction.channel.id) return interaction.reply({
            content: 'Please start in host channel!',
            ephemeral: true
        });

        const membersInVoice = await voiceState.channel.members.filter(member => !member.user.bot).toJSON();
        
        if(membersInVoice.length!==rolesInGame.length) return interaction.reply({
            content: 'The number of people join in voice channel is different from the number of roles in game.',
            ephemeral: true
        });

        for(let i=0 ; i < membersInVoice.length; i++){
            let member = membersInVoice[i];
            let role = rolesInGame[i];

            player.push(`${member.id}-${role}`);
            
            await member.user.send({
                embeds:[embedSendToUser(member, role)],
                files: [`./role_images/${role}.png`]
            }); 
        }

        const parentChannel = interaction.channel.parent;
        
    }
}