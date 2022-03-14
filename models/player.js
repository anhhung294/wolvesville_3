const { User } = require('discord.js');
const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
    guildId: {
        type: String,
        require: true
    },playerId:{
      type:String,
      require: true
    },role:{
        type:String,
        require: true
    },
    user: {
        type:Object,
        require: true
    }
});

const player = mongoose.model('player', playerSchema);

module.exports = player;