const {roles} = require('../config.json');
const fs = require('fs');
const controllers = new Map();
const guildModel = require('../models/guild.js');
const controllerFiles = fs.readdirSync('./controllers').filter(f => f.endsWith('.js'));

for(let file of controllerFiles){
    let controller = require(`../controllers/${file}`);
    controllers.set(controller.name, controller);
}


module.exports ={
    name: 'next_turn',
    async execute(msg){
        const nowRole = msg.content.split(/\s+/)[1];
        const nowIndex = roles.indexOf(nowRole);
        const guildDB = await guildModel.findOne({guildId: msg.guildId});
        const nextRole = roles[nowIndex+1];

        if(nowIndex===(roles.length-1)||!guildDB.roles.includes(nextRole)){
            let mess = await msg.channel.send('next');
            await mess.delete();
            return;
        }

        const controller = await controllers.get(nextRole);

        if(!controller) return msg.channel.send('The game has an error! Please report to admin!');

        return controller.execute(msg.guild, msg.channel);
    }
}