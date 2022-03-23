const gameModel = require('../models/game.js');

module.exports = {
	name: 'voiceStateUpdate',
	async execute(oldState, newState) {
		const game = await gameModel.findOne({
            guildId: oldState.guild.id
        });

        const hostChannel = await oldState.guild.channels.cache.get(game.host_channel);

        const member = await oldState.guild.members.cache.get(oldState.id);

        const werewolfChannel = await oldState.guild.channels.cache.find(channel => channel.name==='Ma sói');
        
        if(!werewolfChannel) return;

        if(oldState.channelId&&!newState.channelId){
            if(oldState.channelId==werewolfChannel.id){
                hostChannel.send({
                    embeds: [{
                        title: `${member.displayName} đã rời khỏi phòng`,
                        color: 'BLUE'
                    }]
                });
                if(oldState.channel.members.size===0){
                    let mess = await hostChannel.send('end');
                    mess.delete();
                }
            }
        }
	},
};