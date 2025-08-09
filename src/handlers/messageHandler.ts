// handlers/messageHandler.ts
import TelegramBot, { Message } from 'node-telegram-bot-api';
import { getUserData, setUserData } from './userData';
import { Bench } from '../exercises/Bench';
import { PullUp } from '../exercises/PullUp';
import { Dips } from '../exercises/Dips';


const exerciseHandlers: Record<string, (bot: TelegramBot, msg: Message) => void> = {
  exercise_bench: Bench,
  exercise_pullups: PullUp,
  exercise_dips: Dips
};

export const messageHandler = (bot: TelegramBot, msg: Message) => {
  const chatId = msg.chat.id;
  const text = msg.text?.trim();
  if (!text) return;

  const userData = getUserData(chatId);

  if (!userData.gender) {
    bot.sendMessage(chatId, 'Пожалуйста, сначала выбери пол через кнопки /start.');
    return;
  }

  if (userData.age === undefined) {
    const age = parseInt(text, 10);
    if (!isNaN(age) && age > 0 && age < 120) {
      setUserData(chatId, { age });
      bot.sendMessage(chatId, 'Отлично! Теперь укажи свой вес (в кг):');
    } else {
      bot.sendMessage(chatId, 'Пожалуйста, введи корректный возраст (целое число от 1 до 119).');
    }
    return;
  }

  if (userData.weight === undefined) {
    const weight = parseFloat(text);
    if (!isNaN(weight) && weight >= 20 && weight <= 200) {
      setUserData(chatId, { weight });

      // Динамическое сообщение в зависимости от упражнения
      if (userData.exercise === 'exercise_bench') {
        bot.sendMessage(chatId, 'Почти готово! Теперь укажи свой жим лёжа (в кг):');
      } else if (userData.exercise === 'exercise_pullups') {
        bot.sendMessage(chatId, 'Почти готово! Теперь укажи своё рекордное количество подтягиваний:');
      } else if (userData.exercise === 'exercise_dips') {
        bot.sendMessage(chatId, 'Почти готово! Теперь укажи своё рекордное количество отжиманий на брусьях:');
      }

    } else {
      bot.sendMessage(chatId, 'Пожалуйста, введи корректный вес (от 20 до 200 кг).');
    }
    return;
  }

  // Если дошли сюда — значит пора вызвать обработчик упражнения
  const handler = userData.exercise ? exerciseHandlers[userData.exercise] : null;
  if (handler) {
    handler(bot, msg);
    return;
  }

  bot.sendMessage(chatId, 'Ты уже ввёл все данные. Для сброса используй /start');
};
