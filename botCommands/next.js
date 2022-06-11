const guildModel = require('../models/guild.js');
const {dayNight} = require('../config.json');
const embed = require('../utilities/embed.js');

module.exports = {
    name: 'next',
    async execute(msg){
        var guildDB = await guildModel.findOne({guildId: msg.guildId});
        var {day} = guildDB;
        var [dayOrNight, index] = day;
        var mess;
        
        switch(dayOrNight){
            case 1:{
                let embedSendDay = await embed('YELLOW', `${dayNight[dayOrNight]} ${index}`,null,null,null,'./data/system/day.jpg');
                
                await msg.channel.send({
                    embeds:[embedSendDay],
                    files:['./data/system/day.jpg']
                });

                mess = await msg.channel.send({
                    content: 'start_discussion'
                });

                break;
            }case 0:{
                let embedSendNight = await embed('PURPLE', `${dayNight[dayOrNight]} ${index}`,null,null,null,'./data/system/night.jpg');
                
                await msg.channel.send({
                    embeds:[embedSendNight],
                    files:['./data/system/night.jpg']
                });
                 
                mess = await msg.channel.send('next_turn');

                break;
            }
        }
        index += dayOrNight;
        
        dayOrNight = (dayOrNight+1)%2;

        guildDB.day = [dayOrNight, index];

        await guildDB.save();
        
        await mess.delete();

        return;
    }
}