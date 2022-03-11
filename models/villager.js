const mongoose = require('mongoose');


const villagerSchema = mongoose.Schema({
    guildId: {
        type: String,
        require: true
    },playerId:{
      type:String,
      require: true
    },
    player:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'player'
    }
});

const villager = mongoose.model('villager', villagerSchema);

module.exports = villager;