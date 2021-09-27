const Discord = require('discord.js');
require('dotenv').config();

var playroom1 = [0, 1, 2, 3]
var playroom2 = [0, 1, 2, 3]

const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
    ],
})

client.on('ready', () => {
    console.log("ready!!!")
})

function pop_card(playroom) {
    playroom.pop()
}

client.on('messageCreate', (message) => {
    if (message.content === 'bắt đầu chơi') {
        playroom1 = [0, 1, 2, 3]
        playroom2 = [0, 1, 2, 3]
        message.reply({
            content: playroom1.join() + "---" + playroom2.join()
        })
    }

    if (message.content === 'ping') {
        message.reply({
            content: playroom1.join()
        })
    }
    if (message.content === 'rút bài') {
        if (message.channel.id === '892081081182994432') {
            pop_card(playroom1)
        } else {
            pop_card(playroom2)
        }
        message.reply({
            content: playroom1.join() + "---" + playroom2.join()
        })
    }
    if (message.content === 'channel') {
        message.reply({
            content: message.channel.id
        })
    }
})

client.login(process.env.TOKEN)