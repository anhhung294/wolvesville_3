const { rolesExecuteAfterNight} = require('../config.json');
const guildModel = require('../models/guild.js');
const wait = require('wait');
const embed = require('../utilities/embed.js');
const {MessageEmbed, MessageActionRow, MessageSelectMenu} = require('discord.js');
const mode = require('../utilities/mode.js');

module.exports = {
    name: 'start_discussion',
    async execute(msg){
        const guildDB = await guildModel.findOne({ guildId: msg.guildId});
        var {timeDiscussion, player} = guildDB;
        var fields = [...player];
        var vote = {};
        
        for(let role of rolesExecuteAfterNight){
            try{
                let controller = require(`./controllers/${role}.js`);
                await controller(msg);
            }catch(err){
                continue;
            }
        }

        for(let i=0; i< fields.length; i++){
            let [playerId, playerRole] = player[i].split('-')
            let member = await msg.guild.members.cache.get(playerId);
            fields.splice(i,1,({
                id:playerId,
                role: playerRole,
                member: member
            }));
            vote[member.user.id] = '';
        }

        const fieldVote = fields.map(player => ({name: player.member.user.tag, value: '0', inline:true}));
        const options = [...fields.map(p => ({label: p.member.user.tag, value: `${p.id}-${p.member.user.tag}`})),{label: 'Cancel vote', value: '0-cancel'}];
        
        const embedVote = new MessageEmbed()
        .setTitle('Votes: ')
        .setColor('GREEN')
        .setTimestamp()
        .addFields(fieldVote);
        
        const row = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
            .setCustomId('vote')
            .setMaxValues(1)
            .setPlaceholder('Vote a player')
            .setOptions(options)
        );

        const messVote = await msg.channel.send({
            embeds: [embedVote],
            components: [row]
        });

        var playersId = fields.map(p => p.id);

        await guildModel.findOneAndUpdate({guildId: msg.guildId}, {fieldVote: fieldVote, vote: vote});

        const collector = await messVote.createMessageComponentCollector({
            filter: (i)=> {
                if(playersId.includes(i.user.id)){
                    return true;
                }else{
                    i.reply({
                        content: 'You are not in game!'
                    });
                    return false;
                }
            },
            componentType: 'SELECT_MENU'
        });

        collector.on('collect',async (i) =>{
            let inGuildDB = await guildModel.findOne({guildId: i.guildId});
            let [playerVotedId, playerVotedName] = i.values[0].split('-');
            let lastVote = inGuildDB.vote[i.user.id].toString();
            let infieldVote = inGuildDB.fieldVote;

            for(let j=0; j< infieldVote.length; j++){
                if(infieldVote[j].name===playerVotedName){
                    inGuildDB.vote[i.user.id] = playerVotedName;
                    infieldVote[j].value=(Number(infieldVote[j].value)+1).toString();
                }
                if(lastVote===infieldVote[j].name){
                    infieldVote[j].value=(Number(infieldVote[j].value)-1).toString();
                }
            }
            
            embedVote.setFields(infieldVote);

            await inGuildDB.save();

            await messVote.edit({
                embeds:[embedVote]
            });

            let contentVote = `You voted against ${playerVotedName}`

            if(playerVotedName==='cancel'){
                contentVote = `You just unvoted ${lastVote}`
            }

            return i.reply({
                content: contentVote,
                ephemeral: true
            });
        });

        collector.on('end',async (collected, reason) =>{
            let inGuildDB = await guildModel.findOne({guildId: msg.guildId});
            let inFieldVote = inGuildDB.fieldVote;
            let playerVoted = mode(inFieldVote.map(p => new Array(Number(p.value)).fill('').map(e => p.name)).flat());
            //TODO: computing after vote
            console.log(playerVoted);
        });

        await wait((timeDiscussion-5)*1000);

        await msg.channel.send({
            embeds:[await embed('RED', '5 seconds left until the end of the discussion',null,null,'./data/system/5seconds.png')],
            files:['./data/system/5seconds.png']
        });

        for(let i=5; i>0; i--){
            await wait(1000);
            await msg.channel.send(`${i-1}`);
        }

        collector.stop();

        let mess = await msg.channel.send({
            content: 'end_discussion'
        });

        await mess.delete();

        return;
    }
}