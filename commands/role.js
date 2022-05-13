const { SlashCommandBuilder } = require('@discordjs/builders');
const fs= require('fs');
const files1 = fs.readdirSync('./commands/roleCommand').filter(file => file.endsWith('.js'));

const data = new SlashCommandBuilder()
.setName('role') 
.setDescription('Everything related to the role.')
.addStringOption(option => option.setName('role_info').setDescription('Find information about roles.'))
.addStringOption(option => option.setName('add_role').setDescription('Pick roles to play game.'));

module.exports = {
	data: data, 
	async execute(interaction) {
        await interaction.reply({content: 'Wait a minute!'});

        const options = interaction.options._hoistedOptions;

        await interaction.deleteReply();

        options.forEach(async (option) => {
            let command = option.name;
            let args = option.value.split(/\s+/);
            if(!files1.includes(command+'.js')){
                return interaction.channel.send({
                    content:`This role (${command}) doesn't exist`,
                });
            }

            let Command = require(`./roleCommand/${command}.js`);
            return Command.execute(interaction, args);
        });
        
	} 
}; 