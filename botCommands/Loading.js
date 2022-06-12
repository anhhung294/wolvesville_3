const guildModel = require('../models/guild.js');
const embed = require('../utilities/embed.js');
const fs = require('fs')
const models = new Map();
const modelFiles = fs.readdirSync('./models');

for(let modelFile of modelFiles){
    let model = require(`../models/${modelFile}`);
    models.set(modelFile.slice(0, modelFiles.length-3), model);
} 

Array.prototype.removeElementInArray = function(element){
    let result = this.indexOf(element);
    if(result > -1){
        this.splice(result, 1);
    }
    return this;
}

module.exports = {
    name: 'Loading',
    async execute(msg){
        const guildDB = await guildModel.findOne({guildId: msg.guildId});
        const logs = guildDB.log.split('|').slice(1).map(e => e.split('-'));
        var players = [...guildDB.player];
        var life = {};
        var playerRoles = {};
        
        for(let i=0; i< players.length; i++){
            let [playerId, playerRole] = players[i].split('-');
            life[playerId] = 0;
            playerRoles[playerId] = playerRole;
        }

        for(let i=0; i< logs.length; i++){
            let log = logs[i];
            switch(log[1]){
                case 'kill': 
                    life[log[2]]--;
                    break;
                case 'save':
                    life[log[2]]++;
                    break;
            }
        }

        for(let [id, heart] of Object.entries(life)){
            if(heart<0){
                let die = await msg.guild.members.cache.get(id);

                let model = models.get(playerRoles[id]);

                await model.findOneAndDelete({playerId: id});

                await guildModel.findOneAndUpdate({guildId: msg.guild.id},{player: guildDB.player.removeElementInArray(`${id}-${playerRoles[id]}`)});

                await msg.channel.send({
                    embeds: [await embed('RED', `${die.displayName} was killed.`)]
                });
            }
        }

        let mess = await msg.channel.send('start_discussion');

        return mess.delete();
        
    }
}