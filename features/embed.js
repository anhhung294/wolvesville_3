const {MessageEmbed} = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = function(title, color='BLUE', description,imageLink){
  const embed = new MessageEmbed()
  .setTitle(title)
  .setTimestamp()
  .setColor(color);
  if(imageLink){
    embed.setImage(`attachment://${path.basename(imageLink)}`);
  }
  if(description){
    embed.setDescription(description);
  }
  return embed;
};
