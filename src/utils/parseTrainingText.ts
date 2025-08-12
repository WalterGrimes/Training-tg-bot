import { TrainingSchedule } from "../types/training";

export function parseTrainingText(text: string): TrainingSchedule | null {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const schedule: TrainingSchedule = {};
    let currentDay = '';

    for (const line of lines) {
        
        if (/неделя\s*\d+/i.test(line) || /тренировка\s*\d+/i.test(line) || /день\s*\d+/i.test(line)) {
            currentDay = line;
            schedule[currentDay] = [];
            continue;
        }

       
        if (/подход/i.test(line)) continue;

       
        const matches = [...line.matchAll(/(\d+(?:[.,]\d+)?)\s*[xхX*]\s*(\d+)/g)];

        if (matches.length && currentDay) {
            matches.forEach(m => {
                const weight = parseFloat(m[1].replace(',', '.'));
                const reps = parseInt(m[2], 10);
                if (!isNaN(weight) && !isNaN(reps)) {
                    schedule[currentDay].push({ weight, reps });
                }
            });
        }
    }

    return Object.keys(schedule).length > 0 ? schedule : null;
}
