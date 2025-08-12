import TelegramBot, { Message } from "node-telegram-bot-api";
import { createWorker, PSM } from "tesseract.js";
import fs from "fs";
import axios from "axios";
import { preprocessImage } from "../utils/preprocessImage";
import { parseTrainingText } from "../utils/parseTrainingText";
import { TrainingMemory } from "../types/training";

export const trainingMemory: Record<number, TrainingMemory> = {};


export const photoHandler = async (bot: TelegramBot, msg: Message) => {
    const chatId = msg.chat.id;

    if (!msg.photo || msg.photo.length === 0) {
        await bot.sendMessage(chatId, 'Пожалуйста, отправьте фото с программой тренировок.');
        return;
    }

    try {
        const fileId = msg.photo[msg.photo.length - 1].file_id;
        const fileUrl = await bot.getFileLink(fileId);

        const originalPath = `./photo_${chatId}.jpg`;
        const processedPath = `./photo_${chatId}_processed.jpg`;

        const response = await axios.get(fileUrl.toString(), { responseType: 'arraybuffer' });
        fs.writeFileSync(originalPath, response.data);

        await bot.sendChatAction(chatId, 'typing');
        await bot.sendMessage(chatId, '🔍 Обрабатываю изображение...');

        await preprocessImage(originalPath, processedPath);

        const worker = await createWorker('rus+eng');
        await worker.setParameters({
            tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
            tessedit_char_whitelist: '0123456789,.хxX*ДденьПпонедельникВтвторникСсредаЧчетвергПпятницаСсубботаВвоскресенье',
        });

        const { data: { text } } = await worker.recognize(processedPath);
        await worker.terminate();

        fs.unlinkSync(originalPath);
        fs.unlinkSync(processedPath);

        const cleanedText = text
            .replace(/[ОOo]/g, '0')
            .replace(/[lI|]/g, '1')
            .replace(/,/g, '.')
            .replace(/[хxX*]/g, 'x')
            .replace(/\s+/g, ' ')
            .trim();

        if (!cleanedText) {
            throw new Error('Не удалось распознать текст');
        }

        const schedule = parseTrainingText(cleanedText);
        
        if (!schedule) {
            await bot.sendMessage(chatId, '❌ Не удалось распознать программу тренировок. Убедитесь, что фото четкое и содержит данные в формате "вес x повторения".');
            return;
        }

        trainingMemory[chatId] = {
            text: cleanedText,
            schedule
        };

        let responseText = '📋 Распознанная программа тренировок:\n\n';
        for (const [day, exercises] of Object.entries(schedule)) {
            responseText += `*${day}:*\n`;
            exercises.forEach((ex, i) => {
                responseText += `${i + 1}. ${ex.weight} x ${ex.reps}\n`;
            });
            responseText += '\n';
        }

        await bot.sendMessage(chatId, responseText, { parse_mode: 'Markdown' });
        await bot.sendMessage(chatId, '💪 Введите ваш одноповторный максимум (1ПМ) в кг для расчета рабочих весов:');

    } catch (error) {
        console.error('Ошибка обработки фото:', error);
        await bot.sendMessage(chatId, '❌ Ошибка при обработке фото. Пожалуйста, попробуйте еще раз или отправьте текст программы вручную.');
    }
};
