const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const files1 = fs.readdirSync('./roleInfo').filter(file => file.endsWith('.txt'));

module.exports ={
    async execute(interaction, args){
        args.forEach(async arg =>{
            if(!files1.includes(arg+'.txt')){
                return interaction.channel.send({
                    content:`This role (${arg}) doesn't exist`,
                });
            }
            return fs.readFile('./roleInfo/'+arg+'.txt','utf-8',(err,d)=>{
                const embed = new MessageEmbed()
                   .setTitle(arg)
                   .setThumbnail(`attachment://${arg}.png`)
                   .setColor('BLUE')
                   .setDescription(d);
                return interaction.channel.send({
                   embeds:[embed],
                   files:[`./role_images/${arg}.png`]
               });   
            }); 
        })
    }
}