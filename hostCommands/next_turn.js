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

module.exports={
    name: 'next_turn',
    execute: async function(client, msg){
        const game = await gameModel.findOne({
            guildId: msg.guildId
        }).populate('players');

        const arrRolesSys = Object.keys(rolesSys);

        const roles = game.roles;
        
        const preRole = msg.content.split(/ +/)[1];

        const rolesTable = arrRolesSys.filter(role => roles.includes(role));
        
        const firstRole = rolesTable[0];

        if(!preRole){
            let firstRoleController = await mapController.get(firstRole+'.js');

            return firstRoleController(msg);
        }
        
        const preIndex = rolesTable.indexOf(preRole);

        const roleController = await mapController.get(rolesTable[(preIndex+1)%rolesTable.length]+'.js');

        roleController(msg);
    }
};