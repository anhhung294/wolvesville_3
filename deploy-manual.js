const deployCommandsGuild = require('./deploy-commands-guild.js');
require('dotenv').config();
const token = process.env.TOKEN;
const { Client, Intents } = require('discord.js');
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS, 
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_BANS
    ],
    partials: [
    "CHANNEL"
    ]
});

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

client.login(token);

const getServerAndDeploy = function(){
    rl.question('Enter the server name which deploy command:', answer =>{
        let findGuild = new Promise((resolve, reject)=>{
            let guild = client.guilds.cache.find(server => server.name===answer);
            if(guild){
                resolve(guild.id);
            }else{
                reject('nothing');
            }
        });
        findGuild
            .then(async guildId => {
                await deployCommandsGuild(guildId);
                process.exit();
            })
            .catch(err => {
                console.log(err);
                getServerAndDeploy();
            });
    });
};

getServerAndDeploy();
        
        







