module.exports = {
    name: 'start',
    async execute(msg){
        return msg.channel.send('Started');
    }
}