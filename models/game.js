const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
    guildId: {
        type: String,
        require: true
    },roles:[{
        type: String,
        default:''
    }],time:{
        type: Number,
        default:120
    },players:[{
        type: mongoose.Types.ObjectId,
        ref:'player'
    }],host_channel:{
        type: String
    }, isGameStarted:{
        type:Boolean,
        default: false
    }, day:{
      type: Object,
      default:{
        dayNight: 0,
        index: 1
      }
    }
});

const games = mongoose.model('game', gameSchema);

module.exports = games;