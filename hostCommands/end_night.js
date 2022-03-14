const gameModel = require('../models/game.js');
const werewolfModel = require('../models/werewolf.js');
const bodyguardModel = require('../models/bodyguard.js');
const playerModel = require('../models/player.js');
const fs = require('fs');
const path = require('path');
const pathRoleController = path.normalize(__dirname+'/../rolesController/');
const files = fs.readdirSync(pathRoleController).filter(file => file.endsWith('.js'));
const rolesModel = new Map();
const {MessageEmbed} = require('discord.js');


for(let file of files){
    let File = require(`../models/${file}`);
    rolesModel.set(file.slice(0, file.length-3), File);
}


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
    name: 'end_night',
    execute: async function(client, msg){
        try{
            const game = await gameModel.findOne({
                guildId: msg.guild.id
            }).populate('players');
    
            const werewolves = await werewolfModel.find({
                guildId: msg.guild.id
            }).populate('player');
    
            const bodyguard = await bodyguardModel.findOne({
                guildId: msg.guild.id
            });
    
            const diePeopleId = werewolves.map(werewolf => werewolf.killPerson);
    
            const diePersonId = mode(diePeopleId);
    
            const diePersonDB = await playerModel.findOne({
                guildId: msg.guild.id,
                playerId: diePersonId
            });
    
            const dieMember = await msg.guild.members.cache.get(diePersonId);
    
            if(bodyguard){
                if(bodyguard.shield===diePersonId){
                    await bodyguardModel.findOneAndUpdate({
                        guildId: msg.guild.id
                    }, {
                        attackAgain: true
                    });
                }
            }else{
                await gameModel.findOneAndUpdate({
                    guildId: msg.guild.id
                },{
                    $pull:{ players:diePersonDB._id}
                });
    
                let roleModel = await rolesModel.get(diePersonDB.role);
    
                await roleModel.findOneAndRemove({
                    guildId: msg.guild.id,
                    playerId: diePersonId
                });
    
                await playerModel.findOneAndRemove({
                    guildId: msg.guild.id,
                    playerId: diePersonId
                });
    
                let avaURL = dieMember.displayAvatarURL();

                console.log(avaURL);
    
                const embed = new MessageEmbed()
                .setTitle(`${dieMember.displayName} đã bị sói giết`)
                .setImage(avaURL)
                .setTimestamp()
                .setColor('RED');
    
                await msg.channel.send({
                    embeds:[embed]
                });
            }
    
            let mess = await msg.channel.send('next');
    
            return mess.delete();
        }catch(err){
            console.log(err);
        }
    }
};