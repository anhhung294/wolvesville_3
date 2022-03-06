const deployCommandsGuild = require('../deploy-commands-guild.js');
const gameModel = require('../models/game.js');

module.exports = {
	name: 'guildCreate',
	async execute(guild) {
		const guildId = guild.id;
		const game = new gameModel({
			guildId: guild.id
		});
		await game.save();
		deployCommandsGuild(guildId);
	},			
};

