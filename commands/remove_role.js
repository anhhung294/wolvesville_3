const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');
const {roles} = require('../config.json');
const editJsonFile = require("edit-json-file");
const path = require('path');

const data = new SlashCommandBuilder()
	.setName('remove_role') 
	.setDescription('Xóa vai trò');
module.exports={
    data: data,
    execute: async function(interaction){
        const guild = interaction.guild;
        const pathJSON = path.normalize(__dirname + `/../data/data-${guild.id}.json`);
        const file = editJsonFile(pathJSON,{
            autosave:true
        });
        var {roleConst} = require(`../data/data-${guild.id}.json`);
        if(!roleConst){
            return interaction.reply('Chưa chọn vai trò');
        }

        const embed = new MessageEmbed();

        embed.setTitle("Chọn vai trò: ");
        embed.setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);
        embed.setTimestamp(); 
        for(let i=0; i<roleConst.length; i++){
            embed.addField(roles[roleConst[i]], roleConst[i], inline= true);
        }
        
        await interaction.reply('Chờ tí');

        let message = await interaction.channel.send({ embeds: [embed]});

        Object.keys(roles).forEach( (key) => {
             message.react(key);
        });

        const filter = (reaction, user) => {
            return !user.bot;
        };

        const collector = message.createReactionCollector({filter, time: 99999});

        collector.on('collect',async (react, user) => {
            var {roleConst} = require(`../data/data-${guild.id}.json`);
            const {roles} = require('../config.json');
            for(let i=0; i< roleConst.length;i++){
                if(react._emoji.name===roleConst[i]) roleConst.splice(i,1);
                break;
            }
            file.set('roleConst', roleConst);
            
            let embedIn = new MessageEmbed();
            var {roleConst:roleConstNew} = require(`../data/data-${guild.id}.json`);
            embedIn.setTitle("Chọn vai trò: ");
            embedIn.setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);
            embedIn.setTimestamp(); 
            for(let i=0; i<roleConstNew.length; i++){
                embedIn.addField(roles[roleConstNew[i]], roleConstNew[i], inline= true);
            }
            await react.users.remove(user.id)
           .catch(error => console.error('Failed to clear reactions:', error));
            message.edit({embeds:[embedIn]});   
        });

        collector.on('end', (collected,reason) => {
            if(reason==='time'){
                interaction.channel.send('Hết thời gian chọn, vui lòng thực hiện lại lệnh');
            }
        });

    }
};