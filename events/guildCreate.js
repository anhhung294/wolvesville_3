const deployCommandsGuild = require('../deploy-commands-guild.js');
const DB = require('../features/database.js');

module.exports = {
	name: 'guildCreate',
	async execute(guild) {
		const guildId = guild.id;
    const saveObject = {
      severId: guildId,
      serverName: guild.name
    }
    DB('save', guild.id, saveObject);
		deployCommandsGuild(guildId);
	},			
};

