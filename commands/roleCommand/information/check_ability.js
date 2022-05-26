const guildModel = require('../../../models/guild.js');
const fs = require('fs');
const files1 = fs.readdirSync('./roleInfo').filter(file => file.endsWith('.txt'));

module.exports = {
    async execute(interaction, args){
        const guildDB = await guildModel.findOne({guildId: interaction.guildId});
        const player = guildDB.player;
        const userId = interaction.user.id;
        var mineRole;

        for(let i =0; i< player.length; i++){
            if(player[i].includes(userId)){
                mineRole = player[i].split('-')[1];
                break;
            }
        }

        return args.forEach(async arg =>{
            if(arg ==='mine') arg = mineRole;

            if(!arg) return interaction.editReply({
                content:`Your role is nothing because you are either died or unparticipated in any game!`
            });

            if(!files1.includes(arg+'.txt')){
                return interaction.editReply({
                    content:`This role (${arg}) doesn't exist`,
                });
            }

            let roleModel = require(`../../../models/${arg}.js`);

            let abilities = roleModel.schema.tree.abilities.map(ability => ' '+ ability);

            return interaction.editReply({
                content:`Your abilities: ${abilities.length>0?abilities:'nothing'}`
            });
        });
    }
}