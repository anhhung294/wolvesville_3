const gameModel = require('../models/game.js');
const fs = require('fs');
const path = require('path');
const {roles: rolesSys} = require('../config.json');
const pathRoleController = path.normalize(__dirname+'/../rolesController/');
const files = fs.readdirSync(pathRoleController).filter(file => file.endsWith('js'));
const mapController = new Map();

for(let file of files){
    let File = require(`../rolesController/${file}`);
    mapController.set(file, File);
}

function checkRole(roles, role){
  return roles.includes(role);
}

module.exports={
    name: 'next_turn',
    execute: async function(client, msg){
       try{
        const game = await gameModel.findOne({
            guildId: msg.guildId
        }).populate('players');

        const arrRolesSys = Object.keys(rolesSys);

        const roles = game.roles;
        
        const preRole = msg.content.split(/ +/)[1];

        const preIndex = arrRolesSys.indexOf(preRole);

        var nextRoleIndex = preIndex+1;

        while(!checkRole(roles, arrRolesSys[nextRoleIndex])){
          if(arrRolesSys[nextRoleIndex]!=='villager'){
            nextRoleIndex++;
          }else{
            break;
          }
        }

        const nextRole = arrRolesSys[nextRoleIndex];

        const roleController = mapController.get(nextRole+'.js');

        if(!roleController){
          let mess = await msg.channel.send('end_night');
          return mess.delete();
        }

        return roleController(msg);
        
       }catch(err){
            console.log(err);
        }
    }
};