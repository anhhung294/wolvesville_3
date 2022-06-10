const guildModel = require('../models/guild.js');

module.exports = {
    name: 'next',
    async execute(msg){
        const guildDB = await guildModel.findOne({guildId: msg.guildId});
        
    }
}