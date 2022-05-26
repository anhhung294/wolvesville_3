const { SlashCommandBuilder } = require('@discordjs/builders');
const fs= require('fs');
const files1 = fs.readdirSync('./commands/roleCommand');

const data = new SlashCommandBuilder()
.setName('role') 
.setDescription('Everything relate to the role.')
.addSubcommand(subcommand => 
    subcommand
    .setName('information')
    .setDescription('Find information of anything')
    .addStringOption(option => option.setName('role_info').setDescription('Find information about roles.'))
    .addStringOption(option => option.setName('check_ability').setDescription('Find ability of a role.'))
)
.addSubcommand(subcommand => subcommand.setName('roles_in_game').setDescription('Find the number of roles in game.'))
.addSubcommand(subcommand => 
    subcommand
    .setName('setting')
    .setDescription('Setting game.')
    .addStringOption(option => option.setName('add_role').setDescription('Pick roles to play game.'))
    .addStringOption(option => option.setName('remove_role').setDescription('Remove role'))
)            
module.exports = {
	data: data, 
	async execute(interaction) {
        await interaction.reply({
                content: `${interaction.member.displayName} used: ${interaction.options.data.map(data =>{
                    return `${data.name}: ${data.options.map(option => `${option.name} -- ${option.value.split(/\s+/).join(', ')}`).join(' | ')}`;
            })}`,
            ephemeral: true
        });

        const subcommand = interaction.options._subcommand;
        const options = interaction.options._hoistedOptions;

        const path = files1.includes(subcommand+'.js')?'':`${subcommand}/`;

        if(!path) options.push(subcommand);

        options.forEach(async (option) => {
            let command = option.name?option.name:subcommand;
            let args = option.value?.split(/\s+/);

            let Command = require(`./roleCommand/${path}${command}.js`);
            return Command?.execute(interaction, args);
        });
        
	} 
}; 