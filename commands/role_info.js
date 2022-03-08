const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs= require('fs');
const path = require('path');
const {roles: ViRoles} = require('../config.json');
const pathData = path.normalize(__dirname+'/../roleInfo/');
const files1 = fs.readdirSync(pathData).filter(file => file.endsWith('.txt'));

const data = new SlashCommandBuilder()
.setName('role_info') 
.setDescription('Xem thông tin về chức năng')
.addStringOption(option => option.setName('description').setDescription('Xem mô tả chức năng'));

module.exports = {
	data: data, 
	async execute(interaction) {
        const description = interaction.options.getString('description');
        const search = files1.filter(item => item === description+'.txt');
        if(!description){
            interaction.editReply({
                content:'Vui lòng chọn nội dung cần tìm',
                ephemeral: true
            });
        }
        if(search.length>0){
            fs.readFile(pathData+description+'.txt','utf-8',(err,d)=>{
                const embed = new MessageEmbed()
                   .setTitle(ViRoles[description])
                   .setThumbnail(`attachment://${description}`)
                   .setColor('BLUE')
                   .setDescription(d);
               interaction.editReply({
                   embeds:[embed],
                   files:[`./role_images/${description}.png`],
                   ephemeral: true
               });   
           }); 
        }else{
            interaction.editReply({
                content:'Không tồn tại chức năng này',
                ephemeral: true
            });
        }
        return;
	} 
}; 