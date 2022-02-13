const {MessageEmbed, MessageActionRow, MessageSelectMenu} = require('discord.js');
const editJsonFile = require("edit-json-file");
const path = require('path');

module.exports={
    name:'🧙‍♀️_turn',
    execute: async function(client, msg){
        const guild = msg.guild;
        const pathJSON = path.normalize(__dirname+`/../data/data-${guild.id}.json`);
        const file = editJsonFile(pathJSON, {
            autosave: true
        });
        const data = file.toObject();
        const {players, shield, die} = data;
        const options = players.map(ele => ele.option);
        const fields = players.map(ele => ele.field); 
        const witchId = players.filter(ele=> ele.role==='🧙‍♀️')[0].id; 
        const diePer = await guild.members.cache.get(die[0]);
        const shieldPer = await guild.members.cache.get(shield[0]);

        const embedKill = new MessageEmbed();
        embedKill
        .addFields(fields)
        .setTitle('Chọn 1 người để dùng bình giết')
        .setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`)
        .setTimestamp();
        const embedHeal = new MessageEmbed();
        embedHeal
        .setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`)
        .setTimestamp();

        const rowHeal = new MessageActionRow()
                .setCustomId('heal')
                .setCustomId('select menu')
                .setMaxValues(1);

        const rowKill = new MessageActionRow();
       
        rowKill.addComponents(
            new MessageSelectMenu()
            .addOptions({
                label:'Không dùng bình giết',
                value:'0'
            })
            .setCustomId('kill')
            .setMaxValues(1)
            .setCustomId('select menu')
            .setPlaceholder("Chọn 1 người")
            .addOptions(options)
        );
        
        if(shieldPer.id===diePer.id){
            embedHeal.setTitle(`${diePer.displayName} đã chết, phù thủy có muốn cứu không?`);
            
            rowHeal.addComponents(
                new MessageSelectMenu()
                .addOptions([{
                    label:'Cứu',
                    value:'1'
                },{
                    label:'Không cứu',
                    value:'0'
                }])
                .setPlaceholder("Cứu hay không cứu")
            );    
        }else{
            embedHeal.setTitle(`Không ai chết, phù thủy không cần dùng bình cứu`);

            rowHeal.addComponents(
                new MessageSelectMenu()
                .addOptions({
                    label:'Bỏ qua',
                    value:'skip'
                })
                .setPlaceholder("Chọn để bỏ qua")
            );    
        }

        const mess = await msg.channel.send({embeds: [embedHeal, embedKill], components:[rowHeal, rowKill]});

        const filter = i =>{
            return witchId ===i.user.id;
            
        };

        const collector = mess.createMessageComponentCollector({filter, time: 30000});

        collector.on('collect', async (newI)=>{
            switch(newI.customId){
                case 'kill':{
                    let value = newI.values[0];
                    if(value!=='skip'){
                        file.set('mustDie', [value]);
                        file.save();
                    }
                    let nextTurnMess = await msg.channel.send('next_turn 🧙‍♀️');
                    nextTurnMess.delete();
                    return mess.delete();
                }case 'heal':{
                    let value = newI.values;
                    let diePerId = file.get('die');
                    let healOrSkip = new Number(value);
                    if(healOrSkip){
                        file.set('die', []);
                        file.set('heal', [diePerId]);
                    }
                    let nextTurnMess = await msg.channel.send('next_turn 🧙‍♀️');
                    nextTurnMess.delete();
                    return mess.delete();
                }
            }
        });

        collector.on('end', async (collected, reason)=>{
            if(reason==='time'){
                mess.delete();
                let nextTurnMess = await msg.channel.send('next_turn 🧙‍♀️');
                nextTurnMess.delete();
            }
        });
        return;
    }
};