import TelegramBot, { Message } from 'node-telegram-bot-api';
import { getUserData, setUserData } from '../handlers/userData';

export const PullUp = (bot: TelegramBot, msg: Message) => {
  const chatId = msg.chat.id;
  const text = msg.text?.trim();
  if (!text) return;

  const userData = getUserData(chatId);

  if (userData.PullUp === undefined) {
    const pullUps = parseInt(text, 10);
    if (!isNaN(pullUps) && pullUps >= 0) {
      setUserData(chatId, { PullUp: pullUps });

      const age = userData.age!;
      const weight = userData.weight!;

      const weightFactor = weight / 70;
      const threshold = (base: number) => Math.round(base * weightFactor);

      let evaluation = '';

      if (age >= 12 && age <= 14) {
        if (pullUps >= threshold(10)) evaluation = '🔥 Отличный результат для твоего возраста и веса!';
        else if (pullUps >= threshold(6)) evaluation = 'Неплохо, но можно лучше!';
        else evaluation = 'Есть куда расти — тренируйся усерднее!';
      } else if (age >= 15 && age <= 17) {
        if (pullUps >= threshold(12)) evaluation = '🔥 Ты в хорошей форме для своего возраста и веса!';
        else if (pullUps >= threshold(7)) evaluation = 'Средний уровень, продолжай работать!';
        else evaluation = 'Продолжай тренироваться, и будет лучше!';
      } else if (age >= 18 && age <= 25) {
        if (pullUps >= threshold(15)) evaluation = '🔥 Отличный уровень силы!';
        else if (pullUps >= threshold(10)) evaluation = 'Хороший результат, двигайся дальше!';
        else evaluation = 'Есть над чем работать — не сдавайся!';
      } else if (age >= 26 && age <= 35) {
        if (pullUps >= threshold(12)) evaluation = '🔥 Хороший показатель для твоего возраста и веса!';
        else if (pullUps >= threshold(8)) evaluation = 'Средний уровень, продолжай тренироваться!';
        else evaluation = 'Не останавливайся, тренируйся чаще!';
      } else if (age >= 36 && age <= 50) {
        if (pullUps >= threshold(8)) evaluation = '🔥 Молодец, отличная форма!';
        else if (pullUps >= threshold(5)) evaluation = 'Средний уровень — поддерживай себя в форме!';
        else evaluation = 'Работай над собой, все получится!';
      } else if (age > 50) {
        if (pullUps >= threshold(5)) evaluation = '🔥 Прекрасный результат!';
        else if (pullUps >= threshold(3)) evaluation = 'Неплохо, продолжай в том же духе!';
        else evaluation = 'Время тренироваться, ты сможешь!';
      } else {
        evaluation = 'Возраст неизвестен, но главное — тренироваться!';
      }

      bot.sendMessage(chatId, evaluation);
      bot.sendMessage(chatId, 'Спасибо! Все данные получены.');
    } else {
      bot.sendMessage(chatId, 'Пожалуйста, введи корректное число подтягиваний.');
    }
  }
};
