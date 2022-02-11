const editJsonFile = require("edit-json-file");
const path = require('path');
const deployCommandsGuild = require('../deploy-commands-guild.js');


module.exports = {
	name: 'guildCreate',
	async execute(guild) {
		const guildId = guild.id;
		const pathJSON = path.normalize(__dirname+`/../data/data-${guildId}.json`);
		const file = editJsonFile(pathJSON);
		file.set('host_channel',0);
		file.set('wolves_chatting',0);
		file.set('chatting', 0);
		file.set('time',120);
		file.set('roleConst',[
			"🛡️",
			"🐺",
			"🧙‍♀️",
			"👀",
			"👲",
			"🔫",
			"🤡"]);
		file.save();
		deployCommandsGuild(guildId);
	},			
};

