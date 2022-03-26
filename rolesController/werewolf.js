const embed = require('../features/embed.js');
const gameModel = require('../models/game.js');
const werewolfModel = require('../models/werewolf.js');
const bodyguardModel = require('../models/bodyguard.js');
const playerModel = require('../models/player.js');
const {getAverageColor } = require('fast-average-color-node');
const {MessageActionRow, MessageSelectMenu} = require('discord.js');

function mode(array)
{
    if(array.length == 0)
        return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++)
    {
        var el = array[i];
        if(modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;  
        if(modeMap[el] > maxCount)
        {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
}

module.exports= {
  async turnExecute(msg){
    try{
        const game = await gameModel.findOne({
          guildId: msg.guild.id
        }).populate('players');
  
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

        const pathImage = './role_images/werewolf.png';
        const color = await getAverageColor(pathImage);
  
        const embedSend = embed('Sói muốn giết ai?', color.hex);
  
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
        };
        
        const collector = await mess.createMessageComponentCollector({
          filter, time: 30000
        });
  
        collector.on('collect', async (i) =>{
          let value = i.values[0];
  
          const member = await i.guild.members.cache.get(value);
  
          await werewolfModel.findOneAndUpdate({
            guildId: i.guild.id,
            playerId: i.user.id
          },{
            killPerson: value
          });
  
          await i.reply({
            content:`Đã chọn ${member.user.username}`,
            ephemeral: true
          });
  
      });
  
      collector.on('end',async (collected, reason) =>{
        if(reason==='time'){
          mess.delete();
  
          let messNext = await msg.channel.send('next_turn werewolf');
          return messNext.delete();
        }else{
          return msg.channel.send('Có lỗi xảy ra, vui lòng kết thúc và bắt đầu lại.');
        }
      });
    }catch(err){
      console.log(err);
    }
  },
  async endNightExecute(msg){
    const werewolves = await werewolfModel.find({
      guildId: msg.guild.id
    });

    const bodyguard = await bodyguardModel.findOne({
      guildId: msg.guild.id
    });

    const diePerId = mode(werewolves.map(ww => ww.killPerson));

    let diePer = await playerModel.findOne({
      guildId: msg.guild.id,
      playerId: diePerId
    });

    if(bodyguard){
      let shieldId = bodyguard.shield;
      
      if(diePer===shieldId){
        await bodyguardModel.updateOne({
          guildId: msg.guild.id
        },{
          attackAgain: true
        });
        return;
      }
    }

    await gameModel.updateOne({
      guildId: msg.guild.id
    },{
      $pull:{players: diePer._id, roles: diePer.role}
    });

    await playerModel.findByIdAndDelete(diePer._id);
    
    let dieRoleModel = require(`../models/${diePer.role}.js`);

    await dieRoleModel.deleteOne({
      guildId: msg.guild.id,
      playerId: diePer.user.id
    });
    

  }
};