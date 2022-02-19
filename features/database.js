const mongoose = require('mongoose');
require('dotenv').config();
const urlDB = process.env.urlDB;

mongoose.connect(urlDB).then(()=> console.log('Connected to database!')).catch(err => console.log(err));

const boardComponentsSchema = new mongoose.Schema({
  serverId: String,
  serverName: String,
  host_channelId: String,
  wolves_channelId: String,
  chatting_channelId:String,
  roles: [String]
})

const boardComponent = new mongoose.model('wolvesville_datas', boardComponentsSchema);

module.exports = async function(command, guildId , updateObject){
  const filter = {
    serverId: guildId
  };
  const cmd = command.toLowerCase();

  const updateData = updateObject;

  try{
      switch(cmd){
        case 'get':{
          let data = await boardComponent.findOne(filter);
          return data;
        }case 'save':{
          let component = new boardComponent(updateData);
          return component.save();
        }case 'update':{
          return boardComponent.findOneAndUpdate(filter, updateData);
        }
    }
  }catch(err){
    console.log(err);
  }
}



