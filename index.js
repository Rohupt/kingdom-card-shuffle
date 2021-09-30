import DiscordJS from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()

import * as helper from "./helper/helper.js"

var deck_size = helper.deck_size
var channel1 = '892081081182994432'
var channel2 = '892097703528505355'
var channel3 = '891527609094135829'

var number
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
        return {
            atk: attack3,
            def: defend3
        }
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
        attack3 = atk
        defend3 = def
    }
}
try {
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
            name: 'attack-drawbottom',
            description: 'Bên tấn công rút lá bài ở cuối bộ bài'
        })

        commands?.create({
            name: 'defend-drawbottom',
            description: 'Bên phòng thủ rút lá bài ở cuối bộ bài'
        })

        commands?.create({
            name: 'attack-insert',
            description: 'Bên tấn công nhét 1 lá bài vào bộ bài',
            options: [
                {
                    name: 'number',
                    description: 'số của lá bài',
                    required: true,
                    type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
                },
            ]
        })

        commands?.create({
            name: 'defend-insert',
            description: 'Bên phòng thủ nhét 1 lá bài vào bộ bài',
            options: [
                {
                    name: 'number',
                    description: 'số của lá bài',
                    required: true,
                    type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
                },
            ]
        })

        // commands?.create({
        //     name: 'show-card',
        //     description: 'Xem bài cả 2 bên'
        // })
    })



    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand()) {
            return
        }

        const { commandName, options } = interaction
        let arr = get_arr(interaction.channel.id)
        let atk = arr.atk
        let def = arr.def


        switch (commandName) {
            case 'game-start':

                atk = helper.random()
                def = helper.random()
                console.log(atk)

                draw_atk = atk.slice(atk.length - 5, atk.length)
                draw_def = def.slice(def.length - 5, def.length)
                atk = atk.slice(0, atk.length - 5)
                def = def.slice(0, def.length - 5)
                assign_arr(interaction.channel.id, atk, def)

                // interaction.reply({
                //     content: `
                //     draw atk: [${draw_atk.join('] [')}]\natk: [${atk.join('] [')}]\n 
                //     draw def: [${draw_def.join('] [')}]\n def: [${def.join('] [')}]
                //     `,
                // })
                interaction.reply({
                    content: `Bốc bài!\n` +
                        `Bên tấn công: [${draw_atk.join('] [')}]\n` +
                        `Bên phòng thủ: [${draw_def.join('] [')}]`,
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

                // interaction.reply({
                //     content: `
                //     draw atk: [${draw_atk}]\natk: [${atk.join('] [')}]\n 
                //     def: [${def.join('] [')}]
                //     `,
                // })
                interaction.reply({
                    content: `[${draw_atk}]\nBên tấn công rút bài`,
                })

                break;

            case 'attack-drawbottom':
                if (atk.length == 0) {
                    interaction.reply({
                        content: `Hết bài, bên phòng thủ chiến thắng!`,
                    })
                    break;
                }

                draw_atk = atk.shift()
                assign_arr(interaction.channel.id, atk, def)

                // interaction.reply({
                //     content: `
                //         draw atk: [${draw_atk}]\natk: [${atk.join('] [')}]\n 
                //         def: [${def.join('] [')}]
                //         `,
                // })
                interaction.reply({
                    content: `[${draw_atk}]\nBên tấn công rút bài`,
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

                // interaction.reply({
                //     content: `
                //         atk: [${atk.join('] [')}]\n 
                //         draw def: [${draw_def}]\n def: [${def.join('] [')}]
                //         `,
                // })
                interaction.reply({
                    content: `[${draw_def}]\nBên phòng thủ rút bài`,
                })

                break;

            case 'defend-drawbottom':
                if (def.length == 0) {
                    interaction.reply({
                        content: `Hết bài, bên tấn công chiến thắng!`,
                    })
                    break;
                }

                draw_def = def.shift()
                assign_arr(interaction.channel.id, atk, def)

                // interaction.reply({
                //     content: `
                //             atk: [${atk.join('] [')}]\n 
                //             draw def: [${draw_def}]\n def: [${def.join('] [')}]
                //             `,
                // })
                interaction.reply({
                    content: `[${draw_def}]\nBên phòng thủ rút lá cuối cùng của bộ bài`,
                })

                break;

            case 'attack-insert':
                number = options.getNumber('number') || -1

                if (number > deck_size || number < 0) {
                    interaction.reply({
                        content: `Số lá bài không hợp lệ`,
                        // ephemeral: true,
                    })
                    break;
                }

                if (atk.indexOf(number) !== -1) {
                    interaction.reply({
                        content: `Lá bài số [${number}] đã tồn tại trong bộ bài!`,
                        // ephemeral: true,
                    })
                    break;
                }

                await interaction.reply({
                    content: 'Chờ chút...',
                    // ephemeral: true,
                });
                await atk.splice(helper.getRandomInt(0, atk.length - 1), 0, number)
                // await interaction.editReply({
                //     content: `${atk.join()}`,
                //     // ephemeral: true,
                // })
                await interaction.editReply({
                    content: `Đã đưa lá bài [${number}] vào bộ bài`,
                    // ephemeral: true,
                })
                break;

            case 'defend-insert':
                number = options.getNumber('number') || -1

                if (number > deck_size || number < 0) {
                    interaction.reply({
                        content: `Số lá bài không hợp lệ`,
                        // ephemeral: true,
                    })
                    break;
                }

                if (def.indexOf(number) !== -1) {
                    interaction.reply({
                        content: `Lá bài [${number}] đã tồn tại trong bộ bài!`,
                        // ephemeral: true,
                    })
                    break;
                }

                await interaction.reply({
                    content: 'Chờ chút...',
                    // ephemeral: true,
                });
                await def.splice(helper.getRandomInt(0, def.length - 1), 0, number)
                // await interaction.editReply({
                //     content: `${def.join()}`,
                //     // ephemeral: true,
                // })
                await interaction.editReply({
                    content: `Đã đưa lá bài [${number}] vào bộ bài`,
                    // ephemeral: true,
                })
                break;
        }


    })


    client.login(process.env.TOKEN)
} catch (err) {
    console.log(err)
}