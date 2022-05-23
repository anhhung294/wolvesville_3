const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const {Collection} = require('discord.js');

const files = fs.readdirSync('./commands/function').filter(file => file.endsWith('.js'));

var functions = new Collection();

for(let file of files){
    let performFunction = require(`./function/${file}`);
    functions.set(performFunction.name, performFunction); 
}

const data = new SlashCommandBuilder()
.setName('perform_function')
.setDescription('Performing your function in game.')
.addStringOption(option => option.setName('function').setDescription('Type your function.'))
.addUserOption(option => option.setName('target').setDescription('Type your target  (optional)'));
module.exports = {
    data: data,
    async execute(interaction){
        const funcName = interaction.options.getString('function');
        const performFunction = functions.get(funcName);

        if(!performFunction) return interaction.reply({
            content: 'Failed function!',
            ephemeral: true
        });

        const target = interaction.options.getUser('target');

        await interaction.deferReply({
            ephemeral: true
        });

        return performFunction.execute(interaction, funcName, target);
    }
}