const {SlashCommandBuilder} = require('@discordjs/builders');
const {Collection} = require('discord.js');
const DB = require('../features/database.js');

const data = new SlashCommandBuilder()
                  .setName('start')
                  .setDescription('Bắt đầu ván mới');
module.exports={
  data: data,
  execute: async function(interaction){
    const memberHost = interaction.member;
    const guild = interaction.guild;
    const dataGuild = await DB('get', guild.id);
    const {wolves_channelId, host_channelId, chatting_channelId, roles} = dataGuild;
    
    if(!wolves_channelId||!host_channelId||!chatting_channelId){
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

    if(roles.length===0||!roles){
      return interaction.reply('Chưa chọn chức năng');
    }

    const members = [...voiceChannel.members.values()];

    if(members.length>roles.length){
      return interaction.reply('Quá số lượng người cho phép');
    }else if(members.length<roles.length){
      return interaction.reply('Không đủ người chơi');
    }

    try{
        guild.players = new Collection();
    }catch(err){
      console.log(err);
    }

    for(let i=0; i< Math.floor(Math.random()*1000); i++){
      roles.sort((a,b)=> Math.random()-0.5);
    }

    var players = guild.players;

    for(let i=0; i< roles.length; i++){
      players.set(roles[i], {
        die: false,
        bullets: 2,
        shield: false,
        heal: true,
        kill: true,
        info: members[i],
        field:{
          name: members[i].displayName,
          value: "👲",
          inline: true
        },
        option:{
          label: members[i].displayName,
          value: members[i].user.id
        }
      })
    }

    const wolfChannel = await guild.channels.cache.get(wolves_channelId);
  }
}