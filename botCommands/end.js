module.exports = {
    name: 'end',
    async execute(msg){
        return msg.channel.send('Started');
    }
}