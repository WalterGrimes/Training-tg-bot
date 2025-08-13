import TelegramBot from 'node-telegram-bot-api';
import { config } from 'dotenv';
import { startHandler } from './handlers/startHandler';
import { callbackHandler } from './handlers/callbackHandler';
import { messageHandler } from './handlers/messageHandler';
import { photoHandler } from './handlers/photoHandler';

config();

const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error('BOT_TOKEN не найден в .env');
}

const bot = new TelegramBot(token, { polling: true });

// Обработчики команд
bot.onText(/\/start/, (msg) => {
  startHandler(bot, msg.chat.id);
});

bot.onText(/\/ImgPlan/, (msg) => {
  photoHandler(bot, msg);
});

// Обработчики событий
bot.on('callback_query', (query) => {
  callbackHandler(bot, query);
});

bot.on('photo', (msg) => {
  photoHandler(bot, msg);
});

// Единый обработчик сообщений
bot.on('message', (msg) => {
  if (msg.text && !msg.text.startsWith('/')) {
    messageHandler(bot, msg);
  }
});

console.log('Бот запущен...');