const {MessageEmbed, MessageActionRow, MessageSelectMenu} = require('discord.js');
const editJsonFile = require("edit-json-file");
const path = require('path');

function mode(array)
{
    if(array.length == 0)
        return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++)
    {
        var el = array[i];
        if(modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;  
        if(modeMap[el] > maxCount)
        {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
}

module.exports={
    name:'🐺_turn',
    execute: async function(client, msg){
        const guild = msg.guild;
        const pathJSON = path.normalize(__dirname+`/../data/data-${guild.id}.json`);
        const file = editJsonFile(pathJSON, {
            autosave: true
        });
        const data = file.toObject();
        const {players} = data;
        const fields = players.map(ele => ele.field);
        const options = players.map(ele => ele.option);
        const wolfIds = players.filter(ele => ele.role==='🐺').map(ele => ele.id);
        var numsWolf= wolfIds.length;
        var numsVote =0;

        const embed = new MessageEmbed();
        embed
        .addFields(fields)
        .setTitle('Sói hãy chọn người để giết: ')
        .setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`)
        .setTimestamp();

        const row = new MessageActionRow();
       
        row.addComponents(
            new MessageSelectMenu()
            .setMaxValues(1)
            .setCustomId('select menu')
            .setPlaceholder("Chọn 1 người để giết")
            .addOptions(options)
        );

        const mess = await msg.channel.send({embeds: [embed], components:[row]});

        const filter = i =>{
            return wolfIds.includes(i.user.id);
            
        };

        const collector = mess.createMessageComponentCollector({filter, time: 30000});

        collector.on('collect', async (newI)=>{
            file.append('die', newI.values[0]);
            file.save();
            numsVote++;
            if(numsVote===numsWolf){
                collector.stop('end_vote');
            }

        });

        collector.on('end', async (collected, reason)=>{
            if(reason==='end_vote'){
                let diePerArr = file.get('die');
                let diePer = mode(diePerArr);
                file.set('die', [diePer]);
                file.save();
                let nextTurnMess = await msg.channel.send('next_turn 🐺');
                nextTurnMess.delete();
                return mess.delete();
            }
        });
        return;
    }
};