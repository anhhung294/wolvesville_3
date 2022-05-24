const {SlashCommandBuilder} = require('@discordjs/builders');
const fs = require('fs');

const data = new SlashCommandBuilder()
.setName('roles_bot_has')
.setDescription('Roles that bot has for playing.');

module.exports = {
    data: data,
    async execute(interaction){
        const data = fs.readdirSync('./roleInfo/');
        return interaction.reply({
            content: data.map((role, index) => (index+1)+'. '+role.slice(0,role.length-4)+ '\n').join(''),
            ephemeral: true
        });
    }
}