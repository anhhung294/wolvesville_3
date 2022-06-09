const {roles} = require('../config.json');



module.exports ={
    name: 'next_turn',
    async execute(msg){
        const nowRole = msg.content.split(/\s+/)[1];
        const nowIndex = roles.indexOf(nowRole);
        if(nowIndex===-1||nowIndex===(roles.length-1)) return msg.channel.send('next');
    }
}