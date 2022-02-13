const sendReactCollector = require('../features/sendReactCollector.js');
const editJsonFile = require("edit-json-file");
const path = require('path');

function mode(array)
{
    if(array.length === 0)
        return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++)
    {
        var el = array[i];
        if(modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;  
        if(modeMap[el] > maxCount)
        {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
}

function shuffledCards(array) {
    let [...result] = array;

    for (let i = result.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = result[i];
        result[i] = result[j];
        result[j] = temp;
    }
  
    return result;
}

module.exports={
    name: 'result',
    execute: async function(client, msg){
        const guild = msg.guild;
        const pathJSON = path.normalize(__dirname+`/../data/data-${guild.id}.json`);
        const file = editJsonFile(pathJSON, {
            autosave: true
        });
        const data = file.toObject();
        var {voteDie, players, day, wolves_chatting} = data;
        const dayIndex = day[1];
        const dayOrNight = day[0];
        const diePerId = mode(shuffledCards(voteDie));
        const diePer = await msg.guild.members.cache.get(diePerId);
        const foolId = players.filter(ele => ele.role==='🤡')[0].id;
        const wolfChannel = await msg.guild.channels.cache.get(wolves_chatting); 

        switch(diePer.id){
            case foolId:{
                sendReactCollector(client, msg.channel, `${diePer.displayName} là thằng ngốc do đó đã chiến thắng vì  bị đưa lên dàn`);
                let messEnd = await msg.channel.send('end');
                messEnd.delete();
                break;
            }default:{
                sendReactCollector(client, msg.channel, `${diePer.displayName} đã bị treo cổ chết`);
                for(let i=0; i< players.length; i++){
                    if(players[i].id===diePerId){
                        if(players[i].role==='🐺'){
                            let member = await guild.members.cache.get(players[i].id);
                            if(!member){
                                continue;
                            }
                            if(member.voice.channel){
                                member.voice.setDeaf(false);
                            }
                            wolfChannel.permissionOverwrites.edit(member, { VIEW_CHANNEL: false, SEND_MESSAGES:false});
                        }
                        players.splice(i, 1);
                        break;
                    }
                }
                file.set('day', [(dayOrNight+1)%2,dayIndex+dayOrNight]);
                file.save();
                let messEnd = await msg.channel.send('next');
                return messEnd.delete();
            }
        }
    }
};