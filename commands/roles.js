const { SlashCommandBuilder } = require('@discordjs/builders');
const {roles: ViRoles} = require('../config.json');
const gameModel = require('../models/game.js');


const data = new SlashCommandBuilder()
.setName('roles') 
.setDescription('Chức năng');

module.exports = {
	data: data, 
	async execute(interaction) {
        const obj = await gameModel.findOne({
            guildId: interaction.guild.id
          });
        if(!obj){
            const game = new gameModel({
              guildId: interaction.guild.id,
            });
            await game.save();
        }
        const newObj = await gameModel.findOne({
            guildId: interaction.guild.id
        });
        if(newObj.roles.length<=0){
            return interaction.reply({
                content:'Chưa thêm chức năng',
                ephemeral: true
            });
        }
        interaction.reply({
            content:`Hiện có: ${newObj.roles.map(role => ' '+ViRoles[role])}`,
            ephemeral: true
        });
	} 
}; 