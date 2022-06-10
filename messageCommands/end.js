const guildModel = require('../models/guild.js');
const embed = require('../utilities/embed.js');

module.exports = {
    name: 'end',
    async execute(msg){
        const removedGuildDB = await guildModel.findOneAndRemove({guildId: msg.guild.id});

        const guildDB = new guildModel({
			guildId: msg.guild.id,
            roles: removedGuildDB.roles,
            timeDiscussion: removedGuildDB.timeDiscussion
		});
        
		await guildDB.save(); 

        return msg.channel.send({
            embeds:[await embed('RED', '--------------------END--------------------')]
        });
    }
}