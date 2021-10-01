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

        const guideId = '886977856788393987'
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
            name: 'game-manual',
            description: 'Hướng dẫn chơi'
        })

        commands?.create({
            name: 'p1-draw',
            description: 'Player 1 rút bài'
        })

        commands?.create({
            name: 'p2-draw',
            description: 'Player 2 rút bài'
        })

        commands?.create({
            name: 'p1-drawbottom',
            description: 'Player 1 rút lá ở cuối bộ bài lên tay'
        })

        commands?.create({
            name: 'p2-drawbottom',
            description: 'Player 2 rút lá ở cuối bộ bài lên tay'
        })

        commands?.create({
            name: 'p1-insert',
            description: 'Player 1 nhét một lá bài vào bộ bài',
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
            name: 'p2-insert',
            description: 'Player 2 nhét một lá bài vào bộ bài',
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
            name: 'p1-choose',
            description: 'Player 1 chọn một lá trong bộ bài và đưa lên tay',
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
            name: 'p2-choose',
            description: 'Player 2 chọn một lá trong bộ bài và đưa lên tay',
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

        if (![channel1, channel2, channel3].includes(interaction.channel.id)) {
            interaction.reply({
                content: `Xin hãy chơi ở trong channel game!`,
            })
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
                        `P1--> [${draw_atk.join('] [')}]\n` +
                        `-------------------------------\n` +
                        `P2--> [${draw_def.join('] [')}]`,
                })

                break;

            case 'game-manual':
                interaction.reply({
                    content: "Hướng dẫn sử dụng bot chia bài:\n" +
                        "`\\game-manual`: xem hướng dẫn chơi\n" +
                        "`\\game-start`: bắt đầu ván chơi mới\n" +
                        "---------------------------\n" +
                        "`\\p1-draw`: Player 1 rút bài\n" +
                        "`\\p2-draw`: Player 2 rút bài\n" +
                        "---------------------------\n" +
                        "`\\p1-drawbottom`: Player 1 rút lá ở cuối bộ bài lên tay\n" +
                        "`\\p2-drawbottom`: Player 2 rút lá ở cuối bộ bài lên tay\n" +
                        "---------------------------\n" +
                        "`\\p1-insert number`: Player 1 nhét lá bài [number] vào bộ bài\n" +
                        "`\\p2-insert number`: Player 2 nhét lá bài [number] vào bộ bài\n" +
                        "---------------------------\n" +
                        "`\\p1-choose number`: Player 1 chọn lá bài [number] và đua lên tay\n" +
                        "`\\p2-choose number`: Player 2 chọn lá bài [number] và đua lên tay\n",
                })

                break;

            case 'show-card':
                interaction.reply({
                    content: `atk: [${atk.join('] [')}]\ndef: [${def.join('] [')}]`,
                })

                break;

            case 'p1-draw':
                if (atk.length == 0) {
                    interaction.reply({
                        content: `Hết bài, Player 2 chiến thắng!`,
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
                    content: `Player 1 rút bài\n[${draw_atk}]`,
                })

                break;

            case 'p1-drawbottom':
                if (atk.length == 0) {
                    interaction.reply({
                        content: `Hết bài, Player 2 chiến thắng!`,
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
                    content: `Player 1 rút bài ở cuối\n[${draw_atk}]`,
                })

                break;

            case 'p2-draw':
                if (def.length == 0) {
                    interaction.reply({
                        content: `Hết bài, Player 1 chiến thắng!`,
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
                    content: `Player 2 rút bài\n[${draw_def}]`,
                })

                break;

            case 'p2-drawbottom':
                if (def.length == 0) {
                    interaction.reply({
                        content: `Hết bài, Player 1 chiến thắng!`,
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
                    content: `Player 2 rút bài ở cuối\n[${draw_def}]`,
                })

                break;

            case 'p1-insert':
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
                    content: `Player 1 đưa lá bài [${number}] vào bộ bài`,
                    // ephemeral: true,
                })
                break;

            case 'p2-insert':
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
                    content: `Player 2 đưa lá bài [${number}] vào bộ bài`,
                    // ephemeral: true,
                })
                break;

            case 'p1-choose':
                number = options.getNumber('number') || -1

                if (atk.indexOf(number) == -1) {
                    interaction.reply({
                        content: `Lá bài [${number}] không ở trong bộ bài!`,
                        // ephemeral: true,
                    })
                    break;
                }

                atk.splice(atk.indexOf(number), 1);
                interaction.reply({
                    content: `Player 1 lấy lá bài [${number}] lên tay`,
                    // ephemeral: true,
                })
                break;

            case 'p2-choose':
                number = options.getNumber('number') || -1

                if (def.indexOf(number) == -1) {
                    interaction.reply({
                        content: `Lá bài [${number}] không ở trong bộ bài!`,
                        // ephemeral: true,
                    })
                    break;
                }

                def.splice(def.indexOf(number), 1);
                interaction.reply({
                    content: `Player 2 lấy lá bài [${number}] lên tay`,
                    // ephemeral: true,
                })
                break;
        }


    })


    client.login(process.env.TOKEN)
} catch (err) {
    console.log(err)
}