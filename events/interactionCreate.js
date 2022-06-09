const guildModel = require('../models/guild.js');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (!interaction.isCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) return;

        const guildDB = await guildModel.findOne({guildId: interaction.guildId});
        
        if(!guildDB){
            const newGuildDB = new guildModel({
                guildId: interaction.guildId
            });

            await newGuildDB.save();

            return interaction.reply('Please try again!');
        }

        try {
            return command.execute(interaction);
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'There was an error while executing this command!'});
        }
	},
};