const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageEmbed, MessageActionRow,MessageButton} = require('discord.js');
const {roles} = require('../config.json');
const editJsonFile = require("edit-json-file");
const path = require('path');

const data = new SlashCommandBuilder()
	.setName('remove_role') 
	.setDescription('Xóa vai trò');
module.exports={
    data: data,
    execute: async function(interaction){
        const guild = interaction.guild;
        const roleKey = Object.keys(roles);
        const pathJSON = path.normalize(__dirname + `/../data/data-${guild.id}.json`);
        const file = editJsonFile(pathJSON,{
            autosave:true
        });
        var roleConst = file.get('roleConst');
        if(roleConst.length===0){
            return interaction.reply('Chưa chọn vai trò');
        }

        const embed = new MessageEmbed();

        embed.setTitle("Chọn vai trò để xóa: ");
        embed.setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);
        embed.setTimestamp(); 
        for(let i=0; i<roleConst.length; i++){
            embed.addField(roles[roleConst[i]], roleConst[i], inline= true);
        }
        
        await interaction.reply('Chờ tí');

        const rows = [];

        for(let i=0; i< roleKey.length/5; i++){
            let row = new MessageActionRow();
            let length = (roleKey.length>(i*5+5))?(i*5+5):roleKey.length;
            for(let j=i*5; j< length;j++){
                row.addComponents(
                    new MessageButton()
                        .setCustomId(roles[roleKey[j]])
                        .setLabel(roles[roleKey[j]].toUpperCase())
                        .setStyle('DANGER')
                        .setEmoji(roleKey[j])
                );
            }
            rows.push(row);
        }

        let message = await interaction.channel.send({ embeds: [embed], components: rows});

        const filter = (i) => {
            return !i.user.bot;
        };

        const collector = message.createMessageComponentCollector({filter, time: 99999});

        collector.on('collect',async (newI) => {
            let emoji = newI.component.emoji.name;
            for(let i=0; i< roleConst.length;i++){
                if(emoji===roleConst[i]){
                    roleConst.splice(i,1);
                    break;
                }
                
            }

            file.set('roleConst', roleConst);
            
            let embedIn = new MessageEmbed();
            embedIn.setTitle("Chọn vai trò để xóa: ");
            embedIn.setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);
            embedIn.setTimestamp(); 
            for(let i=0; i<roleConst.length; i++){
                embedIn.addField(roles[roleConst[i]], roleConst[i], inline= true);
            }
            await newI.reply({content: `Đã xóa ${roles[emoji]} ${emoji}`, ephemeral: true});
            if(roleConst.lenth===0){
                collector.stop();
                return interaction.reply('Chưa chọn vai trò');
            }
            message.edit({embeds:[embedIn]});   
        });

        collector.on('end', (collected,reason) => {
            if(reason==='time'){
                interaction.channel.send('Hết thời gian chọn, vui lòng thực hiện lại lệnh');
            }
        });

    }
};