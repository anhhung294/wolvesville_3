const embed = require('../features/embed.js');
const {getAverageColor } = require('fast-average-color-node');
const{MessageActionRow, MessageSelectMenu} = require('discord.js');
const gameModel = require('../models/game.js');
const bodyguardModel = require('../models/bodyguard.js');


module.exports=async function(msg){
  const game = await gameModel.findOne({
    guildId: msg.guild.id
  }).populate('players');
  const bodyguard = await bodyguardModel.findOne({
    guildId: msg.guild.id
  }).populate('player');

  const options = game.players.map(function(player){
    return {
      label: player.user.username,
      value: player.user.id
    };
  });
  
  const color = getAverageColor('./role_images/bodyguard.png');
  const embedSend = embed('Bảo vệ muốn bảo vệ ai?', color.hex);
  const embedRoleSend = embed('Bảo vệ dậy đi', color.hex, '', './role_images/bodyguard.png');
  
  await msg.channel.send({
    embeds: [embedRoleSend]
  });
  
  const row = new MessageActionRow()
  .addComponents(
    new MessageSelectMenu()
    .setMaxValues(1)
    .setCustomId('bodyguardSelect')
    .setOptions(options)
  );


  let mess = await msg.channel.send({
    components:[row],
    embeds:[embedSend]
  });

  const filter=(i)=>{
    return i.user.id = bodyguard.playerId;
  }
  
  const collector = await mess.createMessageComponentCollector({filter, time: 15000});

  collector.on('collect',async (i) => {
    let value = i.values[0];

    const member = await i.guild.members.cache.get(value);
    
    await bodyguardModel.findOneAndUpdate({
      guildId: i.guild.id,
      playerId: i.user.id
    },{
      shield: value
    });

    await i.reply({
      content:`Đã bảo vệ ${member.displayName}`,
      ephemeral: true
    })
  });
  collector.on('end', async (collected, reason)=>{
    if(reason === 'time'){
      mess.delete();
      
      let messNext = await msg.channel.send('next_turn bodyguard');
      messNext.delete();
    }
  });
}
