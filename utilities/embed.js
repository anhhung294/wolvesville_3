const {MessageEmbed} = require('discord.js');
const {getAverageColor} = require('fast-average-color-node');

module.exports = async function(color = 'BLUE', title, description, fields, thumbnail, image){
    var embed = new MessageEmbed().setColor(color).setTimestamp();

    if(title&&typeof(title)==='string'){
        embed.setTitle(title);
    }

    if(description&&typeof(description)==='string'){
        embed.setDescription(description);
    }

    if(fields&&fields?.length>0&&Array.isArray(fields)&&fields.map(f => f.name).length===fields.map(f => f.value).length){
        embed.setFields(...fields);
    }

    if(image&&typeof(image)==='string'){
        embed.setImage(`attachment://${image}.png`);
        let colorN = await getAverageColor(`./role_images/${image}.png`);
        embed.setColor(colorN.hex);
    }

    if(thumbnail&&typeof(thumbnail)==='string'){
        embed.setThumbnail(`attachment://${thumbnail}.png`);
        let colorN = await getAverageColor(`./role_images/${thumbnail}.png`);
        embed.setColor(colorN.hex);
    }

    return embed;


}