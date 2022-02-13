const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageEmbed, MessageActionRow, MessageSelectMenu} = require('discord.js');
const sendReactCollector = require('../features/sendReactCollector.js');
const editJsonFile = require("edit-json-file");
const path = require('path');

const data = new SlashCommandBuilder()
	.setName('shoot') 
	.setDescription('Thực hiện chức năng của xạ thủ');
module.exports={
    data: data,
    execute: async function(interaction){
        const guild = interaction.guild;
        const pathJSON = path.normalize(__dirname + `/../data/data-${guild.id}.json`);
        const file = editJsonFile(pathJSON,{
            autosave:true
        });
        const day = file.get('day');
        const perRunId = interaction.user.id;
        const hostChannelId = file.get('host_channel');
        const wolfChannelId = file.get('wolves_channel');
        const hostChannel = await interaction.guild.channels.cache.get(hostChannelId);
        const wolfChannel = await interaction.guild.channels.cache.get(wolfChannelId);
        const gunBullet = file.get('gunBullet');

        var players = file.get('players');
        const playersId = players.map(ele => ele.id);
        const index = playersId.indexOf(perRunId);
        if(players[index].role!=='🔫'){
            return interaction.reply({
                content: 'Bạn không phải xạ thủ để thực hiện chức năng này!',
                ephemeral: true
            });
        }else if(day[0]!==1){
            return interaction.reply({
                content: 'Bạn chỉ có thể dùng chức năng của mình vào ban ngày!',
                ephemeral: true
            });
        }else if(gunBullet<=0){
            return interaction.reply({
                content: 'Bạn đã dùng hết đạn!',
                ephemeral: true
            });
        }
        else{
            const fields = players.map(ele => ele.field);
            const options  = players.map(ele => ele.option);
            const embed = new MessageEmbed();
            embed
            .addFields(fields)
            .setTitle('Chọn người để bắn: ')
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

            const mess = await interaction.reply({embeds: [embed], components:[row], ephemeral: true});

            const filter = i =>{
                return perRunId === i.user.id;
                
            };

            const collector = mess.createMessageComponentCollector({filter, time: 30000});

            collector.on('collect', async (newI)=>{
                let value = newI.values[0];
                let indexDie = playersId.indexOf(value);
                let roleDie = players[indexDie].role;
                if(roleDie==='🐺'){
                    let memberDie = await interaction.guild.members.cache.get(value);
                    for(let i=0; i< players.length; i++){
                        if(memberDie.voice.channel){
                            memberDie.voice.setDeaf(false);
                        }
                        wolfChannel.permissionOverwrites.edit(memberDie, { VIEW_CHANNEL: false, SEND_MESSAGES:false});
                        players.splice(i, 1);
                        break;
                    }
                    file.set('players', players);
                    return sendReactCollector(newI.client, hostChannel, `${memberDie.displayName} đã bị xạ thủ bắn chết`);
                }else{
                    interaction.editReply('Bạn đã bắn trượt');
                }

                file.set('gunBullet', gunBullet-1);
                
                return collector.stop('time');
            });

            collector.on('end', async (collected, reason)=>{
                if(reason==='time'){
                    return mess.delete();
                }
            });
            return;
        }

    }
};