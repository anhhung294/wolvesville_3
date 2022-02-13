const {MessageEmbed, MessageActionRow, MessageSelectMenu} = require('discord.js');
const editJsonFile = require("edit-json-file");
const path = require('path');

module.exports={
    name:'👀_turn',
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
        const seerId = players.filter(ele => ele.role==='👀').map(ele => ele.id)[0];
        const seer = await guild.members.cache.get(seerId);

        const embed = new MessageEmbed();
        embed
        .addFields(fields)
        .setTitle('Bạn muốn xem chức năng của ai?')
        .setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`)
        .setTimestamp();

        const embedHost = new MessageEmbed();
        embedHost
        .setTitle('Tiên tri đang thực hiện chức năng')
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
        const messHost = await msg.channel.send({
            embeds: [embedHost]
        });

        const mess = await seer.send({embeds: [embed], components:[row]});

        const filter = i =>{
            return seerId===i.user.id;
            
        };

        const collector = mess.createMessageComponentCollector({filter, time: 30000});

        collector.on('collect', async (newI)=>{
            let value = newI.values[0];
            let choose = await guild.members.cache.get(value);
            let chooseRole = await players.filter(ele => ele.id===value)[0].role;
            let embedSeer = new MessageEmbed();
            embedSeer
                .addField(choose.displayName, chooseRole)
                .setTitle('Kết quả:')
                .setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`)
                .setTimestamp()
                .setImage(choose.displayAvatarURL());
            mess.edit({
                embeds:[embedSeer],
            });
            let nextTurnMess = await msg.channel.send('next_turn 👀');
            messHost.delete();
            return nextTurnMess.delete();
        });

        collector.on('end', async (collected, reason)=>{
            if(reason==='time'){
                mess.delete();
                messHost.delete();
                let nextTurnMess = await msg.channel.send('next_turn 👀');
                nextTurnMess.delete();
            }
        });
        
        return;
    }
};