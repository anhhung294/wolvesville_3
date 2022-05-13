const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();
const token = process.env.TOKEN;
const {clientId }= require('./config.json');
const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

module.exports= async (guild) => {
	try {

		console.log('Started refreshing application (/) commands.', guild.id, " ", guild.name);

		await rest.put(
			Routes.applicationGuildCommands(clientId,guild.id),
			{ body: commands }
		);

		console.log('Successfully reloaded application (/) commands.', guild.id, " ", guild.name);
	} catch (error) {
		console.error(error);
	}
};