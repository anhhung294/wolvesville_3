const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');
const {roles} = require('../config.json');
const editJsonFile = require("edit-json-file");
const path = require('path');

const data = new SlashCommandBuilder()
	.setName('villagers') 
	.setDescription('Dân làng còn sống');
module.exports={
    data: data,
    execute: async function(interaction){
        const guild = interaction.guild;
        const pathJSON = path.normalize(__dirname + `/../data/data-${guild.id}.json`);
        const file = editJsonFile(pathJSON,{
            autosave:true
        });
        var players = file.get('players');
        if(!players||players.length===0){
            return interaction.reply({
                content:'Không còn ai sống sót hoặc tham gia trò chơi',
                ephemeral:true
            });
        }

        const embed = new MessageEmbed();

        embed.setTitle("Dân làng còn sống:");
        embed.setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);
        embed.setTimestamp(); 
        for(let i=0; i<playersId.length; i++){
            let member = await guild.members.cache.get(playersId[i]);
            embed.addField(member.displayName, '👲', inline= true);
        }

        interaction.reply({ embeds: [embed], ephemeral: true});
    }
};