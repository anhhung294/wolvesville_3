const {SlashCommandBuilder} = require('@discordjs/builders');
const shuffle = require('shuffle-array');
const guildModel = require('../models/guild.js');
const {MessageEmbed}  = require('discord.js');
const fs = require('fs');
const embed = require('../utilities/embed.js');

const data = new SlashCommandBuilder()
.setName('start')
.setDescription('Start game.');

async function embedSendToUser(role){
    const data = await fs.readFileSync(`./roleInfo/${role}.txt`, 'utf-8');
    let embedSend = await embed('BLUE', 'Your role:', null, [{name: role.toUpperCase(), value: data||'\u200B'}], `./role_images/${role}.png`);
    return embedSend;
}

module.exports = {
    data : data,
    async execute(interaction){
        try{
            const memberStart = interaction.member;
            const voiceState = memberStart.voice;
            const voiceChannel = voiceState.channel;
            const guildDB = await guildModel.findOne({guildId: interaction.guildId});
            const rolesInGame = shuffle(guildDB.roles);
            var player = guildDB.player;
            
            await interaction.deferReply();
            
            if(!voiceChannel) return interaction.editReply({
                content: `You are not in any voice channel!`  
            });

            if(guildDB.isGameStarted) return interaction.editReply({
                content: 'The game was started!'
            });

            const hostChannel = voiceChannel.messages.channel;

            guildDB.isGameStarted = true;
            guildDB.host_channel = hostChannel.id;

            const membersInVoice = await voiceChannel.members.filter(member => !member.user.bot).toJSON();
            
            if(membersInVoice.length!==rolesInGame.length) return interaction.editReply({
                content: 'The number of people join in voice channel is different from the number of roles in game.'
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

            await interaction.editReply('Starting game...');

            await hostChannel.send({
                embeds:[await embed('BLUE', 'Players in game:', null, membersInVoice.map(member =>({name: member.displayName, value: '\u200B'})))]
            })

            let messSend = await hostChannel.send('next');
            
            await messSend.delete();

            return;
        }catch(err){
            console.log(err);
        }
    }
}