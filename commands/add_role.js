const { SlashCommandBuilder } = require('@discordjs/builders');
const fs= require('fs');
const path = require('path');
const {roles: ViRoles} = require('../config.json');
const gameModel = require('../models/game.js');

const files1 = fs.readdirSync(path.normalize(__dirname+'/../roleInfo/')).filter(file => file.endsWith('.txt'));

const data = new SlashCommandBuilder()
.setName('add_role') 
.setDescription('Thêm chức năng');
files1.forEach(file=>{
  let name = file.slice(0, file.length-4);
  data.addIntegerOption(option => option.setName(name).setDescription('Chọn chức năng kèm số lượng'));
});

module.exports = {
	data: data, 
	async execute(interaction) {
    const options = interaction.options._hoistedOptions;
    const obj = await gameModel.findOne({
      guildId: interaction.guild.id
    });
    if(!obj){
      const role = new gameModel({
        guildId: interaction.guild.id,
      });
      await role.save();
    }
    if(obj.isGameStarted){
      return interaction.reply({
        content:'Trò chơi đang bắt đầu tại máy chủ này',
        ephemeral: true
      });
    }
    if(obj.roles.length+options.length>25||options.length>25){
      return interaction.reply({
        content:'Hiện tại chỉ cho phép tối đa 25 người chơi'
      });
    }
    options.forEach(async (item)=>{
      let value = item.value;
      let name = item.name;
      for(let i=0; i< value; i++){
        await gameModel.findOneAndUpdate({
          guildId: interaction.guild.id
        },{
          $push:{roles: name}
        });
      }
    });
    interaction.reply(`Đã thêm ${options.map(item => ' '+item.value+ ' '+ ViRoles[item.name])}`);
	} 
}; 