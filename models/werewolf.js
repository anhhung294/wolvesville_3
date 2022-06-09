const mongoose = require('mongoose');

var werewolfSchema = new mongoose.Schema({
    playerId:{
        type: String,
        require: true
    },
    guild:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Guild',
        require: true
    }
});

module.exports = new mongoose.model('Werewolf', werewolfSchema);