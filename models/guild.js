const mongoose = require('mongoose');

var guildSchema = new mongoose.Schema({
    guildId: {
        type: String,
        require: true
    },
    timeDiscussion: {
        type: Number,
        default: 120
    },
    index: {
        type: Number,
        default: 1
    },
    player:[String],  //id-role
    roles:[String],
    prefix: {
        type: String,
        default: 'ms'
    },
    host_channel: String,
    isGameStarted: {
        type: Boolean,
        default: false
    },
    day:{
        type: [Number],
        default:[0,1]
    }
});

const guildModel = new mongoose.model('Guild', guildSchema);

module.exports = guildModel;