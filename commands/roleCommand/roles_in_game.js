const guildModel = require('../../models/guild.js');

module.exports = {
    async execute(interaction){
        const guildDB = await guildModel.findOne({guildId: interaction.guildId});

        const {roles} = guildDB;
         
        const rolesInGame = roles?roles.map(role => ' '+role):'nothing';

        return interaction.channel.send({
            content: `Roles in game: ${rolesInGame}`
        });
    }
}