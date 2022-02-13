const {MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {roles} = require('../../config.json');
const editJsonFile = require("edit-json-file");
const path = require('path');

module.exports={
    name: 'single',
    execute: async function(interaction){
        const guild = interaction.guild;
        const roleKey = Object.keys(roles);
        const pathJSON = path.normalize(__dirname + `/../../data/data-${guild.id}.json`);
        const file = editJsonFile(pathJSON, {
            autosave:true
        });

        const embed = new MessageEmbed();

        embed.setTitle("Chọn chức năng: ");
        embed.setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);
        embed.setTimestamp(); 
        roleKey.forEach( (key) => {
            embed.addField(roles[key], key, inline = true);
        });

        const rows = [];

        for(let i=0; i< roleKey.length/5; i++){
            let row = new MessageActionRow();
            let length = (roleKey.length>(i*5+5))?(i*5+5):roleKey.length;
            for(let j=i*5; j< length;j++){
                row.addComponents(
                    new MessageButton()
                        .setCustomId(roles[roleKey[j]])
                        .setLabel(roles[roleKey[j]].toUpperCase())
                        .setStyle('SUCCESS')
                        .setEmoji(roleKey[j])
                );
            }
            rows.push(row);
        }

        let message = await interaction.channel.send({embeds: [embed], components: rows});

        const filter = (i) => {
            return !i.user.bot;
        };

        const collector = message.createMessageComponentCollector({filter, time: 99999});

        collector.on('collect',async (newI) => {
            let emoji = newI.component.emoji.name;
            file.append('roleConst', emoji);
            newI.reply(`Đã thêm ${roles[emoji]} ${emoji}`);  
        });
        collector.on('end', (collected,reason) => {
            if(reason==='time'){
                interaction.channel.send('Hết thời gian chọn, vui lòng thực hiện lại lệnh');
            }
        });
    }
} 