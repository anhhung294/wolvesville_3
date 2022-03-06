const mongoose = require('mongoose');

const bodyguardSchema = mongoose.Schema({
    guildId:{
        type: String,
        require: true
    },
    attackAgain: {
        type: Boolean,
        default: false
    },shield:{
        type: String
    },player:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'player'
    }
});

const bodyguard = mongoose.model('bodyguard', bodyguardSchema);

module.exports = bodyguard;