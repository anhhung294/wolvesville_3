const sendReactCollector = require('../features/sendReactCollector.js');
const editJsonFile = require("edit-json-file");
const path = require('path');

module.exports={
    name: 'end',
    execute: async function(client, msg){
        const guild = msg.guild;
        const pathJSON = path.normalize(__dirname+`/../data/data-${guild.id}.json`);
        const file = editJsonFile(pathJSON, {
            autosave: true
        });
        const data = file.toObject();
        const {wolves_chatting:wolfChannelId, players} = data;
        const wolfChannel = await msg.guild.channels.cache.get(wolfChannelId);
        
        for(let i=0; i< players.length; i++){
            let member = await guild.members.cache.get(players[i].id);
            if(!member){
                continue;
            }
            if(member.voice.channel){
                member.voice.setDeaf(false);
            }
            wolfChannel.permissionOverwrites.edit(member, { VIEW_CHANNEL: false, SEND_MESSAGES:false});
        }
        
		file.set('players');
		file.set('day', [0,1]);
		file.set('isGameStarted', false);
		file.set('die', []);
		file.set('shield', []);
		file.set('mustDie', []);
		file.set('voteDie', []);
        file.set('heal', []);
        file.set('gunBullet', 2);
       
        return sendReactCollector(client, msg.channel, '-------------------------------End-------------------------------');
    }
}