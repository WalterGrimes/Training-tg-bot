import TelegramBot from 'node-telegram-bot-api';
import { resetUserData } from './userData';

export const startHandler = (bot: TelegramBot, chatId: number) => {
  resetUserData(chatId);
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
