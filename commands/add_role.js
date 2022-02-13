const { SlashCommandBuilder } = require('@discordjs/builders');
const fs= require('fs');

const files1 = fs.readdirSync('./commands/addRole').filter(file => file.endsWith('.js'));
const optionsCommand = new Map();
for(let file of files1){
    let command = require(`./addRole/${file}`);
    optionsCommand.set(command.name, command);
}

const data = new SlashCommandBuilder()
.setName('add_role') 
.setDescription('Cài đặt')
.addSubcommand(subcommand =>
	subcommand
		.setName('single')
		.setDescription('Thêm chức năng (từng cái 1 lần)')
)
.addSubcommand(subcommand=>
	subcommand
	.setName('multiple')
	.setDescription('Thêm chức năng (cùng lúc nhiều cái)')
);




module.exports = {
	data: data, 
	async execute(interaction) {
		await interaction.reply('Chờ tí');
		const subCommand = interaction.options.getSubcommand();
		if(optionsCommand.has(subCommand)){
			const command = optionsCommand.get(subCommand);
			command.execute(interaction);
		}
	} 
}; 