const { SlashCommandBuilder } = require('@discordjs/builders');
const fs= require('fs');
const gameModel = require('../models/game.js');

const files1 = fs.readdirSync('./commands/options').filter(file => file.endsWith('.js'));
const optionsCommand = new Map();
for(let file of files1){
    let command = require(`./options/${file}`);
    optionsCommand.set(command.name, command);
}

const data = new SlashCommandBuilder()
.setName('option') 
.setDescription('Cài đặt ')
.addSubcommand(subcommand =>
	subcommand
		.setName('channel')
		.setDescription('Cài đặt kênh')
		.addChannelOption(option => option.setName('host_channel').setDescription('Chọn kênh'))
)
.addSubcommand(subcommand=>
	subcommand
	.setName('time')
	.setDescription('Thời gian để thảo luận')
	.addIntegerOption(option => option.setName('time').setDescription('Enter an integer'))
);




module.exports = {
	data: data, 
	async execute(interaction) {
		const obj = await gameModel.findOne({
			guildId: interaction.guild.id
		});
		if(!obj){
			const role = new gameModel({
				guildId: interaction.guild.id,
			});
			await role.save();
		}
		if(obj.isGameStarted){
			return interaction.reply({
				content:'Trò chơi đang bắt đầu tại máy chủ này',
				ephemeral: true
			});
		}
		await interaction.reply('Chờ tí');
		const subCommand = interaction.options.getSubcommand();
		if(optionsCommand.has(subCommand)){
			const command = optionsCommand.get(subCommand);
			command.execute(interaction);
		}
	} 
}; 