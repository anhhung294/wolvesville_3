const mongoose = require('mongoose');

const villagerSchema = mongoose.Schema({
    playerId:{
        type: String,
        require: true
    },
    guild:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Guild',
        require: true
    }, 
    abilities:[]
});

const villagerModel = new mongoose.model('Villager', villagerSchema);

module.exports = villagerModel;