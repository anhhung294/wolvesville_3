const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageEmbed,Permissions} = require('discord.js');
const gameModel = require('../models/game.js'); 
const playerModel =  require('../models/player.js');
const {roles: ViRoles} = require('../config.json');
const data = new SlashCommandBuilder()
	.setName('start')
	.setDescription('Bắt đầu ván mới');

function shuffleArray(arr){
    for(let i=0; i< Math.floor(Math.random()*10000);i++){
        arr.sort((a,b)=> 0.5 - Math.random());
    }
    return arr;
}    

module.exports={
    data: data,
    execute: async function(interaction){
        const memberHost = interaction.member;
        const guild = interaction.guild;

        const game = await gameModel.findOne({
            guildId:guild.id
        });

        var roleConst= game?game.roles:[];

        const roles = shuffleArray(roleConst);

        var playerId = [];

        if(roleConst.length<=0) return interaction.reply('Chưa chọn chức năng');

        if(game.isGameStarted){
          return interaction.reply({
            content: 'Vui lòng kết thúc ván trước',
            ephemeral: true
          });
        }

        const hostChannelId = game.host_channel;

        if(interaction.channelId.toString()!==hostChannelId) return interaction.reply({content:'Vui lòng bắt đầu ở kênh chính', ephemeral: true});

        if(!memberHost.voice.channel) return interaction.reply('Chưa kết nối kênh đàm thoại');

        const voiceChannel = memberHost.voice.channel;
        const [...arrMembers] = voiceChannel.members.values();
        const membersCount = arrMembers.length;

        if(membersCount>roleConst.length) return interaction.reply('Quá số lượng người chơi cho phép');
        else if(membersCount<roleConst.length) return interaction.reply('Không đủ người chơi');

        await voiceChannel.setName('Ma sói');

        const roleEveryone = await guild.roles.cache.find(role => role.name ==='@everyone');

        const wolfChannel = await interaction.channel.parent.createChannel('Sói', {
            type: 'GUILD_TEXT',
            permissionOverwrites: [
                {
                  id:  roleEveryone,
                  deny: [Permissions.FLAGS.VIEW_CHANNEL],
               },
             ],
          });

        const chattingChannel = await interaction.channel.parent.createChannel('Thảo luận',{
          type: 'GUILD_TEXT'
        });


        var playersIdDis = [];

        for(let j=0; j< arrMembers.length; j++){
            let {...userObj} = arrMembers[j].user;
            let player = new playerModel({
                guildId: guild.id,
                user: userObj
            });
            let savedPlayer = await player.save();
            await gameModel.findOneAndUpdate({
                guildId:guild.id
            },{
                $push:{players: savedPlayer._id},
                isGameStarted: true
            });
            playerId.push(player._id);
            playersIdDis.push(userObj.id);
        }

        for(let i=0; i< roles.length; i++){
            let model = require(`../models/${roles[i]}.js`);
            let roleModel = new model({
                guildId: guild.id,
                player: playerId[i]
            });
            let member = await guild.members.cache.get(playersIdDis[i]);
           
            const embed = new MessageEmbed()
                .setTitle(`Chức năng của bạn là [ ${ViRoles[roles[i]]} ]`)
                .setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`)
                .setImage(`attachment://${roles[i]}.png`)
                .setTimestamp(); 
                
            await member.send({
                embeds: [embed],
                files:[`./role_images/${roles[i]}.png`]
            });    

            if(roles[i]==='werewolf'){
              await wolfChannel.permissionOverwrites.create(member, {
                VIEW_CHANNEL: true,
                SEND_MESSAGE: true
              });
            }
          
            await roleModel.save();
        }

        let mess = await interaction.channel.send('ready');
        return mess.delete();
    }
};