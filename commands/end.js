const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageEmbed,Permissions} = require('discord.js');
const embed = require('../features/embed.js'); 
const gameModel = require('../models/game.js'); 
const playerModel =  require('../models/player.js');
const fs = require('fs');
const path = require('path');
const pathData = path.normalize(__dirname+'/../models/');
const files = fs.readdirSync(pathData).filter(file => file.endsWith('.js')&&file!=='game.js');
const {roles: ViRoles} = require('../config.json');
const data = new SlashCommandBuilder()
	.setName('end')
	.setDescription('Kết thúc ván');

module.exports={
    data: data,
    execute: async function(interaction){
        try{
          const memberHost = interaction.member;
          const guild = interaction.guild;

          const game = await gameModel.findOne({
              guildId:interaction.guildId
          });

          const hostChannelId = game.host_channel;

          if(interaction.channelId.toString()!==hostChannelId) return interaction.editReply({content:'Vui lòng kết thúc ở kênh chính', ephemeral: true});

          if(!memberHost.voice.channel) return interaction.editReply('Chưa kết nối kênh đàm thoại');

          const voiceChannel = memberHost.voice.channel;

          if(!game.isGameStarted){
            return interaction.editReply({
              content: 'Chưa bắt đầu trò chơi',
              ephemeral: true
            });
          }

          guild.channels.cache
          .filter(channel => channel.name.trim().toLowerCase()==='sói'||channel.name.trim().toLowerCase()==='thảo-luận')
          .each(channel => channel.delete());

          await gameModel.findOneAndUpdate({
            guildId: guild.id
          },{
            players:[],
            isGameStarted: false
          });

          for(let file of files){
            let model = require(`../models/${file}`);
            await model.deleteMany({
              guildId: guild.id
            });
          }

          const embedSend = embed('----------------------------- KẾT THÚC --------------------------------', 'RED');

          return interaction.channel.send({
              embeds: [embedSend]
          });
        }catch(err){
          console.log(err);
        }
    }
};