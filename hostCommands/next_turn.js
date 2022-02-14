const { roles } = require('../config.json');
const editJsonFile = require("edit-json-file");
const path = require('path');
const sendReactCollector = require('../features/sendReactCollector.js');

module.exports={
    name: 'next_turn',
    execute:async function (client, msg){
        const indexK = Object.keys(roles);
        const guild = msg.guild;
        const pathJSON = path.normalize(__dirname+`/../data/data-${guild.id}.json`);
        const file = editJsonFile(pathJSON, {
            autosave: true
        });
        const day = await file.get('day');
        const dayIndex = day[1];
        const dayOrNight = day[0];
        const roleConst = file.get('roleConst');
        const preIndex = indexK.indexOf(msg.content.split(/ +/)[1]);
        const villagerIndex = indexK.indexOf('👲');
        var nextIndex = preIndex+1;
        while(nextIndex<villagerIndex){
            if(roleConst.includes(indexK[nextIndex])){
                let mess = await msg.channel.send(`${indexK[nextIndex]}_turn`);
                sendReactCollector(client, msg.channel, `Tới lượt của ${roles[indexK[nextIndex]]}`);
                return mess.delete();
            }
            nextIndex++;
        }
        file.set('day', [(dayOrNight+1)%2,dayIndex+dayOrNight]);

        file.save();

        let messNext = await msg.channel.send('next');
        return messNext.delete();
    }
};