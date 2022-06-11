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

        if(guildDB.isGameStarted) return interaction.editReply('This server is playing game!');

        if(args.includes('all')){
            guildDB.roles = [];
            await guildDB.save();
            return interaction.editReply({
                content: 'All roles were removed'
            });
        }

        args.forEach(function(deleteRole){
            let [role, number] = deleteRole.split('-');
            number = Number(number||1);
            for(let i=0; i< number; i++){
               guildDB.roles.removeElementInArray(role);
            }
        });
+
        await guildDB.save();

        return interaction.editReply({
            content: `Remain roles after being deleted: ${guildDB.roles.map(role => ' '+role).length>0?guildDB.roles.map(role => ' '+role):'nothing'}`
        });
    }
}