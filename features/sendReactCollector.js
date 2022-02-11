const console = require('console');
const {MessageEmbed} = require('discord.js');

module.exports = async function (client, channel, title, fields, reactContent, userIds, callBack,deleteMessage = true){
    try{
        const embed = new MessageEmbed();
        embed.setTitle(title);
        embed.setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);
        embed.setTimestamp();    

        if(fields){
            embed.addFields(fields);
        }
        
        let message = await channel.send({ embeds: [embed]});

        if(!reactContent) return;

        reactContent.forEach(async (react) => {
            await message.react(react);
        });

        const filter = (reaction, user) => {
            return userIds.includes(user.id) && !user.bot;
        };
        
        const collector = message.createReactionCollector({filter, time: 99999});
        
        collector.on('collect',(react, user) => {
            if(callBack&&callBack[react._emoji.name]){
                callBack[react._emoji.name](message, react, user, collector);
            }
            if(deleteMessage){
                return react.message.delete();    
            }
        });

        collector.on('end',async (collected, reason)=>{
            if(reason!=='messageDelete'){
                let message = await channel.send(reason);
                return message.delete();
            }
        });
    }catch(err){
        console.log(err);
        let hostChannel = client.channels.cache.get(process.env.HOST_ID);
        let message = await hostChannel.send('Something wrong!');
        return message.delete();
    }
};