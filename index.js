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
            bot.sendMessage(msg.chat.id, "<b>Kimga ovoz bermoqchisiz?\n\nSaylanuvchilar ro'yhati 👇🏻</b>", {
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

        else if (foundedUser.language == "rus") {
            bot.sendMessage(msg.chat.id, "<b>Еще раз привет и добро пожаловать в наш бот 😀</b>", {
                parse_mode: 'HTML',
            })
            bot.sendMessage(msg.chat.id, "<b>За кого вы хотите проголосовать?\n\nСписок выборщиков 👇🏻</b>", {
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

        else if (foundedUser.language == "eng") {
            bot.sendMessage(msg.chat.id, "<b>Hello again and welcome to our bot 😀</b>", {
                parse_mode: 'HTML',
            })
            bot.sendMessage(msg.chat.id, "<b>Who do you want to vote for?\n\nList of voters 👇🏻</b>", {
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
        let writeUser = users.find(s => s.id == msg.from.id);
        let searchSay = saylanuvchi.find(s => s.id == Number(msg.data));
        console.log(msg);
        if (msg.data == 'uzb') {
            langu = "uzb"
            bot.sendMessage(msg.message.chat.id, "<b>Kimga ovoz bermoqchisiz?\n\nSaylanuvchilar ro'yhati 👇🏻</b>", {
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
            bot.sendMessage(msg.message.chat.id, "<b>Отправьте команду /vote, чтобы проголосовать!</b>", {
                parse_mode: 'HTML',
            })
        }

        else if (msg.data == 'eng') {
            langu = "eng"
            bot.sendMessage(msg.message.chat.id, "<b>Submit the /vote command to vote!</b>", {
                parse_mode: 'HTML',
            })
        }

        else if (searchSay) {
            if (writeUser.language == "uzb") {
                bot.sendMessage(msg.message.chat.id, "Ovoz berish uchun telefon raqmingizni kiriting..!", {
                    reply_markup: {
                        keyboard: [[{
                            text: "My phone number",
                            request_contact: true
                        }]],
                        resize_keyboard: true,
                    }
                })
            }

            else if (writeUser.language == "rus") {
                bot.sendMessage(msg.message.chat.id, "Введите свой номер телефона, чтобы проголосовать..!", {
                    reply_markup: {
                        keyboard: [[{
                            text: "My phone number",
                            request_contact: true
                        }]],
                        resize_keyboard: true,
                    }
                })
            }

            else if (writeUser.language == "eng") {
                bot.sendMessage(msg.message.chat.id, "Enter your phone number to vote..!", {
                    reply_markup: {
                        keyboard: [[{
                            text: "My phone number",
                            request_contact: true
                        }]],
                        resize_keyboard: true,
                    }
                })
            }
        }

        try {
            let user = {}
            if (!writeUser) {
                console.log("else");
                user = {
                    id: msg.from.id,
                    first_name: msg.from.first_name,
                    username: msg.from.username,
                    language: `${langu}`
                }
                users.push(user);
                write_file("users", users);
            }
        }
        catch { err } {
            console.error(err)
        }
    })

    bot.on("contact", (msg) => {
        let contactUser = users.find(s => s.id == msg.from.id);
        if (msg.chat.id == msg.contact.user_id) {
            if (contactUser.language == "uzb") {
                bot.sendMessage(msg.chat.id, "Raxmat!", {
                    reply_markup: { remove_keyboard: true }
                })
                bot.sendMessage(msg.chat.id, "Ovoz berish uchun iltimos kanalga azo bo'ling!", {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "DEVOSOFT",
                                    url: "https://t.me/devosoftuz"
                                }
                            ],
                            [
                                {
                                    text: "Obuna bo'ldim",
                                    callback_data: "ok"
                                }
                            ]
                        ],
                    }
                })
            }

            else if (contactUser.language == "rus") {
                bot.sendMessage(msg.chat.id, "Подпишитесь на канал, чтобы проголосовать!", {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "DEVOSOFT",
                                    url: "https://t.me/devosoftuz"
                                }
                            ],
                            [
                                {
                                    text: "Obuna bo'ldim",
                                    callback_data: "ok"
                                }
                            ]
                        ],
                    }
                })
            }

            else if (contactUser.language == "eng") {
                bot.sendMessage(msg.chat.id, "Subscribe to the channel to vote!", {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "DEVOSOFT",
                                    url: "https://t.me/devosoftuz"
                                }
                            ],
                            [
                                {
                                    text: "Obuna bo'ldim",
                                    callback_data: "ok"
                                }
                            ]
                        ],
                    }
                })
            }

            try {
                if (contactUser) {
                    for (let i in users) {
                        if (users[i].id == msg.chat.id) {
                            users[i].phone_number = msg.contact.phone_number;
                        }
                    }
                    write_file('users', users);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        else {
            if (contactUser.language == "uzb") {
                bot.sendMessage(msg.chat.id, "Iltimos o'zingizni telefon raqamingizni yuboring!")
            }

            else if (contactUser.language == "rus") {
                bot.sendMessage(msg.chat.id, "Пожалуйста, пришлите свой номер телефона!")
            }

            else if (contactUser.language == "uzb") {
                bot.sendMessage(msg.chat.id, "Please send yourself your phone number!")
            }
        }
    })
})