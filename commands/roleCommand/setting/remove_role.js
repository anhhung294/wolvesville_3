const guildModel = require('../../../models/guild.js');

Array.prototype.removeElementInArray = function(element){
    let result = this.indexOf(element);
    if(result > -1){
        this.splice(result, 1);
    }
    return this;
}

module.exports={
    async execute(interaction, args){
        var guildDB = await guildModel.findOne({guildId: interaction.guildId});

        var rolesInGame = guildDB.roles;

        if(args.includes('all')){
            rolesInGame = [];
            await guildDB.save();
            return interaction.channel.send({
                content: 'All roles were removed'
            });
        }

        args.forEach(function(deleteRole){
            let [role, number] = deleteRole.split('-');
            number = Number(number);
            for(let i=0; i< number; i++){
               rolesInGame.removeElementInArray(role);
            }
        });

        await guildDB.save();

        return interaction.channel.send({
            content: `Remain roles after being deleted: ${rolesInGame.map(role => ' '+role)}`
        });
    }
}