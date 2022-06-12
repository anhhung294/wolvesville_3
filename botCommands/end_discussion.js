const guidModel = require('../models/guild.js');


module.exports={
    name:'end_discussion',
    async execute(msg){
        const playerVoted = msg.content.split(/\s+/).pop();
    }
}