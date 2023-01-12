import DiscordJS from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()

import * as helper from "./helper/helper.js"

var deck_size = 20
var channel1 = '894099940446470164'
var channel2 = '920873985804234802'
var channel3 = '920874020705034241'

var number
var draw_atk, draw_def

var attack1 = helper.random()
var defend1 = helper.random()
var attack2 = helper.random()
var defend2 = helper.random()
var attack3 = helper.random()
var defend3 = helper.random()

var atk_usr1 = ''
var def_usr1 = ''
var atk_usr2 = ''
var def_usr2 = ''
var atk_usr3 = ''
var def_usr3 = ''

try {
    const client = new DiscordJS.Client({
        intents: [
            DiscordJS.Intents.FLAGS.GUILDS,
            DiscordJS.Intents.FLAGS.GUILD_MESSAGES,
        ],
    })

    client.on('ready', () => {
        console.log("ready!!!")

        const guideId = process.env.GUILD_ID
        const guild = client.guilds.cache.get(guideId)
        let commands

        if (guild) {
            commands = guild.commands
        } else {
            commands = client.application?.commands
        }
        // commands = client.application?.commands

        commands?.create({
            name: 'game-start',
            description: 'Bắt đầu lượt chơi mới',
            options: [
                {
                    name: 'player1',
                    description: 'Player 1',
                    required: true,
                    type: DiscordJS.Constants.ApplicationCommandOptionTypes.MENTIONABLE
                },
                {
                    name: 'player2',
                    description: 'Player 2',
                    required: true,
                    type: DiscordJS.Constants.ApplicationCommandOptionTypes.MENTIONABLE
                }
            ]
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

        commands?.create({
            name: 'show-deck',
            description: 'Xem số lượng bài cả 2 bên'
        })

        commands?.create({
            name: 'set-deck',
            description: 'Điều chỉnh số lượng bài trong bộ bài',
            options: [
                {
                    name: 'number',
                    description: 'số lượng lá bài',
                    required: true,
                    type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
                },
            ]
        })
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

        let usr = get_usr(interaction.channel.id)
        let atk_usr = usr.atk_usr
        let def_usr = usr.def_usr

        switch (commandName) {
            case 'game-start':

                atk = random(deck_size)
                def = random(deck_size)

                atk_usr = options.getMentionable('player1').user.id
                def_usr = options.getMentionable('player2').user.id
                assign_usr(
                    interaction.channel.id,
                    atk_usr,
                    def_usr
                )

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
                        `<@${atk_usr}>(Player 1)--> [${draw_atk.join('] [')}]\n` +
                        `-------------------------------\n` +
                        `<@${def_usr}>(Player 2)--> [${draw_def.join('] [')}]`,
                })

                break;

            case 'game-manual':
                interaction.reply({
                    content: "Hướng dẫn sử dụng bot chia bài:\n" +
                        "`/game-manual`: xem hướng dẫn chơi\n" +
                        "`/game-start player1 player2`: bắt đầu ván chơi mới với hai người chơi player 1 và player 2\n\t(Lưu ý: chỉ player 1 và player 2 được quyền gọi các lệnh tương ứng)\n" +
                        "---------------------------\n" +
                        "`/show-deck`: xem số lượng lá bài còn lại\n" +
                        "`/set-deck number`: điều chỉnh số lượng lá bài trong bộ bài thành number\n" +
                        "---------------------------\n" +
                        "`/p1-draw`: Player 1 rút bài\n" +
                        "`/p2-draw`: Player 2 rút bài\n" +
                        "---------------------------\n" +
                        "`/p1-drawbottom`: Player 1 rút lá ở cuối bộ bài lên tay\n" +
                        "`/p2-drawbottom`: Player 2 rút lá ở cuối bộ bài lên tay\n" +
                        "---------------------------\n" +
                        "`/p1-insert number`: Player 1 nhét lá bài [number] vào bộ bài\n" +
                        "`/p2-insert number`: Player 2 nhét lá bài [number] vào bộ bài\n" +
                        "---------------------------\n" +
                        "`/p1-choose number`: Player 1 chọn lá bài [number] và đưa lên tay\n" +
                        "`/p2-choose number`: Player 2 chọn lá bài [number] và đưa lên tay\n",
                })

                break;

            // case 'show-card':
            //     interaction.reply({
            //         content: `atk: [${atk.join('] [')}]\ndef: [${def.join('] [')}]`,
            //     })

            //     break;
            case 'show-deck':
                interaction.reply({
                    content: `<@${atk_usr}>(Player 1): ${atk.length}\n<@${def_usr}>(Player 2): ${def.length}`,
                })

                break;

            case 'set-deck':
                number = options.getNumber('number') || -1

                if (number > 50 || number < 10) {
                    interaction.reply({
                        content: `Số lá bài không hợp lệ, nhập số là bài trong khoảng 10-50`,
                        // ephemeral: true,
                    })
                    break;
                }
                deck_size = number
                assign_arr(
                    interaction.channel.id,
                    Array.from(Array(deck_size).keys()),
                    Array.from(Array(deck_size).keys())
                )
                interaction.reply({
                    content: `Số lượng bài của bộ bài đã thay đổi thành ${number}\n`,
                })

                break;

            case 'p1-draw':
                // console.log(atk_usr)
                // console.log(interaction.member.id)
                if (interaction.member.id !== atk_usr) {
                    interaction.reply({
                        content: `Bạn không có quyền thực hiện hành động này`,
                    })
                    break;
                }

                if (atk.length == 0) {
                    interaction.reply({
                        content: `<@${atk_usr}> đã hết bài!`,
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
                    content: `<@${atk_usr}> rút bài\n[${draw_atk}]`,
                })

                break;

            case 'p1-drawbottom':
                if (interaction.member.id !== atk_usr) {
                    interaction.reply({
                        content: `Bạn không có quyền thực hiện hành động này`,
                    })
                    break;
                }

                if (atk.length == 0) {
                    interaction.reply({
                        content: `<@${atk_usr}> đã hết bài!`,
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
                    content: `<@${atk_usr}> rút bài ở cuối\n[${draw_atk}]`,
                })

                break;

            case 'p2-draw':
                if (interaction.member.id !== def_usr) {
                    interaction.reply({
                        content: `Bạn không có quyền thực hiện hành động này`,
                    })
                    break;
                }

                if (def.length == 0) {
                    interaction.reply({
                        content: `<@${def_usr}> đã hết bài!`,
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
                    content: `<@${def_usr}> rút bài\n[${draw_def}]`,
                })

                break;

            case 'p2-drawbottom':
                if (interaction.member.id !== def_usr) {
                    interaction.reply({
                        content: `Bạn không có quyền thực hiện hành động này`,
                    })
                    break;
                }

                if (def.length == 0) {
                    interaction.reply({
                        content: `<@${def_usr}> đã hết bài!`,
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
                    content: `<@${def_usr}> rút bài ở cuối\n[${draw_def}]`,
                })

                break;

            case 'p1-insert':
                if (interaction.member.id !== atk_usr) {
                    interaction.reply({
                        content: `Bạn không có quyền thực hiện hành động này`,
                    })
                    break;
                }

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

                // await interaction.reply({
                //     content: 'Chờ chút...',
                //     // ephemeral: true,
                // });
                atk.splice(helper.getRandomInt(0, atk.length - 1), 0, number)
                // await interaction.editReply({
                //     content: `${atk.join()}`,
                //     // ephemeral: true,
                // })
                interaction.reply({
                    content: `<@${atk_usr}> đưa lá bài [${number}] vào bộ bài`,
                    // ephemeral: true,
                })
                break;

            case 'p2-insert':
                if (interaction.member.id !== def_usr) {
                    interaction.reply({
                        content: `Bạn không có quyền thực hiện hành động này`,
                    })
                    break;
                }

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

                // await interaction.reply({
                //     content: 'Chờ chút...',
                //     // ephemeral: true,
                // });
                def.splice(helper.getRandomInt(0, def.length - 1), 0, number)
                // await interaction.editReply({
                //     content: `${def.join()}`,
                //     // ephemeral: true,
                // })
                interaction.reply({
                    content: `<@${def_usr}> đưa lá bài [${number}] vào bộ bài`,
                    // ephemeral: true,
                })
                break;

            case 'p1-choose':
                if (interaction.member.id !== atk_usr) {
                    interaction.reply({
                        content: `Bạn không có quyền thực hiện hành động này`,
                    })
                    break;
                }

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
                    content: `<@${atk_usr}> lấy lá bài [${number}] lên tay`,
                    // ephemeral: true,
                })
                break;

            case 'p2-choose':
                if (interaction.member.id !== def_usr) {
                    interaction.reply({
                        content: `Bạn không có quyền thực hiện hành động này`,
                    })
                    break;
                }

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
                    content: `<@${def_usr}> lấy lá bài [${number}] lên tay`,
                    // ephemeral: true,
                })
                break;
        }


    })


    client.login(process.env.TOKEN)
} catch (err) {
    console.log(err)
}

function random(size) {
    let j, x, i;
    let a = Array.from(Array(size + 1).keys())
    a.shift()
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }

    return a;
}

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

function get_usr(channelID) {
    if (channelID === channel1) {
        return {
            atk_usr: atk_usr1,
            def_usr: def_usr1
        }
    }
    if (channelID === channel2) {
        return {
            atk_usr: atk_usr2,
            def_usr: def_usr2
        }
    }
    if (channelID === channel3) {
        return {
            atk_usr: atk_usr3,
            def_usr: def_usr3
        }
    }
}

function assign_usr(channelID, atk, def) {
    if (channelID === channel1) {
        atk_usr1 = atk
        def_usr1 = def
    }
    if (channelID === channel2) {
        atk_usr2 = atk
        def_usr2 = def
    }
    if (channelID === channel3) {
        atk_usr3 = atk
        def_usr3 = def
    }
}