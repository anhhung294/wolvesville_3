const { SlashCommandBuilder } = require('@discordjs/builders');
const editJsonFile = require("edit-json-file");
const path = require('path');
const sendReactCollector = require('../features/sendReactCollector.js');
const {roles} = require('../config.json');

const data = new SlashCommandBuilder()
	.setName('start')
	.setDescription('Bắt đầu ván mới');
module.exports={
    data: data,
    execute: async function(interaction){
        const memberHost = interaction.member;
        const guild = interaction.guild;

        if(!memberHost.voice.channel) return interaction.reply('Chưa kết nối kênh đàm thoại');
        
        var {roleConst}= require(`../data/data-${guild.id}.json`);

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

        for(let i =0; i< Math.floor(Math.random()*1000); i++){
            roleConst.sort((a,b)=> 0.5-Math.random());
        }

        const roleIns = roleConst;

        file.set('roleIns', roleIns);

        for(let i=0; i< playersId.length;i++){
            let member = await guild.members.cache.get(playersId[i]);
            await sendReactCollector(interaction.client, member, 'Chức năng của bạn (Nhấn 👌 để xóa tin nhắn):', [{name:roles[roleIns[i]], value: roleIns[i]}], ['👌'], [playersId[i]], {'👌': (message, react, user, collector)=>{
                collector.stop('time');
            }});
        }
        //TODO incomplete
    }
};