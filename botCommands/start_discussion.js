const { rolesExecuteAfterNight} = require('../config.json');
const guildModel = require('../models/guild.js');
const wait = require('wait');
const embed = require('../utilities/embed.js');

module.exports = {
    name: 'start_discussion',
    async execute(msg){
        const guildDB = await guildModel.findOne({ guildId: msg.guildId});

        const {timeDiscussion} = guildDB;
        
        for(let role of rolesExecuteAfterNight){
            try{
                let controller = require(`./controllers/${role}.js`);
                await controller(msg);
            }catch(err){
                continue;
            }
        }

        //TODO: add vote

        await wait((timeDiscussion-5)*1000);

        await msg.channel.send({
            embeds:[await embed('RED', '5 seconds left until the end of the discussion',null,null,'./data/system/5seconds.png')],
            files:['./data/system/5seconds.png']
        });

        for(let i=5; i>0; i--){
            await wait(1000);
            await msg.channel.send(`${i-1}`);
        }

        let mess = await msg.channel.send({
            content: 'end_discussion'
        });

        await mess.delete();

        return;
    }
}