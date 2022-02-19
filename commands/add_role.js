const {SlashCommandBuilder} = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageSelectMenu} = require('discord.js');
const DB = require('../features/database.js');
const {roles} = require('../config.json');

const data = new SlashCommandBuilder()
                  .setName('add_role')
                  .setDescription('Thêm chức năng');
module.exports={
  data: data,
  execute: async function(interaction){
    const guild = interaction.guild;
    var box =[];
    var fields = [];
    const roleKey = Object.keys(roles);
    var optionsRole = [];
    var numsOptions=[];
    roleKey.forEach(role=>{
      fields.push({
        name: roles[role],
        value: role,
        inline: true
      })
      optionsRole.push({
        label: roles[role],
        value: role
      })
    });
    for(let i=0; i< 10; i++){
      numsOptions.push({
        label: `${i+1}`,
        value: `${i+1}`
      });
    }
    const embedCount = new MessageEmbed();
    embedCount
      .setTitle('Chọn số lượng:')
      .setColor('BLUE')
      .setTimestamp();
    
    const embedRole = new MessageEmbed();
    embedRole
      .setTitle('Chọn chức năng để thêm:')
      .setColor('BLUE')
      .setFields(fields)
      .setTimestamp();
    const rowRole = new MessageActionRow()
    rowRole.addComponents(
      new MessageSelectMenu()
      .addOptions(optionsRole)
      .setCustomId('selectRole')
      .setMaxValues(1)
      .setPlaceholder('Chọn chức năng')
    );
    const rowCount = new MessageActionRow();
    rowCount.addComponents(
      new MessageSelectMenu()
      .addOptions(numsOptions)
      .setCustomId('selectNumber')
      .setMaxValues(1)
      .setPlaceholder('Chọn số lượng')
      );
    let reply = await interaction.reply({
      embeds:[embedRole],
      components: [rowRole],
      fetchReply: true
    });

    const filter = (i) =>{
      return !i.user.bot;
    }

    const collector = reply.createMessageComponentCollector({
      filter,
      componentType: 'SELECT_MENU',
      time: 999999
    });

    collector.on('collect', async (i)=>{
      switch(i.customId){
        case 'selectRole':{
          box.push(i.values[0]);
          interaction.editReply({
            embeds: [embedCount],
            components:[rowCount],
            fetchReply: true
          });
          break;
        }case 'selectNumber':{
          let role = box.pop();
          let count = new Number(i.values[0]);
          let roleAdd = [];
          for(let j=0; j< count; j++){
            roleAdd.push(role);
          }
          await DB('update', guild.id, {
            $push:{roles:roleAdd}
          });
          interaction.editReply({
            embeds:[embedRole],
            components: [rowRole],
            fetchReply: true
          });
          break;
        }
      }
    })
    
  }
}