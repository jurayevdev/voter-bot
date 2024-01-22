require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { read_file, write_file } = require('./fs/fs');

const bot = new TelegramBot(process.env.BOT_API_KEY, { polling: true })

let users = read_file('users');
let saylanuvchi = read_file('saylanuvchi');
let ovoz = read_file('ovoz');

bot.onText(/start/, msg => {
    let foundedUser = users.find(s => s.id == msg.from.id);
    if (foundedUser) {
        if (foundedUser.language == "uzb") {
            bot.sendMessage(msg.chat.id, "<b>Yana bir bor salom va bizning botimizga xush kelibsiz 😀</b>", {
                parse_mode: 'HTML',
            })
            bot.sendMessage(msg.chat.id, "<b>Kimga ovoz bermoqchisiz ?</b>", {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Eshmat Eshmatov",
                                callback_data: 1
                            },
                            {
                                text: "Toshmat Toshmatov",
                                callback_data: 2
                            },
                        ],
                        [
                            {
                                text: "John Doe",
                                callback_data: 3
                            },
                            {
                                text: "Ahmediv Avaz",
                                callback_data: 4
                            },
                        ],
                        [
                            {
                                text: "Kimsan Kimsanov",
                                callback_data: 5
                            },
                            {
                                text: "O'tirdiyev Turdi",
                                callback_data: 6
                            }
                        ],
                    ]
                }
            })
        }

        else if (foundedUser.language == "rus") {
            bot.sendMessage(msg.chat.id, "<b>Еще раз привет и добро пожаловать в наш бот 😀</b>", {
                parse_mode: 'HTML',
            })

            bot.sendMessage(msg.chat.id, "<b>Kimga ovoz bermoqchisiz ?</b>", {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Eshmat Eshmatov",
                                callback_data: 1
                            },
                            {
                                text: "Toshmat Toshmatov",
                                callback_data: 2
                            },
                        ],
                        [
                            {
                                text: "John Doe",
                                callback_data: 3
                            },
                            {
                                text: "Ahmediv Avaz",
                                callback_data: 4
                            },
                        ],
                        [
                            {
                                text: "Kimsan Kimsanov",
                                callback_data: 5
                            },
                            {
                                text: "O'tirdiyev Turdi",
                                callback_data: 6
                            }
                        ],
                    ]
                }
            })
        }
        else if (foundedUser.language == "eng") {
            bot.sendMessage(msg.chat.id, "<b>Hello again and welcome to our bot 😀</b>", {
                parse_mode: 'HTML',
            })
            bot.sendMessage(msg.chat.id, "<b>Kimga ovoz bermoqchisiz ?</b>", {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Eshmat Eshmatov",
                                callback_data: 1
                            },
                            {
                                text: "Toshmat Toshmatov",
                                callback_data: 2
                            },
                        ],
                        [
                            {
                                text: "John Doe",
                                callback_data: 3
                            },
                            {
                                text: "Ahmediv Avaz",
                                callback_data: 4
                            },
                        ],
                        [
                            {
                                text: "Kimsan Kimsanov",
                                callback_data: 5
                            },
                            {
                                text: "O'tirdiyev Turdi",
                                callback_data: 6
                            }
                        ],
                    ]
                }
            })
        }
        
    }
    else {
        bot.sendMessage(msg.chat.id, "<b>Hello and welcome to our bot 😀</b>\n\n<i>Select the language..👇🏻</i>", {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "🇺🇿 Uzbek",
                            callback_data: "uzb"
                        },
                        {
                            text: "🇷🇺 Russian",
                            callback_data: 'rus'
                        },
                        {
                            text: "🇺🇸 English",
                            callback_data: "eng"
                        }
                    ]
                ]
            }
        })
    }

    bot.on("callback_query", msg => {
        let langu = "eng";
        if (msg.data == 'uzb') {
            langu = "uzb"
            // bot.deleteMessage(msg.message.chat.id, msg.message.message_id)
            bot.sendMessage(msg.message.chat.id, "<b>Kimga ovoz bermoqchisiz ?</b>", {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Eshmat Eshmatov",
                                callback_data: 1
                            },
                            {
                                text: "Toshmat Toshmatov",
                                callback_data: 2
                            },
                        ],
                        [
                            {
                                text: "John Doe",
                                callback_data: 3
                            },
                            {
                                text: "Ahmediv Avaz",
                                callback_data: 4
                            },
                        ],
                        [
                            {
                                text: "Kimsan Kimsanov",
                                callback_data: 5
                            },
                            {
                                text: "O'tirdiyev Turdi",
                                callback_data: 6
                            }
                        ],
                    ],
                }
            })

        }

        else if (msg.data == 'rus') {
            langu = "rus"
            bot.sendMessage(msg.message.chat.id, "<b>Kimga ovoz bermoqchisiz ?</b>", {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Eshmat Eshmatov",
                                callback_data: 1
                            },
                            {
                                text: "Toshmat Toshmatov",
                                callback_data: 2
                            },
                        ],
                        [
                            {
                                text: "John Doe",
                                callback_data: 3
                            },
                            {
                                text: "Ahmediv Avaz",
                                callback_data: 4
                            },
                        ],
                        [
                            {
                                text: "Kimsan Kimsanov",
                                callback_data: 5
                            },
                            {
                                text: "O'tirdiyev Turdi",
                                callback_data: 6
                            }
                        ],
                    ]
                }
            })
        }

        else if (msg.data == 'eng') {
            langu = "eng"
            bot.sendMessage(msg.message.chat.id, "<b>Kimga ovoz bermoqchisiz ?</b>", {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Eshmat Eshmatov",
                                callback_data: 1
                            },
                            {
                                text: "Toshmat Toshmatov",
                                callback_data: 2
                            },
                        ],
                        [
                            {
                                text: "John Doe",
                                callback_data: 3
                            },
                            {
                                text: "Ahmediv Avaz",
                                callback_data: 4
                            },
                        ],
                        [
                            {
                                text: "Kimsan Kimsanov",
                                callback_data: 5
                            },
                            {
                                text: "O'tirdiyev Turdi",
                                callback_data: 6
                            }
                        ],
                    ]
                }
            })
        }

        try {
            let user = {}
            if (foundedUser) {
                console.log("Bu user ro'yxatdan o'tgan!");
                return;
            }
            else {
                console.log("else");
                user = {
                    id: msg.from.id,
                    first_name: msg.from.first_name,
                    username: msg.from.username,
                    language: `${langu}`
                }
                console.log(msg);
                users.push(user);
            }
            console.log(users);
            write_file("users", users);
        }
        catch { err } {
            console.error(err)
        }
    })

    bot.on("callback_query", msg => {
        console.log("Mana");
        let searchSay = saylanuvchi.find(s => s.id == Number(msg.data));
        if (searchSay) {
            bot.sendMessage(msg.message.chat.id, "Ovoz berish uchun telefon raqmingizni kiriting..!", {
                reply_markup: {
                    keyboard: [[{
                        text: "My phone number",
                        request_contact: true
                    }]],
                    resize_keyboard: true,
                }
            })
        } else {
            bot.sendMessage(msg.message.chat.id, "Bunday saylanuvchi yoq!")
        }
    })

    bot.on("contact", (msg) => {
        console.log("Contact");
        // let isSubscribes = ["administrator", "member", "owner"].includes(chatMember.status)
        bot.sendMessage(msg.chat.id, "Raxmat", {
            reply_markup: {
                remove_keyboard: true,
            }
        })
        bot.sendMessage(msg.chat.id, "Ovoz berish uchun kanalga azo bo'ling", {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Kanalga",
                            url: "https://t.me/devosoftuz"
                        }
                    ],
                    [
                        {
                            text: "Obuna bo'ldim",
                            callback_data: "ok"
                        }
                    ]
                ]
            }
        })
        let phoneNumber = users.find(s => s.id == msg.chat.id);
        if (phoneNumber) {
            for (let i in users) {
                if (users[i].id == msg.chat.id && !users[i].phone_number) {
                    users[i].phone_number = msg.reply_to_message.contact.phone_number;
                    write_file('users', users);
                }
            }
        }
    })
})