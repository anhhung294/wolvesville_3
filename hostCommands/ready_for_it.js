const {MessageEmbed} = require('discord.js');

module.exports={
    name: 'ready_for_it',
    execute: async function(client, msg){
        var numReady = 0;
        const guild = msg.guild;
        const {players} = require(`../data/data-${guild.id}.json`);
        const playersId = players.map(el => el.id);
        
        const embed = new MessageEmbed();
        embed.setTitle('Everyone react 👍 to ready');
        embed.setImage('attachment://Its_getting_darker.png');
        embed.setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);
        embed.setTimestamp();    
        
        let message = await msg.channel.send({ embeds: [embed], files: ['./data/Its_getting_darker.png'] });

        await message.react('👍');

        const filter = (reaction, user) => {
            return playersId.includes(user.id) && !user.bot;
        };
        
        const collector = message.createReactionCollector({filter, time: 99999});
        
        collector.on('collect',async (react, user) => {
            numReady++;
            if (react.count > playersId.length) { 
                let mess = await msg.channel.send('next');
                collector.stop();
                message.delete();
                return mess.delete();
            }
        });
        
    }
};