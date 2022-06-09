const embed = require('../utilities/embed.js');
const selectMenu = require('../utilities/selectMenu.js');
const {MessageActionRow} = require('discord.js');
const guildModel = require('../models/guild.js');

module.exports = {
    name: 'werewolf',
    async execute(guild, hostChannel){
        const embedSend = await embed(null, 'werewolves\' turn', null, [{name: 'Select a villager to kill', value: '\u200B'}] ,'werewolf');
        const guildDB = await guildModel.findOne({
            guildId : guild.id
        });
        const werewolvesId = guildDB.player.filter(p => /werewolf$/.test(p)).map(p => p.split('-')[1]);

        const options = await guildDB.player.map(async p => {
            let id = p.split('-')[0];
            let member = await guild.members.cache.get(id);
            return {
                label: member.displayName,
                value: id
            }
        });

        const row = new MessageActionRow().addComponents(selectMenu('werewolfSelection', options, null, 1));

        const mess = await hostChannel.send({
            embeds: [embedSend],
            files: ['./role_images/werewolf.png'],
            components: [row]
        });

        const collector = mess.createMessageComponentCollector({
            componentType: 'SELECT_MENU',
            time: 30000,
            filter: (i) => werewolvesId.includes(i.user.id)
        });

        collector.on('collect', i =>{
            console.log(i);
        });
    }
}