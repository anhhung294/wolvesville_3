const embed = require('../utilities/embed.js');
const selectMenu = require('../utilities/selectMenu.js');
const {MessageActionRow} = require('discord.js');
const guildModel = require('../models/guild.js');
const mode = require('../utilities/mode.js');

module.exports = {
    name: 'werewolf',
    async execute(guild, hostChannel){
        const embedSend = await embed(null, 'werewolves\' turn', null, [{name: 'Select a villager to kill', value: '\u200B'}] ,'werewolf');
        const guildDB = await guildModel.findOne({
            guildId : guild.id
        });

        const werewolvesId = guildDB.player.filter(p => /werewolf$/.test(p)).map(p => p.split('-')[1]);

        var options = [...guildDB.player];

        for(let i=0; i< options.length; i++){
            let id = options[i].split('-')[0];
            let member = await guild.members.cache.get(id);
            
            options.splice(i, 1,{
                label: member.displayName,
                value: member.displayName+'-'+id
            });
        }

        const row = new MessageActionRow().addComponents(selectMenu('werewolfSelection', options, null, 1));

        const mess = await hostChannel.send({
            embeds: [embedSend],
            files: ['./role_images/werewolf.png'],
            components: [row]
        });

        const collector = await mess.createMessageComponentCollector({
            componentType: 'SELECT_MENU',
            time: 30000,
            filter: (i) => {
                if(werewolvesId.includes(i.user.id)){
                    return true;
                }else{
                    i.reply({
                        content: 'You aren\'t werewolf',
                        ephemeral: true
                    });
                    return false;
                }
            }
        });

        collector.on('collect', i =>{
            let [name, id] = i.values[0].split('-');
            let numOfWolves = werewolvesId.length;
            let diePersonId;
            let result = [];

            result.push(id);
            
            if(result.length>=numOfWolves){
                diePersonId = mode(result);
                collector.stop(diePersonId);
            }

            return i.reply({
                content:`You voted to kill ${name}`,
                ephemeral: true
            });
        });

        collector.on('end', async (collected, reason) => {
            let diePersonId;
            
            if(reason ==='time'){
                diePersonId = mode(collected.map(e => e.split('-')[1]));
            }else{
                diePersonId = reason;
            }
                
            guildDB.log += `|werewolf-kill-${diePersonId}`;
            
            await guildDB.save();
        });
    }
}