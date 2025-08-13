import TelegramBot, { Message } from 'node-telegram-bot-api';
import { trainingMemory } from './photoHandler'; // Путь к твоему файлу с trainingMemory
import { calculateWeights } from '../utils/calculateWeight';

export const messageHandler = async (bot: TelegramBot, msg: Message) => {
  const chatId = msg.chat.id;
  const text = msg.text?.trim();

  if (!text) return;

  // Если у нас есть распознанная программа, но ещё нет maxWeight, значит ждём 1ПМ
  if (trainingMemory[chatId]?.schedule && !trainingMemory[chatId]?.maxWeight) {
    const maxWeight = parseFloat(text.replace(',', '.'));

    if (isNaN(maxWeight) || maxWeight <= 0) {
      await bot.sendMessage(chatId, 'Пожалуйста, введите корректное положительное число (ваш 1ПМ в кг).');
      return;
    }

    trainingMemory[chatId].maxWeight = maxWeight;

    const calculatedSchedule = calculateWeights(maxWeight, trainingMemory[chatId].schedule!);

    let responseText = `🏋️‍♂️ Программа тренировок с рабочими весами (1ПМ = ${maxWeight} кг):\n\n`;

    for (const [day, exercises] of Object.entries(calculatedSchedule)) {
      responseText += `*${day}:*\n`;
      exercises.forEach((ex, i) => {
        responseText += `${i + 1}. ${ex.weight} кг x ${ex.reps}\n`;
      });
      responseText += '\n';
    }

    // Очищаем память после вывода результата, чтобы не мешать следующей сессии
    delete trainingMemory[chatId];

    await bot.sendMessage(chatId, responseText, { parse_mode: 'Markdown' });
    return;
  }

  // Здесь можно обработать другие текстовые команды/сообщения или ничего не делать
};
