const sendReactCollector = require('../features/sendReactCollector.js');
const {dayNight, roles, protectReason, dieReason} = require('../config.json');
const editJsonFile = require("edit-json-file");
const path = require('path');


function mode(array)
{
    if(array.length == 0)
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

module.exports={
    name: 'next',
    execute: async function (client, msg){
        const guild = msg.guild;
        const pathJSON = path.normalize(__dirname+`/../data/data-${guild.id}.json`);
        const file = editJsonFile(pathJSON, {
            autosave: true
        });
        var players = file.get('players');
        const playersId = players.map(ele => ele.id);
        const roleConst = file.get('roleConst');
        const day = file.get('day');
        const dayOrNight = day[0];
        const dayIndex = day[1];
        const roleKey = Object.keys(roles);

        sendReactCollector(client, msg.channel, `${dayNight[dayOrNight]} ${dayIndex}`);

        switch(dayOrNight){
            case 0: {
                playersId.forEach(async function(id){
                    let member = await guild.members.cache.get(id);
                    member.voice.setDeaf(true);
                });
                
                for(let i=0; i< roleKey.length;i++){
                    if(roleConst.includes(roleKey[i])){
                        let message = await msg.channel.send(`${roleKey[i]}_turn`);
                        message.delete();
                        break;
                    }
                }
                
                break;
            }case 1:{
                playersId.forEach(async function(id){
                    let member = await guild.members.cache.get(id);
                    member.voice.setDeaf(false);
                });

                const data = file.toObject();
                const {die, mustDie, shield, heal, timer} = data;

                const diePer = await msg.guild.members.cache.get(die[0]);
                const mustDiePer = await msg.guild.members.cache.get(mustDie[0]);
                const shieldPer = await msg.guild.members.cache.get(shield[0]);
                const healPer = await msg.guild.members.cache.get(heal[0]);

                if(mustDiePer){
                    for(let i=0; i< players.length; i++){
                        if(players[i].id===mustDie[0]){
                            players.splice(i, 1);
                            sendReactCollector(client, msg.channel, `${mustDiePer.displayName} ${dieReason[witchKill]}`);
                            file.set('mustDie', []);
                            break;
                        }
                    }
                }
                if(diePer!==shieldPer&&diePer!==mustDiePer){
                    for(let i=0; i< players.length; i++){
                        if(players[i].id===die[0]){
                            players.splice(i, 1);
                            sendReactCollector(client, msg.channel, `${diePer.displayName} ${dieReason[wolfKill]}`);
                            break;
                        }
                    }
                }

                if(shieldPer===diePer){
                    sendReactCollector(client, msg.channel, `${diePer.displayName} ${protectReason[shield]}`);
                }else if(healPer){
                    sendReactCollector(client, msg.channel, `${diePer.displayName} ${protectReason[heal]}`);
                }

                const fields = players.map(ele => ele.field);

                await sendReactCollector(client, msg.channel, `Time to argue!`);

                await sendReactCollector(client, msg.channel, `Villagers: `, fields);

                file.set('players', players);
                file.set('die', []);
                file.set('voteDie', []);

                
                setTimeout(()=>{
                    sendReactCollector(client, msg.channel, `10 seconds left`);
                    setTimeout(()=>{
                        msg.channel.send('vote_time');
                    },10000);
                },timer*1000-10000);
                break;
            }
        }
    }
};