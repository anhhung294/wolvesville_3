const { findByIdAndUpdate } = require('../../models/game.js');
const gameModel = require('../../models/game.js');


module.exports = {
    name: 'time',
    execute: async function(interaction){
        const guildId = interaction.guildId;
        const time = interaction.options.getInteger('time');
        await gameModel.findOneAndUpdate({
            guildId:guildId
        },{
            time:time
        });
        interaction.editReply(`Cài đặt thời gian thảo luận thành công. (${time} giây)`);
    }
};