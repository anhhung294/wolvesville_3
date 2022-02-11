const {MessageEmbed} = require('discord.js');
const {roles} = require('../../config.json');
const editJsonFile = require("edit-json-file");
const path = require('path');

module.exports={
    name: 'single',
    execute: async function(interaction){
        const guild = interaction.guild;
        const pathJSON = path.normalize(__dirname + `/../../data/data-${guild.id}.json`);
        const file = editJsonFile(pathJSON, {
            autosave:true
        });

        const embed = new MessageEmbed();

        embed.setTitle("Chọn vai trò: ");
        embed.setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);
        embed.setTimestamp(); 
        Object.keys(roles).forEach( (key) => {
            embed.addField(roles[key], key, inline = true);
        });

        let message = await interaction.channel.send({ embeds: [embed]});

        Object.keys(roles).forEach( (key) => {
             message.react(key);
        });

        const filter = (reaction, user) => {
            return !user.bot;
        };

        const collector = message.createReactionCollector({filter, time: 99999});

        collector.on('collect',async (react, user) => {
            file.append('roleConst', react._emoji.name);
            await react.users.remove(user.id)
           .catch(error => console.error('Failed to clear reactions:', error));
            interaction.channel.send(`Added ${roles[react._emoji.name]} ${react._emoji.name}`);    
        });
        collector.on('end', (collected,reason) => {
            if(reason==='time'){
                interaction.channel.send('Hết thời gian chọn, vui lòng thực hiện lại lệnh');
            }
        });
    }
} 