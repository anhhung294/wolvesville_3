const { SlashCommandBuilder } = require('@discordjs/builders');
const gameModel = require('../models/game.js');
const embed = require('../features/embed.js');


const data = new SlashCommandBuilder()
.setName('villager') 
.setDescription('Xem dân làng còn sống hiện tại');

module.exports = {
	data: data, 
	async execute(interaction) {
        const game = await gameModel.findOne({
            guildId: interaction.guild.id
        });
        if(!game){
            const gameM = new gameModel({
              guildId: interaction.guild.id,
            });
            await gameM.save();
        }  
        const newGame = await gameModel.findOne({
            guildId: interaction.guild.id
        });
        const players = newGame.players;
        
        if(players.length<=0){
            return interaction.editReply('Chưa bắt đầu trò chơi');
        }

        const embedSend = embed('Còn sống', 'GREEN', players.map(player => ' '+player.user.username));

        return interaction.editReply({
            embeds: [embedSend],
            ephemeral: true
        });
	} 
}; 