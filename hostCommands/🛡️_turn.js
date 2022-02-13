const {MessageEmbed, MessageActionRow, MessageSelectMenu} = require('discord.js');
const editJsonFile = require("edit-json-file");
const path = require('path');

module.exports={
    name:'🛡️_turn',
    execute: async function(client, msg){
        const guild = msg.guild;
        const pathJSON = path.normalize(__dirname+`/../data/data-${guild.id}.json`);
        const file = editJsonFile(pathJSON, {
            autosave: true
        });
        const data = file.toObject();
        const {players, shield} = data;
        const options = players.map(ele => ele.option);
        const fields = players.map(ele => ele.field); 
        var bodyguardIds = []; 

        const embed = new MessageEmbed();
        embed
        .addFields(fields)
        .setTitle('Chọn 1 người để bảo vệ')
        .setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`)
        .setTimestamp();
        
        const bodyguardId = players.filter(ele => ele.role==='🛡️')[0].id;

        const row = new MessageActionRow();
       
        row.addComponents(
            new MessageSelectMenu()
            .setMaxValues(1)
            .setCustomId('select menu')
            .setPlaceholder("Chọn 1 người để bảo vệ")
            .addOptions(options)
        );

        const mess = await msg.channel.send({embeds: [embed], components:[row]});

        const filter = i =>{
            return bodyguardId ===i.user.id;
            
        };

        const collector = mess.createMessageComponentCollector({filter, time: 30000});

        collector.on('collect', async (newI)=>{
            let values = newI.values;
            if(values[0]===shield[0]){
                newI.reply({
                    content:'Bảo vệ không được bảo vệ cùng 1 người 2 đêm liên tiếp',
                    ephemeral: true
                });
            }else{
                file.set('shield', values);
                file.save();
                mess.delete();
                let nextTurnMess = await newI.channel.send('next_turn 🛡️');
                nextTurnMess.delete();
            }
        });

        collector.on('end', async (collected, reason)=>{
            if(reason==='time'){
                mess.delete();
                let nextTurnMess = await msg.channel.send('next_turn 🛡️');
                nextTurnMess.delete();
            }
        });

        
        return;
    }
};