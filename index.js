import DiscordJS from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()

import * as helper from "./helper/helper.js"

var deck_size = 32
var channel1 = '892081081182994432'
var channel2 = '892097703528505355'
var channel3 = ''

var atk, def, arr
var draw_atk, draw_def

var attack1 = helper.random()
var defend1 = helper.random()
var attack2 = helper.random()
var defend2 = helper.random()
var attack3 = helper.random()
var defend3 = helper.random()

function get_arr(channelID) {
    if (channelID === channel1) {
        return {
            atk: attack1,
            def: defend1
        }
    }
    if (channelID === channel2) {
        return {
            atk: attack2,
            def: defend2
        }
    }
    if (channelID === channel3) {
        return [attack3, defend3]
    }
}

function assign_arr(channelID, atk, def) {
    if (channelID === channel1) {
        attack1 = atk
        defend1 = def
    }
    if (channelID === channel2) {
        attack2 = atk
        defend2 = def
    }
    if (channelID === channel3) {
        return [attack3, defend3]
    }
}

const client = new DiscordJS.Client({
    intents: [
        DiscordJS.Intents.FLAGS.GUILDS,
        DiscordJS.Intents.FLAGS.GUILD_MESSAGES,
    ],
})

client.on('ready', () => {
    console.log("ready!!!")

    const guideId = '884098897377636452'
    const guild = client.guilds.cache.get(guideId)
    let commands

    if (guild) {
        commands = guild.commands
    } else {
        commands = client.application?.commands
    }

    commands?.create({
        name: 'add',
        description: 'add two numbers',
        options: [
            {
                name: 'num1',
                description: 'first number',
                required: true,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
            },
            {
                name: 'num2',
                description: 'second number',
                required: false,
                type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
            },
        ]
    })

    commands?.create({
        name: 'game-start',
        description: 'Bắt đầu lượt chơi mới'
    })

    commands?.create({
        name: 'attack-draw',
        description: 'Bên tấn công rút bài'
    })

    commands?.create({
        name: 'defend-draw',
        description: 'Bên phòng thủ rút bài'
    })

    commands?.create({
        name: 'attack-shuffle',
        description: 'Bên tấn công tráo bài'
    })

    commands?.create({
        name: 'defend-shuffle',
        description: 'Bên phòng thủ tráo bài'
    })

    commands?.create({
        name: 'show-card',
        description: 'Xem bài cả 2 bên'
    })
})


client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) {
        return
    }

    const { commandName, options } = interaction
    arr = get_arr(interaction.channel.id)
    atk = arr.atk
    def = arr.def


    switch (commandName) {
        case 'game-start':

            atk = helper.random()
            def = helper.random()

            draw_atk = atk.slice(atk.length - 5, atk.length)
            draw_def = def.slice(def.length - 5, def.length)
            atk = atk.slice(1, atk.length - 5 + 1)
            def = def.slice(1, def.length - 5 + 1)
            assign_arr(interaction.channel.id, atk, def)

            interaction.reply({
                content: `
                draw atk: [${draw_atk.join('] [')}]\natk: [${atk.join('] [')}]\n 
                draw def: [${draw_def.join('] [')}]\n def: [${def.join('] [')}]
                `,
            })

            break;
        case 'show-card':
            interaction.reply({
                content: `atk: [${atk.join('] [')}]\ndef: [${def.join('] [')}]`,
            })

            break;
        case 'attack-draw':
            if (atk.length == 0) {
                interaction.reply({
                    content: `Hết bài, bên phòng thủ chiến thắng!`,
                })
                break;
            }

            draw_atk = atk.at(-1)
            atk.pop()
            assign_arr(interaction.channel.id, atk, def)

            interaction.reply({
                content: `
                draw atk: [${draw_atk}]\natk: [${atk.join('] [')}]\n 
                def: [${def.join('] [')}]
                `,
            })

            break;
        case 'defend-draw':
            if (def.length == 0) {
                interaction.reply({
                    content: `Hết bài, bên tấn công chiến thắng!`,
                })
                break;
            }

            draw_def = def.at(-1)
            def.pop()
            assign_arr(interaction.channel.id, atk, def)

            interaction.reply({
                content: `
                    atk: [${atk.join('] [')}]\n 
                    draw def: [${draw_def}]\n def: [${def.join('] [')}]
                    `,
            })

            break;
        case 'add':
            const num1 = options.getNumber('num1') || 0
            const num2 = options.getNumber('num2') || 0

            interaction.reply({
                content: `+${num1 + num2} SSR :one:`,
                // ephemeral: true,
            })
            break;
    }

})
client.login(process.env.TOKEN)