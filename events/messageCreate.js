const guildModel = require('../models/guild.js');
const fs = require('fs');
const commands = new Map();
const botCommands = new Map();

const commandFiles = fs.readdirSync('./messageCommands').filter(file => file.endsWith('.js'));
const botCommandFiles = fs.readdirSync('./botCommands').filter(file => file.endsWith('.js'));

for(let file of commandFiles){
    let command = require(`../messageCommands/${file}`);
    commands.set(command.name, command);
}

for(let file of botCommandFiles){
    let command = require(`../botCommands/${file}`);
    botCommands.set(command.name, command);
}


module.exports = {
	name: 'messageCreate',
	async execute(msg) {
		const guildDB = await guildModel.findOne({guildId: msg.guild.id});
        
        if(!guildDB){
            const newGuildDB = new guildModel({
                guildId: msg.guild.id
            });

            await newGuildDB.save();

            return msg.channel.send('Hãy thử lại 1 lần nữa');
        }

        if(msg.client.user.id===msg.author.id){
            let command = botCommands.get(msg.content);
            return command?.execute(msg);
        }

        const prefix = guildDB.prefix;

        const check = msg.content.slice(0, prefix.length);
        
        if(check!==prefix) return;
        
        const args = msg.content.slice(prefix.length).split(/\s+/);

        const command = args.shift();

        try {
            const commandController = commands.get(command);
            return commandController.execute(msg);
        } catch (error) {
            console.error(error);
            await msg.channel.send({ content: 'There was an error while executing this command!'});
        }
	},
};

