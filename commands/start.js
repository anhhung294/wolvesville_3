const { SlashCommandBuilder } = require('@discordjs/builders');
const editJsonFile = require("edit-json-file");
const path = require('path');
const sendReactCollector = require('../features/sendReactCollector.js');
const {roles, uniqueRoles} = require('../config.json');
const data = new SlashCommandBuilder()
	.setName('start')
	.setDescription('Bắt đầu ván mới');
module.exports={
    data: data,
    execute: async function(interaction){
        const memberHost = interaction.member;
        const guild = interaction.guild;
        const pathJSON = path.normalize(__dirname+`/../data/data-${guild.id}.json`);
        const file = editJsonFile(pathJSON, {
            autosave: true
        });
        const hostChannelId = file.get('host_channel');
        const wolvesChannelId = file.get('wolves_chatting');
        const wolfChannel = await interaction.guild.channels.cache.get(wolvesChannelId);
        
        file.set('players', []);
        file.set('wolfFields',[]);
        file.set('day', [0,1]);
        file.set('isGameStarted', false);
        file.set('die', []);
        file.set('shield', []);
        file.set('gunBullet', 2);
        file.set('mustDie', []);
        

        if(interaction.channelId!==hostChannelId) return interaction.reply({content:'Vui lòng bắt đầu ở kênh chính', ephemeral: true});

        if(!memberHost.voice.channel) return interaction.reply('Chưa kết nối kênh đàm thoại');
        
        var roleConst= file.get('roleConst');

        if(!roleConst) return interaction.reply('Chưa chọn chức năng');

        for(let j=0; j< uniqueRoles.length;j++){
            let roleArr = roleConst.filter(ele => ele === uniqueRoles[j]);
            if(roleArr.length>1){
                return interaction.reply({
                    content:`Có 1 số chức năng chỉ được chọn 1 ${uniqueRoles}`,
                });
            }
        }

        const voiceChannel = memberHost.voice.channel;
        const members = voiceChannel.members;
        const membersCount = members.size;

        if(membersCount>roleConst.length) return interaction.reply('Quá số lượng người chơi cho phép');
        else if(membersCount<roleConst.length) return interaction.reply('Không đủ người chơi');
        

        const [...playersId] = members.keys();
        
        for(let i =0; i< Math.floor(Math.random()*1000); i++){
            roleConst.sort((a,b)=> 0.5-Math.random());
        }

        const roleIns = roleConst;

        for(let i=0; i< playersId.length;i++){
            let member = await guild.members.cache.get(playersId[i]);
            file.append('players',{
                role:roleIns[i],
                id: playersId[i],
                field:{
                    name: member.displayName,
                    value: '👲',
                    inline: true
                },
                option:{
                    label: member.displayName,
                    value: playersId[i],
                }
            });
            if(roleIns[i]==='🐺'){
                wolfChannel.permissionOverwrites.create(member, { VIEW_CHANNEL: true, SEND_MESSAGES:true});
            }
            await sendReactCollector(interaction.client, member, 'Chức năng của bạn (Nhấn 👌 để xóa tin nhắn):', [{name:roles[roleIns[i]], value: roleIns[i]}], ['👌'], [playersId[i]]);
        }

        file.set('heal', []);

        file.set('isGameStarted', true);

        interaction.reply('ready_for_it');
    }
};