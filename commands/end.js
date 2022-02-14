const { SlashCommandBuilder } = require('@discordjs/builders');
const editJsonFile = require("edit-json-file");
const path = require('path');
const sendReactCollector = require('../features/sendReactCollector.js');

const data = new SlashCommandBuilder()
	.setName('end') 
	.setDescription('Kết thúc trò chơi');
module.exports={
    data: data,
    execute: async function(interaction){
        const guild = interaction.guild;
        const pathJSON = path.normalize(__dirname+`/../data/data-${guild.id}.json`);
        const file = editJsonFile(pathJSON, {
            autosave: true
        });
        const data = file.toObject();
        const {wolves_chatting:wolfChannelId, players, host_channel: hostChannelId} = data;
        if(interaction.channelId!==hostChannelId) return interaction.reply({content:'Vui lòng thực hiện lệnh ở kênh chính', ephemeral: true});
        const wolfChannel = await interaction.guild.channels.cache.get(wolfChannelId);
        
        for(let i=0; i< players.length; i++){
            let member = await guild.members.cache.get(players[i].id);
            if(!member){
                continue;
            }
            if(member.voice.channel){
                member.voice.setDeaf(false);
            }
            wolfChannel.permissionOverwrites.edit(member, { VIEW_CHANNEL: false, SEND_MESSAGES:false});
        }
        
		file.set('players', []);
		file.set('day', [0,1]);
		file.set('isGameStarted', false);
		file.set('die', []);
		file.set('shield', []);
		file.set('mustDie', []);
		file.set('voteDie', []);
        file.set('heal', []);
        file.set('gunBullet', 2);

        interaction.reply({
            content: 'Trò chơi kết thúc'
        });
       
        return sendReactCollector(interaction.client, interaction.channel, '-------------------------------End-------------------------------');
    }
}