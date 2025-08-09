"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageHandler = void 0;
const userDataMap = new Map();
const messageHandler = (bot, msg) => {
    const chatId = msg.chat.id;
    const text = msg.text?.trim();
    if (!text)
        return;
    const userData = userDataMap.get(chatId) || {};
    // Если возраст ещё не указан
    if (!userData.age) {
        const age = parseInt(text);
        if (!isNaN(age) && age > 0) {
            userData.age = age;
            userDataMap.set(chatId, userData);
            bot.sendMessage(chatId, 'Укажи свой вес (в кг):');
        }
        else {
            bot.sendMessage(chatId, 'Пожалуйста, введи корректный возраст.');
        }
        return;
    }
    // Если вес ещё не указан
    if (!userData.weight) {
        const weight = parseFloat(text);
        if (!isNaN(weight) && weight > 0) {
            userData.weight = weight;
            userDataMap.set(chatId, userData);
            bot.sendMessage(chatId, 'Укажи свой рост (в см):');
        }
        else {
            bot.sendMessage(chatId, 'Пожалуйста, введи корректный вес.');
        }
        return;
    }
    // Если рост ещё не указан
    if (!userData.height) {
        const height = parseInt(text);
        if (!isNaN(height) && height > 0) {
            userData.height = height;
            userDataMap.set(chatId, userData);
            bot.sendMessage(chatId, '✅ Спасибо! Вот твои данные:\n' +
                `Пол: ${userData.gender === 'male' ? 'Мужской' : 'Женский'}\n` +
                `Возраст: ${userData.age}\n` +
                `Вес: ${userData.weight} кг\n` +
                `Рост: ${userData.height} см`);
        }
        else {
            bot.sendMessage(chatId, 'Пожалуйста, введи корректный рост.');
        }
        return;
    }
};
exports.messageHandler = messageHandler;
