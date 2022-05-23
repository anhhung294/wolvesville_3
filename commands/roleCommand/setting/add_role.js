var {roles} = require('../../../config.json');
const guildModel = require('../../../models/guild.js');

module.exports={
    async execute(interaction, args){
        var box = {};
        var result = [];

        args.forEach(arg =>{
            let roleAndCount = arg.split('-');
            box[roleAndCount[0]]=roleAndCount[1]?Number(roleAndCount[1]):1;            
        });

        for(const [key, value] of Object.entries(box)){
            for(let i=0; i< value; i++){
                roles.includes(key)?result.push(key):null;
            }
        }

        await guildModel.findOneAndUpdate({guildId: interaction.guildId},{$push: {roles: {$each: result}}});
        
        return interaction.channel.send({
            content:`Added ${result.map(role => ' '+role)}`,
            ephemeral: true
        });
    }
}