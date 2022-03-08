const gameModel = require('../models/game.js');
const embed = require('../features/embed.js');
const {getAverageColor } = require('fast-average-color-node');

module.exports={
    name: 'next',
    execute: async function(client, msg){
        const game = await gameModel.findOne({
            guildId: msg.guild.id
        });
        const {...day} = game.day;
            
        switch(day.dayNight){
            case 0:{
                const pathNightImage = './data/night.jpg';
                const embedSend = embed(`Night ${day.index}`, '#7114c5',undefined, pathNightImage);
                
                await msg.channel.send({
                    embeds:[embedSend],
                    files: [pathNightImage]
                });
                
                await gameModel.findOneAndUpdate({
                    guildId: msg.guild.id
                },{
                    day:{
                        dayNight: (day.dayNight+1)%2,
                        index: day.index+day.dayNight      
                    }
                });
                
                var mess = await msg.channel.send('next_turn');
                return mess.delete();
            }case 1:{
                const pathDayImage = './data/day.jpg';
                let color = getAverageColor(pathDayImage);
                
                const embedSend = embed(`Night ${day.index}`, color.hex,undefined, pathDayImage);
                
                await msg.channel.send({
                    embeds:[embedSend],
                    files: [pathDayImage]
                });
            }
        }


    }
};