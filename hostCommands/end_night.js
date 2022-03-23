const fs = require('fs');
const path = require('path');
const pathRoleController = path.normalize(__dirname+'/../rolesController/');
const files = fs.readdirSync(pathRoleController).filter(file => file.endsWith('.js'));
const roleControllers = new Map();
const roles = Object.keys(require('../config.json').roles);
const gameModel = require('../models/game.js');

for(let file of files){
    let File = require(`../rolesController/${file}`);
    roleControllers.set(file.slice(0, file.length-3), File);
}


module.exports={
    name: 'end_night',
    execute: async function(client, msg){
        try{
            const game = await gameModel.findOne({
                guildId: msg.guild.id
            });

            const rolesInGame = game.roles;

            rolesInGame.sort((a,b)=>{
                return roles.indexOf(a)-roles.indexOf(b);
            });


        }catch(err){
            console.log(err);
        }
    }
};