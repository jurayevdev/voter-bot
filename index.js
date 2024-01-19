require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { read_file, write_file } = require('./fs/fs');

const bot = new TelegramBot(process.env.BOT_API_KEY, { polling: true })

bot.onText(/start/, msg => {
    let users = read_file('users.json');
    let foundedUser = users.find(s => s.id == msg.from.id);
    if (foundedUser) {
        if (foundedUser.language == "uzb") {
            bot.sendMessage(msg.chat.id, "<b>Yana bir bor salom va bizning botimizga xush kelibsiz 😀</b>", {
                parse_mode: 'HTML',
                reply_markup: {
                    keyboard: [[{
                        text: "My phone number",
                        request_contact: true
                    }]],
                    resize_keyboard: true,
                }
            })
        }
        else if (foundedUser.language == "rus") {
            bot.sendMessage(msg.chat.id, "<b>Еще раз привет и добро пожаловать в наш бот 😀</b>", {
                parse_mode: 'HTML',
                reply_markup: {
                    keyboard: [[{
                        text: "My phone number",
                        request_contact: true
                    }]],
                    resize_keyboard: true,
                }
            })
        }
        else if (foundedUser.language == "eng") {
            bot.sendMessage(msg.chat.id, "<b>Hello again and welcome to our bot 😀</b>", {
                parse_mode: 'HTML',
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
            bot.sendMessage(msg.message.chat.id, "Ovoz berish uchun telefon nomeringizni bering", {
                reply_markup: {
                    keyboard: [[{
                        text: "My phone number",
                        request_contact: true
                    }]],
                    resize_keyboard: true,
                }
            })

        }

        else if (msg.data == 'rus') {
            langu = "rus"
            bot.sendMessage(msg.message.chat.id, "Ovoz berish uchun telefon nomeringizni bering", {
                reply_markup: {
                    keyboard: [[{
                        text: "My phone number",
                        request_contact: true
                    }]],
                    resize_keyboard: true,
                }
            })

        }

        else if (msg.data == 'eng') {
            langu = "eng"
            bot.sendMessage(msg.message.chat.id, "Ovoz berish uchun telefon nomeringizni bering", {
                reply_markup: {
                    keyboard: [[{
                        text: "My phone number",
                        request_contact: true
                    }]],
                    resize_keyboard: true,
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
                user = {
                    id: msg.from.id,
                    first_name: msg.from.first_name,
                    username: msg.from.username,
                    language: `${langu}`
                }
                console.log(msg);
                users.push(user);
            }
            write_file("users.json", users);
        }
        catch { err } {
            console.error(err)
        }
    })

    // bot.on("contact", (msg) => {
    //     bot.sendMessage(msg.chat.id, "Kimga ovoz bermoqchisiz", {
    //         reply_markup: {
    //             remove_keyboard: true
    //         }
    //     })
    //     let phoneNumber = users.find(s => s.id == msg.chat.id);
    //     if (phoneNumber) {
    //         for (let i in users) {
    //             if (users[i].id == msg.chat.id && !users[i].phone_number) {
    //                 users[i].phone_number = msg.reply_to_message.contact.phone_number;
    //                 write_file('users.json', users);
    //             }
    //         }
    //     }
    // })
})