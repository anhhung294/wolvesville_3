const {MessageEmbed, MessageActionRow, MessageSelectMenu} = require('discord.js');
const {roles} = require('../../config.json');
const editJsonFile = require("edit-json-file");
const path = require('path');

module.exports={
    name: 'multiple',
    execute: async function(interaction){
        var fields = [];
        const guild = interaction.guild;
        const pathJSON = path.normalize(__dirname + `/../../data/data-${guild.id}.json`);
        const file = editJsonFile(pathJSON, {
            autosave:true
        });

        
        Object.keys(roles).forEach( (key) => {
            fields.push({
                label:`${roles[key]} ${key}`,
                name: roles[key], 
                value: key,
                inline:true
            });
        });

        const embed = new MessageEmbed();

        embed.setTitle("Chọn vai trò: ");
        embed.setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);
        embed.setTimestamp(); 
        embed.addFields(fields);

        const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('select')
                    .setMinValues(2)
					.setPlaceholder('Nothing selected')
					.addOptions(fields)
			);
        let message = await interaction.channel.send({embeds: [embed], components: [row]});
        
        const filter = (i) => {
            return !i.user.bot;
        };
        
        const collector = message.createMessageComponentCollector({filter, componentType: 'SELECT_MENU', time: 99999 });
        
        collector.on('collect',async (i) => {
            i.values.forEach(value =>{
                file.append('roleConst', value);
            });

            try{
                i.reply(`Added ${i.values}`);
            }catch(err){
                i.editReply(`Added ${i.values}`);
            }

            message.edit({embeds: [embed], components: [row]});
        });

        collector.on('end', (collected,reason) => {
            if(reason==='time'){
                interaction.channel.send('Hết thời gian chọn, vui lòng thực hiện lại lệnh');
            }
        });
       
    }
}