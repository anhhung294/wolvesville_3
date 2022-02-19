const {SlashCommandBuilder} = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageSelectMenu} = require('discord.js');
const DB = require('../features/database.js');
const {roles: Roles} = require('../config.json');

const data = new SlashCommandBuilder()
                  .setName('roles')
                  .setDescription('Kiểm tra các chức năng hiện có');
module.exports={
  data: data,
  execute: async function(interaction){
    const guild = interaction.guild;
    const data = await DB('get', guild.id);
    const roles = data.roles;
    var fields =[];
    
    for(let i=0; i< roles.length; i++){
      fields.push({
        name: Roles[roles[i]],
        value: roles[i],
        inline: true
      });
    }

    const embed = new MessageEmbed();
    embed
      .setTitle('Các chức năng hiện có:')
      .setColor('BLUE')
      .setFields(fields)
      .setTimestamp();

    return interaction.reply({
      embeds:[embed],
      ephemeral: true
    });
  }
}