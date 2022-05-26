const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const {Collection} = require('discord.js');

const files = fs.readdirSync('./commands/abilities').filter(file => file.endsWith('.js'));

var functions = new Collection();

for(let file of files){
    let performFunction = require(`./abilities/${file}`);
    functions.set(performFunction.name, performFunction); 
}

const data = new SlashCommandBuilder()
.setName('perform_ability')
.setDescription('Performing your ability in game.')
.addStringOption(option => option.setName('ability').setDescription('Type your ability.'))
.addUserOption(option => option.setName('target').setDescription('Type your target  (optional)'));
module.exports = {
    data: data,
    async execute(interaction){
        const ability = interaction.options.getString('ability');
        const performFunction = functions.get(ability);

        if(!performFunction) return interaction.reply({
            content: 'Failed!',
            ephemeral: true
        });

        const target = interaction.options.getUser('target');

        await interaction.deferReply({
            ephemeral: true
        });

        return performFunction.execute(interaction, ability, target);
    }
}