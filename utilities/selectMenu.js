const {MessageSelectMenu} = require('discord.js');

module.exports = function(id = 'select', options, placeHolder, maxValues){
    if(!id) return;
    var selectMenu =  new MessageSelectMenu().setCustomId(id);
    
    if(options&&options?.length>0&&Array.isArray(options)&&options?.map(o => o.label).length===options?.map(o => o.value).length){
        selectMenu.addOptions(options);
    } 
    if(placeHolder){
        selectMenu.setPlaceholder(placeHolder);
    }
    if(maxValues&&Number.isInteger(maxValues)){
        selectMenu.setMaxValues(maxValues);
    }

    return selectMenu;
}