const {MessageEmbed, MessageActionRow, MessageSelectMenu} = require('discord.js');
const editJsonFile = require("edit-json-file");
const path = require('path');

module.exports={
    name: 'vote_time',
    execute: async function(client, msg){
        const guild = msg.guild;
        const pathJSON = path.normalize(__dirname+`/../data/data-${guild.id}.json`);
        const file = editJsonFile(pathJSON, {
            autosave: true
        });
        const data = file.toObject();
        const {players}= data;
        const playersId = players.map(ele => ele.id);
        const fields = players.map(ele => ele.field);
        const options = players.map(ele => ele.option);
        var numsVote =0;

        const embed = new MessageEmbed();
        embed
        .addFields(fields)
        .setTitle('Chọn 1 người để treo cổ: ')
        .setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`)
        .setTimestamp();

        const row = new MessageActionRow();
       
        row.addComponents(
            new MessageSelectMenu()
            .setMaxValues(1)
            .setCustomId('select menu')
            .setPlaceholder("Chọn 1 người")
            .addOptions(options)
        );

        const mess = await msg.channel.send({embeds: [embed], components:[row]});

        const filter = i =>{
            return playersId.includes(i.user.id);
            
        };

        const collector = mess.createMessageComponentCollector({filter, time: 30000});

        collector.on('collect', async (newI)=>{
            numsVote++;
            let value = newI.values[0];
            file.append('voteDie', value);
            if(numsVote===players.length){
                collector.stop('end_vote');
            }

        });

        collector.on('end', async (collected, reason)=>{
            if(reason==='end_vote'){
                let nextTurnMess = await msg.channel.send('result');
                nextTurnMess.delete();
                return mess.delete();
            }
        });
        return;

    }
}