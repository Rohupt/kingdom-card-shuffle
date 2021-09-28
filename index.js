import DiscordJS from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()

import * as helper from "./helper/helper.js"

const original_arr = Array.from(Array(10).keys())

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
})


client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) {
        return
    }

    var attack1 = original_arr
    var defend1 = original_arr

    const { commandName, options } = interaction

    switch (commandName) {
        case 'game-start':
            attack1 = helper.random()
            defend1 = helper.random()
            var attack2 = helper.random()
            var defend2 = helper.random()

            interaction.reply({
                content: `${attack1.join("|")}\n${defend1.join("|")}\n${attack2.join("|")}\n${defend2.join("|")}`,
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