const embed = require('../features/embed.js'); 
const gameModel = require('../models/game.js'); 
const fs = require('fs');
const path = require('path');
const pathData = path.normalize(__dirname+'/../models/');
const files = fs.readdirSync(pathData).filter(file => file.endsWith('.js')&&file!=='game.js');

module.exports={
    name: 'end',
    execute: async function(client, msg){
        try{
          const guild = msg.guild;

          guild.channels.cache
          .filter(channel => channel.name.trim().toLowerCase()==='sói'||channel.name.trim().toLowerCase()==='thảo-luận-ma-sói')
          .each(channel => channel.delete());

          await gameModel.findOneAndUpdate({
            guildId: guild.id
          },{
            players:[],
            isGameStarted: false,
            day:{
              dayNight:0,
              index:1
            }
          });

          for(let file of files){
            let model = require(`../models/${file}`);
            await model.deleteMany({
              guildId: guild.id
            });
          }

          const embedSend = embed('----------------------- KẾT THÚC -------------------------', 'RED');

          return msg.channel.send({
              embeds: [embedSend]
          });
        }catch(err){
          console.log(err);
        }
    }
};