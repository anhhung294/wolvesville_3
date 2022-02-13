const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');
const {roles} = require('../config.json');
const editJsonFile = require("edit-json-file");
const path = require('path');

const data = new SlashCommandBuilder()
	.setName('roles') 
	.setDescription('Các chức năng hiện có');
module.exports={
    data: data,
    execute: async function(interaction){
        const guild = interaction.guild;
        const pathJSON = path.normalize(__dirname + `/../data/data-${guild.id}.json`);
        const file = editJsonFile(pathJSON,{
            autosave:true
        });
        var roleConst = file.get('roleConst');
        if(roleConst.length===0){
            return interaction.reply('Chưa chọn chức năng');
        }

        const embed = new MessageEmbed();

        embed.setTitle("Các chức năng hiện tại: ");
        embed.setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);
        embed.setTimestamp(); 
        for(let i=0; i<roleConst.length; i++){
            embed.addField(roles[roleConst[i]], roleConst[i], inline= true);
        }
        
        interaction.reply({ embeds: [embed], ephemeral: true});
    }
};