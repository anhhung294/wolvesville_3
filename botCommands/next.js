const guildModel = require('../models/guild.js');
const {dayNight, roles} = require('../config.json');
const embed = require('../utilities/embed.js');

module.exports = {
    name: 'next',
    async execute(msg){
        var guildDB = await guildModel.findOne({guildId: msg.guildId});
        var {day} = guildDB;
        var [dayOrNight, index] = day;
        
        
        switch(dayOrNight){
            case 1:{
                let embedSendDay = await embed('YELLOW', `${dayNight[dayOrNight]} ${index}`,null,null,null,'./data/system/day.jpg');
                return msg.channel.send('ok');
            }case 0:{
                let embedSendNight = await embed('PURPLE', `${dayNight[dayOrNight]} ${index}`,null,null,null,'./data/system/night.jpg');
                
                await msg.channel.send({
                    embeds:[embedSendNight],
                    files:['./data/system/night.jpg']
                });

                index += dayNight;

                dayOrNight = (dayOrNight+1)%2;

                return msg.channel.send('next_turn');
            }
        }
        return;
    }
}