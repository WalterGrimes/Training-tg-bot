import TelegramBot from 'node-telegram-bot-api';
import { config } from 'dotenv';
import { startHandler } from './handlers/startHandler';
import { callbackHandler } from './handlers/callbackHandler';
import { messageHandler } from './handlers/messageHandler';

config(); // Загружаем переменные из .env

const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error('BOT_TOKEN не найден в .env');
}

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  startHandler(bot, msg.chat.id);
});

bot.on('callback_query', (query) => {
  callbackHandler(bot, query);
});

bot.on('message', (msg) => {
  // Обрабатываем только текстовые сообщения, которые не являются командами
  if (msg.text && !msg.text.startsWith('/')) {
    messageHandler(bot, msg);
  }
});