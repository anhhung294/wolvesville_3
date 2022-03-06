const mongoose = require('mongoose');

const werewolfSchema = mongoose.Schema({
    guildId:{
        type: String,
        require: true
    },killPerson:{
        type: String
    },player:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'player'
    }
});

const werewolf = mongoose.model('werewolf', werewolfSchema);


module.exports = werewolf;