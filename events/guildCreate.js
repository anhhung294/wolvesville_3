const deployCommandsGuild = require('../deploy-commands-guild.js');
const guildModel = require('../models/guild.js');

module.exports = {
	name: 'guildCreate',
	async execute(guild) {
		const guildDB = new guildModel({
			guildId: guild.id
		});
		await guildDB.save();
		return deployCommandsGuild(guild);
	},			
};

