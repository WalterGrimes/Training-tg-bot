import { TrainingSchedule } from "../types/training";

export const calculateWeights = (max: number, schedule: TrainingSchedule): TrainingSchedule => {
    const newSchedule: TrainingSchedule = {};

    for (const [day, exercises] of Object.entries(schedule)) {
        newSchedule[day] = exercises.map(ex => {
            let { weight, reps } = ex;
            if (weight > 0 && weight <= 1) {
                weight = Math.round(max * weight);
            } else if (Number.isInteger(weight) && weight >= 5 && weight <= 10) {
                const rpePercentage = 1 - (10 - weight) * 0.025;
                weight = Math.round(max * rpePercentage);
            }
            return { weight, reps };
        });
    }

    return newSchedule;
};
