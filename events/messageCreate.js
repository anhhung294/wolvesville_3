const fs = require('fs');
const {clientId} = require('../config.json');
const path = require('path');
const pathFolder = path.normalize(__dirname+'/../hostCommands');
const files1 = fs.readdirSync(pathFolder).filter(file => file.endsWith('.js'));
const hostCommands = new Map();
for(let file of files1){
    let command = require(`../hostCommands/${file}`);
    hostCommands.set(command.name, command);
}

module.exports = {
	name: 'messageCreate',
	async execute(msg) {
        let command = msg.content.trim().toLowerCase().split(/ +/).shift();
        
        if(msg.author.id!==clientId) return;
        
        if(hostCommands.has(command)){
            hostCommands.get(command).execute(msg.client, msg);
        }
        return;
	},
};