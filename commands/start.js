const { SlashCommandBuilder } = require('@discordjs/builders');
const gameModel = require('../models/game.js'); 
const playerModel =  require('../models/player.js');
const data = new SlashCommandBuilder()
	.setName('start')
	.setDescription('Bắt đầu ván mới');
module.exports={
    data: data,
    execute: async function(interaction){
        const memberHost = interaction.member;
        const guild = interaction.guild;

        const game = await gameModel.findOne({
            guildId:guild.id
        });

        var roleConst= game?game.roles:[];

        if(roleConst.length<=0) return interaction.reply('Chưa chọn chức năng');

        const hostChannelId = game.host_channel;

        if(interaction.channelId.toString()!==hostChannelId) return interaction.reply({content:'Vui lòng bắt đầu ở kênh chính', ephemeral: true});

        if(!memberHost.voice.channel) return interaction.reply('Chưa kết nối kênh đàm thoại');

        const voiceChannel = memberHost.voice.channel;
        const [...arrMembers] = voiceChannel.members.values();
        const membersCount = arrMembers.length;

        if(membersCount>roleConst.length) return interaction.reply('Quá số lượng người chơi cho phép');
        else if(membersCount<roleConst.length) return interaction.reply('Không đủ người chơi');

        console.log(arrMembers);

        arrMembers.forEach(async (member)=>{
            let {...userObj} = member.user;
            let player = new playerModel({
                guildId: guild.id,
                user: userObj
            });
            let savedPlayer = await player.save();
            await gameModel.findOneAndUpdate({
                guildId:guild.id
            },{
                $push:{players: savedPlayer._id}
            });
        });

        const newGame = await gameModel.findOne({
            guildId: guild.id
        }).populate('players');

        console.log(newGame.players);
    }
};