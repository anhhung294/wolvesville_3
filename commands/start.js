const { SlashCommandBuilder } = require('@discordjs/builders');
const editJsonFile = require("edit-json-file");
const path = require('path');

const data = new SlashCommandBuilder()
	.setName('start')
	.setDescription('Bắt đầu ván mới');
module.exports={
    data: data,
    execute: async function(interaction){
        const memberHost = interaction.member;
        const guild = interaction.guild;

        if(!memberHost.voice.channel) return interaction.reply('Chưa kết nối kênh đàm thoại');
        
        const {roleConst, roleIns}= require(`../data/data-${guild.id}.json`);

        if(!roleConst) return interaction.reply('Chưa chọn vai trò');

        const voiceChannel = memberHost.voice.channel;
        const members = voiceChannel.members;
        const membersCount = members.size;

        if(membersCount>roleConst.length) return interaction.reply('Quá số lượng người chơi cho phép');
        else if(membersCount<roleConst.length) return interaction.reply('Không đủ người chơi');

        const pathJSON = path.normalize(__dirname+`/../data/data-${guild.id}`);
        const file = editJsonFile(pathJSON);

        const [...playersId] = members.keys();

        file.set('playersId', playersId);
        //TODO incomplete
    }
};