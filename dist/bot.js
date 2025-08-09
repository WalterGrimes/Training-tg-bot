"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const dotenv_1 = require("dotenv");
const startHandler_1 = require("./handlers/startHandler");
const callbackHandler_1 = require("./handlers/callbackHandler");
const messageHandler_1 = require("./handlers/messageHandler");
(0, dotenv_1.config)(); // Загружаем переменные из .env
const token = process.env.BOT_TOKEN;
if (!token) {
    throw new Error('BOT_TOKEN не найден в .env');
}
const bot = new node_telegram_bot_api_1.default(token, { polling: true });
bot.onText(/\/start/, (msg) => {
    (0, startHandler_1.startHandler)(bot, msg.chat.id);
});
bot.on('callback_query', (query) => {
    (0, callbackHandler_1.callbackHandler)(bot, query);
});
bot.on('message', (msg) => {
    if (!msg.text?.startsWith('/start')) {
        (0, messageHandler_1.messageHandler)(bot, msg);
    }
});
