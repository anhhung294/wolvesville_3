const guildModel = require('../models/guild.js');
const embed = require('../utilities/embed.js');

module.exports = {
    name: 'end',
    async execute(msg){
        await guildModel.findOneAndUpdate({guildId: msg.guild.id},{
            vote: {'123':'abc'},
            fieldVote:[],
            day: [0,1],
            log: '',
            isGameStarted: false,
            player: []
        });

        return msg.channel.send({
            embeds:[await embed('RED', '--------------------END--------------------')]
        });
    }
}