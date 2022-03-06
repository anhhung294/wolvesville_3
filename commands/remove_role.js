const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageEmbed, MessageActionRow,MessageSelectMenu} = require('discord.js');
const {roles: ViRoles} = require('../config.json');
const gameModel = require('../models/game.js');


const data = new SlashCommandBuilder()
.setName('remove_role') 
.setDescription('Xóa bớt chức năng');

module.exports = {
	data: data, 
	async execute(interaction) {
        const game = await gameModel.findOne({
            guildId: interaction.guildId
        });
        var roles = game?game.roles:[];
        if(roles.length<=0){
            return interaction.reply('Chưa thêm chức năng');
        }

        if(game.isGameStarted){
			return interaction.reply({
				content:'Trò chơi đang bắt đầu tại máy chủ này',
				ephemeral: true
			});
		}

        var roleSet = new Set(roles);

        var [...arrRoleSet] = roleSet;
        
        var options = [];
        
        const embed = new MessageEmbed();

        embed.setTitle("Chọn chức năng để xóa: ");
        embed.setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);
        embed.setTimestamp(); 

        const row = new MessageActionRow();

        arrRoleSet.forEach(role =>{
            options.push({
                label: ViRoles[role]+' '+roles.filter(item=> item===role).length,
                value: role
            });
        });
        row.addComponents(
            new MessageSelectMenu()
            .setCustomId('select menu')
            .addOptions(options)
        );

        const mess = await interaction.reply({embeds: [embed], components:[row], ephemeral: true, fetchReply: true});

        const filter = i =>{
            return interaction.user.id === i.user.id;
        };

        const collector = await mess.createMessageComponentCollector({filter, time:30000});

        collector.on('collect',async (newI)=>{
            let values = newI.values;
            let newOptions =[];
            values.forEach(value=>{
                let index = roles.indexOf(value);
                if (index > -1) {
                    roles.splice(index, 1);
                }
            });
            await gameModel.findOneAndUpdate({
                guildId: newI.guildId
            },{
                roles: roles
            });

            const newGame = await gameModel.findOne({
                guildId: newI.guildId   
            });

            let newRoleSet = new Set(newGame.roles);

            let [...arrNewRoleSet] = newRoleSet;

            arrNewRoleSet.forEach(role =>{
                newOptions.push({
                    label: ViRoles[role]+' '+newGame.roles.filter(item=> item===role).length,
                    value: role
                });
            });
            
            if(newGame.roles.length<=0){
                return interaction.editReply({
                    content:'Chưa thêm chức năng',
                    embeds:[],
                    components:[]
                });
            }

            const newRow = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                .setCustomId('select menu')
                .addOptions(newOptions)
            );
            

            await interaction.editReply({
                embeds: [embed],
                components:[newRow], 
                ephemeral: true, 
                fetchReply: true
            });
        });
	} 
}; 