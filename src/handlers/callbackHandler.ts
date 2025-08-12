import TelegramBot, { CallbackQuery } from 'node-telegram-bot-api';
import { setUserData } from './userData'

export const callbackHandler = (bot: TelegramBot, query: CallbackQuery) => {
  const chatId = query.message?.chat.id;
  const data = query.data;

  if (!chatId || !data) return;

  if (data === 'gender_male' || data === 'gender_female') {
    setUserData(chatId, {
      gender: data === 'gender_male' ? 'male' : 'female'
    });

    bot.sendMessage(chatId, 'Отлично! Теперь выбери упражнение, которое хочешь делать:', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Жим лёжа', callback_data: 'exercise_bench' },
            { text: 'Подтягивания', callback_data: 'exercise_pullups' },
            { text: 'Отжимания на брусьях', callback_data: 'exercise_dips' }
          ]
        ]
      }
    });
    return;
  }

  if (data === 'exercise_bench' || data === 'exercise_pullups' || data === 'exercise_dips') {
    setUserData(chatId, { exercise: data });
    bot.sendMessage(chatId, `Вы выбрали упражнение: ${data}.`);
    bot.sendMessage(chatId, 'Теперь введи свой возраст:');
    return;
  }
};
