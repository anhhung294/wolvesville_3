const {MessageEmbed} = require('discord.js');
const fs = require('fs');

async function embedSendToUser(member, role){
    const data = await fs.readFileSync(`./roleInfo/${role}.txt`, 'utf-8');
    return new MessageEmbed()
    .setTitle('Your role:')
    .setThumbnail(`attachment://${role}.png`)
    .setColor('BLUE')
    .addField(role.toUpperCase(), data);
}


module.exports={
    name : 'test',
    async execute(msg){
        msg.channel.send({
            embeds: [await embedSendToUser(msg.author, 'werewolf')],
            files: ['./role_images/werewolf.png']
        });
        
    }
}