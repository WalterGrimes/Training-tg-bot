import TelegramBot, { Message } from 'node-telegram-bot-api';
import { getUserData, setUserData } from './userData';
import { Bench } from '../exercises/Bench';
import { PullUp } from '../exercises/PullUp';
import { Dips } from '../exercises/Dips';
import { trainingMemory } from './photoHandler';
import { calculateWeights } from '../utils/calculateWeight';

const exerciseHandlers: Record<string, (bot: TelegramBot, msg: Message) => void> = {
  exercise_bench: Bench,
  exercise_pullups: PullUp,
  exercise_dips: Dips
};

export const messageHandler = async (bot: TelegramBot, msg: Message) => {
  const chatId = msg.chat.id;
  const text = msg.text?.trim();
  if (!text) return;

  // Сначала проверяем обработку 1ПМ для тренировки
  if (trainingMemory[chatId]?.schedule && !trainingMemory[chatId]?.maxWeight) {
    const maxWeight = parseFloat(text.replace(',', '.'));
    
    if (isNaN(maxWeight) || maxWeight <= 0) {
      await bot.sendMessage(chatId, 'Пожалуйста, введите корректное положительное число (ваш 1ПМ в кг).');
      return;
    }

    trainingMemory[chatId].maxWeight = maxWeight;
    const calculatedSchedule = calculateWeights(maxWeight, trainingMemory[chatId].schedule!);

    let responseText = `🏋️‍♂️ Программа тренировок (1ПМ = ${maxWeight} кг):\n\n`;
    for (const [day, exercises] of Object.entries(calculatedSchedule)) {
      responseText += `*${day}:*\n`;
      exercises.forEach((ex, i) => {
        responseText += `${i + 1}. ${ex.weight} кг x ${ex.reps}\n`;
      });
      responseText += '\n';
    }

    await bot.sendMessage(chatId, responseText, { parse_mode: 'Markdown' });
    delete trainingMemory[chatId]; // Очищаем память
    return; // Завершаем обработку
  }

  // Обработка обычных сообщений
  const userData = getUserData(chatId);

  if (!userData.gender) {
    await bot.sendMessage(chatId, 'Пожалуйста, сначала выберите пол через /start');
    return;
  }

  if (userData.age === undefined) {
    const age = parseInt(text, 10);
    if (!isNaN(age) && age > 0 && age < 120) {
      setUserData(chatId, { age });
      await bot.sendMessage(chatId, 'Отлично! Теперь укажите свой вес (в кг):');
    } else {
      await bot.sendMessage(chatId, 'Пожалуйста, введите корректный возраст (1-119)');
    }
    return;
  }

  if (userData.weight === undefined) {
    const weight = parseFloat(text);
    if (!isNaN(weight) && weight >= 20 && weight <= 200) {
      setUserData(chatId, { weight });

      if (userData.exercise === 'exercise_bench') {
        await bot.sendMessage(chatId, 'Теперь укажите ваш жим лёжа (в кг):');
      } else if (userData.exercise === 'exercise_pullups') {
        await bot.sendMessage(chatId, 'Теперь укажите количество подтягиваний:');
      } else if (userData.exercise === 'exercise_dips') {
        await bot.sendMessage(chatId, 'Теперь укажите количество отжиманий на брусьях:');
      }
    } else {
      await bot.sendMessage(chatId, 'Пожалуйста, введите корректный вес (20-200 кг)');
    }
    return;
  }

  const handler = userData.exercise ? exerciseHandlers[userData.exercise] : null;
  if (handler) {
    handler(bot, msg);
    return;
  }

  await bot.sendMessage(chatId, 'Вы уже ввели все данные. Для сброса используйте /start');
};