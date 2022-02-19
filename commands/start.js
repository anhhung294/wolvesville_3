const {SlashCommandBuilder} = require('@discordjs/builders');
const DB = require('../feattures/database.js');

const data = new SlashCommandBuilder()
                  .setName('start')
                  .setDescription('Bắt đầu ván mới');
module.exports={
  data: data,
  execute: async function(interaction){
    const memberHost = interaction.member;
    const guild = interaction.guild;
    const dataGuild = DB('get', guild.id);
    const {wolves_channelId, host_channelId, chatting_channelId, roles} = dataGuild;
    
    if(!wolves_channelId||!host_channelI||!chatting_channelId){
        return interaction.reply('Chưa cài đặt kênh đầy đủ');
    }

    if(interaction.channelId!==host_channelId){
        return interaction.reply('Vui lòng bắt đầu ở kênh chính');
    }

    if(!roles){
        return interaction.reply('Chưa chọn chức năng');
    }

    const voiceChannel = memberHost.voice.channel;

    if(!voiceChannel){
        return interaction.reply('Chưa kết nối kênh đàm thoại');
    }else{
        voiceChannel.setName('Ma sói');
    }

    const members = voiceChannel.members;

    const wolfChannel = await guild.channels.cache.get(wolves_channelId);



  }
}