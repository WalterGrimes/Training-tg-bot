"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startHandler = void 0;
const startHandler = (bot, chatId) => {
    bot.sendMessage(chatId, 'Привет! Давай начнем. Укажи свой пол:', {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Мужской', callback_data: 'gender_male' },
                    { text: 'Женский', callback_data: 'gender_female' },
                ],
            ],
        },
    });
};
exports.startHandler = startHandler;
