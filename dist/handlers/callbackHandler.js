"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callbackHandler = void 0;
const userDataMap = new Map();
const callbackHandler = (bot, query) => {
    const chatId = query.message?.chat.id;
    const data = query.data;
    if (!chatId || !data)
        return;
    const userData = userDataMap.get(chatId) || {};
    if (data === 'gender_male' || data === 'gender_female') {
        userData.gender = data === 'gender_male' ? 'male' : 'female';
        userDataMap.set(chatId, userData);
        bot.sendMessage(chatId, 'Укажи свой возраст:');
    }
};
exports.callbackHandler = callbackHandler;
