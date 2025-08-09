import TelegramBot, { Message } from "node-telegram-bot-api";
import { setUserData,getUserData } from "../handlers/userData";


export const Bench = (bot: TelegramBot, msg: Message) => {
  const chatId = msg.chat.id;
  const text = msg.text?.trim();
  if (!text) return;

  const userData = getUserData(chatId);

  if (userData.BS === undefined) {
    const BS = parseFloat(text);
    if (!isNaN(BS) && BS > 0) {
      setUserData(chatId, { BS });

      const age = userData.age ?? 0;
      const weight = userData.weight ?? 0;

      let evaluation = '';
      if (age < 15) {
        if (BS >= weight * 1.2) evaluation = '🔥 Отличный результат!';
        else if (BS >= weight * 0.8) evaluation = 'Неплохо, продолжай!';
        else evaluation = 'Есть куда расти!';
      } else {
        if (BS >= weight * 1.5) evaluation = '🔥 Ты силён!';
        else if (BS >= weight) evaluation = 'Средний уровень';
        else evaluation = 'Продолжай тренироваться!';
      }

      bot.sendMessage(chatId, evaluation);
      bot.sendMessage(chatId, 'Спасибо! Все данные получены.');
    } else {
      bot.sendMessage(chatId, 'Пожалуйста, введи корректный жим (в кг).');
    }
    return;
  }
};
