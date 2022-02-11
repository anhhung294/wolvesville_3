const editJsonFile = require("edit-json-file");
const path = require('path');


module.exports = {
    name: 'channel',
    execute: async function(interaction){
        const guildId = interaction.guildId;
        const pathJSON = path.normalize(__dirname+`/../../data/data-${guildId}.json`);
        const file = editJsonFile(pathJSON);
        const options = interaction.options.data[0].options;
        options.forEach(option => {
            file.set(option.name, option.channel.id);
        });
        file.save();
    
        interaction.editReply('Cài đặt kênh thành công.');
    }
};