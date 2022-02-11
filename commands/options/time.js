const editJsonFile = require("edit-json-file");
const path = require('path');


module.exports = {
    name: 'time',
    execute: async function(interaction){
        const guildId = interaction.guildId;
        const pathJSON = path.normalize(__dirname+`/../../data/data-${guildId}.json`);
        const file = editJsonFile(pathJSON);
        const options = interaction.options.data[0].options;
        file.set('time', options[0].value);
        file.save();
        interaction.editReply(`Cài đặt thời gian thảo luận thành công. (${options[0].value} giây)`);
    }
}