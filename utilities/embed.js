const {MessageEmbed} = require('discord.js');
const {getAverageColor} = require('fast-average-color-node');

module.exports = async function(color = 'BLUE', title=null, description=null, fields, thumbnailLink=null, imageLink=null){
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

    if(imageLink&&typeof(imageLink)==='string'){
        let image = imageLink.split('/').pop();
        embed.setImage(`attachment://${image}`);
        let colorN = await getAverageColor(`${imageLink}`);
        embed.setColor(colorN.hex);
    }

    if(thumbnailLink&&typeof(thumbnailLink)==='string'){
        let thumbnail = thumbnailLink.split('/').pop();
        embed.setThumbnail(`attachment://${thumbnail}`);
        let colorN = await getAverageColor(`${thumbnailLink}`);
        embed.setColor(colorN.hex);
    }

    return embed;
}