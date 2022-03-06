const gameModel = require('../../models/game.js');


module.exports = {
    name: 'channel',
    execute: async function(interaction){
        const guildId = interaction.guildId;
        const channel = interaction.options.getChannel('host_channel');
        
        const game = await gameModel.findOneAndUpdate({
            guildId: guildId    
        },{
            host_channel: channel.id
        });
    
        interaction.editReply('Cài đặt kênh thành công.');
    }
};