const embed = require('../features/embed.js');
const gameModel = require('../models/game.js');
const werewolfModel = require('../models/werewolf.js');
const bodyguardModel = require('../models/bodyguard.js');
const {MessageActionRow, MessageSelectMenu} = require('discord.js');
const {getAverageColor } = require('fast-average-color-node');

module.exports= async function(msg){
  const pathImage = './role_images/werewolf.png';
  const color = getAverageColor(pathImage);
  
  const game = await gameModel.findOne({
    guildId: msg.guild.id
  }).populate('player');

  const werewolves = await werewolfModel.find({
    guildId: msg.guild.id
  }).populate('player');

  const werewolvesId = werewolves.map(werewolf => werewolf.player.user.id);

  const options = game.players.map(function(player){
      return{
        label: player.user.username,
        value: player.playerId
      };
  });

  const embedRole = embed('Đàn sói dậy đi', color.hex, '', pathImage);

  await msg.channel.send({
    embeds:[embedRole]
  });

  const embedSend = enbed('Sói muốn giết ai?', color.hex);

  const row = new MessageActionRow()
  .addComponents(
    new MessageSelectMenu()
    .setCustomId('werewolfSelect')
    .setOptions(options)
    .setMaxValues(1)
  );

  const mess = await msg.channel.send({
    embeds:[embedSend],
    components:[row]
  });

  const filter = (i) =>{
    return werewolvesId.includes(i.user.id);
  }
  
  const collector = await mess.createMessageComponentCollector({
    filter, time: 30000
  });

  collector.on('collect', async (i) =>{
    let value = i.values[0];

     await werewolfModel.findOneAndUpdate({
       guildId: i.guild.id,
       playerId: i.user.id
     },{
     killPerson: value
   });

  });

  collector.on('end',async (collected, reason) =>{
    if(reason==='time'){
      mess.delete();

      let messNext = await msg.channel.send('next_turn werewolf');
      messNext.delete();
    }else{
      msg.channel.send('Có lỗi xảy ra, vui lòng kết thúc và bắt đầu lại.');
    }
  });
  
  
}