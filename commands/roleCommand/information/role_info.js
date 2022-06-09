const embed = require('../../../utilities/embed.js');
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
            let data =  fs.readFileSync('./roleInfo/'+arg+'.txt','utf-8'); 
            const embedSend = await embed(null, arg, data, null, arg);
                return interaction.editReply({
                   embeds:[embedSend],
                   files:[`./role_images/${arg}.png`],
                   content:"---------------------------------------------"
               });   
        })
    }
}