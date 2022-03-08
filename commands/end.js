const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageEmbed,Permissions} = require('discord.js');
const embed = require('../features/embed.js'); 
const gameModel = require('../models/game.js'); 
const playerModel =  require('../models/player.js');
const fs = require('fs');
const path = require('path');
const {roles: ViRoles} = require('../config.json');
const data = new SlashCommandBuilder()
	.setName('end')
	.setDescription('Kết thúc ván');

module.exports={
    data: data,
    execute: async function(interaction){
        const memberHost = interaction.member;
        const guild = interaction.guild;

        const game = await gameModel.findOne({
            guildId:interaction.guildId
        });

        const hostChannelId = game.host_channel;

        if(interaction.channelId.toString()!==hostChannelId) return interaction.reply({content:'Vui lòng kết thúc ở kênh chính', ephemeral: true});

        if(!memberHost.voice.channel) return interaction.reply('Chưa kết nối kênh đàm thoại');

        const voiceChannel = memberHost.voice.channel;

        if(!game.isGameStarted){
          return interaction.reply({
            content: 'Chưa bắt đầu trò chơi',
            ephemeral: true
          })
        }

        const roleEveryone = await guild.roles.cache.find(role => role.name ==='@everyone');

        const wolfChannel = await interaction.guild.channels.cache.find(channel => channel.name==='Sói');

        const chattingChannel = await interaction.guild.channels.cache.find(channel => channel.name==='Thảo luận');

        if(chattingChannel&&wolfChannel){
          await wolfChannel.delete();

          await chattingChannel.delete();

        }

        await gameModel.findOneAndUpdate({
          guildId: guild.id
        },{
          players:[],
          isGameStarted: false
        });

        const pathData = path.normalize(__dirname+'/../models/');
        const files = await fs.readdirSync(pathData).filter(file => file.endsWith('.js')&&file!=='game.js');

        for(let file of files){
          let model = require(`../models/${file}`);
          await model.deleteMany({
            guildId: guild.id
          });
        }

        const embedSend = embed('-----------------------------END--------------------------------', 'RED');

        return interaction.reply({
            embeds: [embedSend]
        });
    }
};