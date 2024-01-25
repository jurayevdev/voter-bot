require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { read_file, write_file } = require('./fs/fs');

const bot = new TelegramBot(process.env.BOT_API_KEY, { polling: true })

const channelId = '@ovozber_chat';
let users = read_file('users');
let saylanuvchi = read_file('saylanuvchi');
let votes = read_file('ovoz');
let admin = read_file('admin')
let phone = ""
let saylan = 0
let inlineKeyboard = [];


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
                    inline_keyboard: inlineKeyboard
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
                    inline_keyboard: inlineKeyboard
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
                    inline_keyboard: inlineKeyboard
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
        if (msg.data == 'uzb') {
            langu = "uzb"
            bot.deleteMessage(msg.message.chat.id, msg.message.message_id);
            bot.sendMessage(msg.message.chat.id, "<b>Kimga ovoz bermoqchisiz?\n\nSaylanuvchilar ro'yhati 👇🏻</b>", {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: inlineKeyboard
                }
            })
        }

        else if (msg.data == 'rus') {
            langu = "rus"
            bot.deleteMessage(msg.message.chat.id, msg.message.message_id);
            bot.sendMessage(msg.chat.id, "<b>За кого вы хотите проголосовать?\n\nСписок выборщиков 👇🏻</b>", {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: inlineKeyboard
                }
            })
        }

        else if (msg.data == 'eng') {
            langu = "eng"
            bot.deleteMessage(msg.message.chat.id, msg.message.message_id);
            bot.sendMessage(msg.chat.id, "<b>Who do you want to vote for?\n\nList of voters 👇🏻</b>", {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: inlineKeyboard
                }
            })
        }

        else if (searchSay) {
            saylan = Number(msg.data)
            if (writeUser.language == "uzb") {
                bot.deleteMessage(msg.message.chat.id, msg.message.message_id);
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
                bot.deleteMessage(msg.message.chat.id, msg.message.message_id);
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
                bot.deleteMessage(msg.message.chat.id, msg.message.message_id);
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

        else if (msg.data == "subscribe") {
            checkSubscription(msg.from.id)
                .then(isSubscribed => {
                    if (isSubscribed) {
                        console.log('Tastiqlandi');
                        bot.deleteMessage(msg.message.chat.id, msg.message.message_id);
                        let ovoz = {
                            ovoz_phone: phone
                        }
                        votes.push(ovoz)
                        write_file('ovoz', votes)

                        for (let i in saylanuvchi) {
                            if (saylanuvchi[i].id == saylan) {
                                if (saylanuvchi[i].ovoz) {
                                    saylanuvchi[i].ovoz = saylanuvchi[i].ovoz + 1;
                                }
                                else {
                                    saylanuvchi[i].ovoz = 1
                                }

                            }
                        }
                        write_file('saylanuvchi', saylanuvchi);

                        if (writeUser.language == "uzb") {
                            bot.sendMessage(msg.from.id, "Ovoz berganingiz uchun raxmat 😊", {
                                reply_markup: { remove_keyboard: true }
                            })
                        }

                        else if (writeUser.language == "rus") {
                            bot.sendMessage(msg.from.id, "Спасибо за ваш голос 😊", {
                                reply_markup: { remove_keyboard: true }
                            })
                        }

                        else if (writeUser.language == "eng") {
                            bot.sendMessage(msg.from.id, "Thank you for voting 😊", {
                                reply_markup: { remove_keyboard: true }
                            })
                        }
                    }
                    else {
                        console.log('Tastiqlanmadi');
                        if (writeUser.language == "uzb") {
                            bot.sendMessage(msg.from.id, "Kanalga obuna bo'lmadingiz!")
                        }

                        else if (writeUser.language == "rus") {
                            bot.sendMessage(msg.from.id, "Вы не подписаны на канал!")
                        }

                        else if (writeUser.language == "eng") {
                            bot.sendMessage(msg.from.id, "You have not subscribed to the channel!")
                        }
                    }
                })
                .catch(error => console.error('Произошла ошибка:', error));
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
})


bot.on("contact", (msg) => {
    let contactUser = users.find(s => s.id == msg.from.id);
    let ovozUser = votes.find(s => s.ovoz_phone == msg.contact.phone_number)
    phone = msg.contact.phone_number
    if (msg.chat.id == msg.contact.user_id) {
        if (!ovozUser) {
            checkSubscription(msg.from.id)
                .then(isSubscribed => {
                    if (isSubscribed || process.env.SUPER_ADMIN == msg.from.id) {
                        console.log('Tastiqlandi');
                        let ovoz = {
                            ovoz_phone: phone
                        }
                        votes.push(ovoz)
                        write_file('ovoz', votes)

                        for (let i in saylanuvchi) {
                            if (saylanuvchi[i].id == saylan) {
                                if (saylanuvchi[i].ovoz) {
                                    saylanuvchi[i].ovoz = saylanuvchi[i].ovoz + 1;
                                }
                                else {
                                    saylanuvchi[i].ovoz = 1
                                }

                            }
                        }
                        write_file('saylanuvchi', saylanuvchi);

                        if (contactUser) {
                            for (let i in users) {
                                if (users[i].id == msg.chat.id) {
                                    users[i].phone_number = msg.contact.phone_number;
                                }
                            }
                            write_file('users', users);
                        }

                        if (contactUser.language == "uzb") {
                            bot.sendMessage(msg.from.id, "Ovoz berganingiz uchun raxmat 😊", {
                                reply_markup: { remove_keyboard: true }
                            })
                        }

                        else if (contactUser.language == "rus") {
                            bot.sendMessage(msg.from.id, "Спасибо за ваш голос 😊", {
                                reply_markup: { remove_keyboard: true }
                            })
                        }

                        else if (contactUser.language == "eng") {
                            bot.sendMessage(msg.from.id, "Thank you for voting 😊", {
                                reply_markup: { remove_keyboard: true }
                            })
                        }
                    }
                    else {
                        console.log('Tastiqlanmadi');
                        if (contactUser.language == "uzb") {
                            bot.sendMessage(msg.chat.id, "Ovoz berish uchun iltimos kanalga azo bo'ling!", {
                                reply_markup: {
                                    inline_keyboard: [
                                        [
                                            {
                                                text: "DEVOSOFT",
                                                url: "https://t.me/ovozber_chat"
                                            }
                                        ],
                                        [
                                            {
                                                text: "Obuna bo'ldim",
                                                callback_data: "subscribe"
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
                                                url: "https://t.me/ovozber_chat"
                                            }
                                        ],
                                        [
                                            {
                                                text: "Obuna bo'ldim",
                                                callback_data: "subscribe"
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
                                                url: "https://t.me/ovozber_chat"
                                            }
                                        ],
                                        [
                                            {
                                                text: "Obuna bo'ldim",
                                                callback_data: "subscribe"
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
                })
                .catch(error => console.error('Произошла ошибка:', error));
        }
        else {
            if (contactUser.language == "uzb") {
                bot.sendMessage(msg.chat.id, "Bu telefon raqamidan allaqachon ovoz berilgan!", {
                    reply_markup: { remove_keyboard: true }
                })
            }

            else if (contactUser.language == "rus") {
                bot.sendMessage(msg.chat.id, "За этот номер телефона уже проголосовали!", {
                    reply_markup: { remove_keyboard: true }
                })
            }

            else if (contactUser.language == "eng") {
                bot.sendMessage(msg.chat.id, "This phone number has already been voted!", {
                    reply_markup: { remove_keyboard: true }
                })
            }
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


// subscribe channel

async function checkSubscription(userId) {
    const url = `https://api.telegram.org/bot${process.env.BOT_API_KEY}/getChatMember?chat_id=${channelId}&user_id=${userId}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.ok && (data.result.status === 'member' || data.result.status === 'administrator')) {
            return true; // пользователь подписан на канал
        } else {
            return false; // пользователь не подписан на канал
        }
    } catch (error) {
        console.error('Ошибка при запросе к API Telegram:', error);
        return false;
    }
}


for (i in saylanuvchi) {
    let row = [
        {
            text: saylanuvchi[i].name,
            callback_data: saylanuvchi[i].id
        }
    ];

    inlineKeyboard.push(row);

}

// SUPER ADMIN MENU

let superAdminMenu = [
    [
        {
            text: "Foydalanuvchilar 👥"
        }
    ],
    [
        {
            text: "Adminlar 👨🏻‍💻"
        },
        {
            text: "Saylanuvchilar 🙋🏻‍♂️"
        }
    ],
    [
        {
            text: "Majburiy obuna ✅"
        },
        {
            text: "Reklama joylash 📱"
        }
    ],
    [
        {
            text: "Menuni yopish 🔽"
        }
    ]
]



let adminMenu = [
    [
        {
            text: "Foydalanuvchilar 👥"
        },
        {
            text: "Saylanuvchilar 🙋🏻‍♂️"
        }
    ],
    [
        {
            text: "Majburiy obuna ✅"
        },
        {
            text: "Reklama joylash 📱"
        }
    ],
    [
        {
            text: "Menuni yopish 🔽"
        }
    ]
]

// ADMIN PANEL

bot.on("message", msg => {
    let SuperAdmin = process.env.SUPER_ADMIN == msg.chat.id
    let superAdminFind = admin.find(s => s.super_admin == msg.chat.id)
    let adminFind = admin.find(s => s.admin == msg.chat.id)
    if (msg.text == "Assalomu alaykum" && (superAdminFind || SuperAdmin)) {
        bot.sendMessage(msg.chat.id, "Assalomu alaykum Boss 😎", {
            reply_markup: {
                keyboard: superAdminMenu,
                resize_keyboard: true
            }
        })
    }

    else if (msg.text == "Assalomu alaykum" && adminFind) {
        bot.sendMessage(msg.chat.id, "Assalomu alaykum Boss 😎", {
            reply_markup: {
                keyboard: adminMenu,
                resize_keyboard: true
            }
        })
    }

    else if (msg.text == "Menuni yopish 🔽" && (adminFind || superAdminFind || SuperAdmin)) {
        bot.sendMessage(msg.chat.id, "Xayir Boss 😎", {
            reply_markup: { remove_keyboard: true }
        })
    }

    else if (msg.text == "🔙 Orqaga" && (superAdminFind || SuperAdmin)) {
        bot.sendMessage(msg.chat.id, "Assosiy menu ochildi!", {
            reply_markup: {
                keyboard: superAdminMenu,
                resize_keyboard: true
            }
        })
    }

    else if (msg.text == "🔙 Orqaga" && adminFind) {
        bot.sendMessage(msg.chat.id, "Assosiy menu ochildi!", {
            reply_markup: {
                keyboard: adminMenu,
                resize_keyboard: true
            }
        })
    }

    else if (msg.text == "Adminlar 👨🏻‍💻" && (superAdminFind || SuperAdmin)) {
        bot.sendMessage(msg.chat.id, "Adminlar menusi ochildi!", {
            reply_markup: {
                keyboard: [
                    [
                        {
                            text: "Adminlar soni 📊"
                        },
                        {
                            text: "Adminlar ro'yxati 📄"
                        },
                        {
                            text: "Admin qo'shish 📥"
                        }
                        
                    ],
                    [
                        {
                            text: "Adminlar ro'yxati tozalash ♻️"
                        },
                        {
                            text: "Admin o'chirish 🗑"
                        }
                    ],
                    [
                        {
                            text: "🔙 Orqaga"
                        }
                    ]
                ],
                resize_keyboard: true
            }
        })
    }

    else if (msg.text == "Foydalanuvchilar 👥" && (adminFind || superAdminFind || SuperAdmin)) {
        bot.sendMessage(msg.chat.id, "Foydalanuvchilar menusi ochildi!", {
            reply_markup: {
                keyboard: [
                    [
                        {
                            text: "Foydalanuvchilar soni 📊"
                        },
                        {
                            text: "Foydalanuvchilar ro'yxati 📄"
                        }
                    ],
                    [
                        {
                            text: "🔙 Orqaga"
                        }
                    ]
                ],
                resize_keyboard: true
            }
        })
    }

    else if (msg.text == "Saylanuvchilar 🙋🏻‍♂️" && (adminFind || superAdminFind || SuperAdmin)) {
        bot.sendMessage(msg.chat.id, "Saylanuvchilar menusi ochildi!", {
            reply_markup: {
                keyboard: [
                    [
                        {
                            text: "Saylanuvchilar soni 📊"
                        },
                        {
                            text: "Saylanuvchilar ro'yxati 📄"
                        }
                    ],
                    [
                        {
                            text: "Saylanuvchilar statistikasi 📊"
                        }
                    ],
                    [
                        {
                            text: "Saylanuvchi qo'shish 📥"
                        },
                        {
                            text: "Saylanuvchi o'chirish 🗑"
                        }
                    ],
                    [
                        {
                            text: "Saylanuvchilar ro'yxatini tozalash ♻️"
                        }
                    ],
                    [
                        {
                            text: "Ovozlarni tozalash ♻️"
                        },
                        {
                            text: "🔙 Orqaga"
                        }
                    ]
                ],
                resize_keyboard: true
            }
        })
    }

    else if (msg.text == "Majburiy obuna ✅" && (adminFind || superAdminFind || SuperAdmin)) {
        bot.sendMessage(msg.chat.id, "Majburiy obuna menusi ochildi!", {
            reply_markup: {
                keyboard: [
                    [
                        {
                            text: "Kanalni alamashtirish 🔄"
                        },
                        {
                            text: "🔙 Orqaga"
                        }
                    ]
                ],
                resize_keyboard: true
            }
        })
    }

})