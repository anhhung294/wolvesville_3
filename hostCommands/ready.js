const {MessageEmbed} = require('discord.js');
const gameModel = require('../models/game.js');

module.exports={
    name: 'ready',
    execute: async function(client, msg){
        try{
            const guild = msg.guild;
            const game = await gameModel.findOne({
                guildId: guild.id
            }).populate('players');

            const playersId = game.players.map(player => player.user.id);
            
            const embed = new MessageEmbed()
            .setTitle('Bấm 👍 để sẵn sàng')
            .setImage('attachment://Its_getting_darker.png')
            .setColor('BLUE')
            .setTimestamp();    
            
            let message = await msg.channel.send({ embeds: [embed], files: ['./data/Its_getting_darker.png'] });

            await message.react('👍');

            const filter = (reaction, user) => {
                return playersId.includes(user.id) && !user.bot;
            };
            
            const collector = await message.createReactionCollector({filter});
            
            collector.on('collect', async (react, user) => {
                await react.message.channel.send({
                    embeds:[new MessageEmbed().setColor('BLUE').setTitle(`${user.username} đã tham gia`).setThumbnail(user.displayAvatarURL())]
                });
                if (react.count > playersId.length) { 
                    collector.stop('next');
                }
            });

            collector.on('end', async (collected, reason)=>{
                if(reason !== 'next'){
                    msg.channel.send('Vui lòng kết thúc và bắt đầu lại ván.');
                    return; 
                }

                message.delete();

                let mess= await msg.channel.send('next');
                mess.delete();
            });
        }catch(err){
            console.log(err);
        }
    }
};