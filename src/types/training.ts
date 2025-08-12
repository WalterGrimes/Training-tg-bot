export type ExerciseSet = { weight: number; reps: number};
export type TrainingDay = ExerciseSet[];
export type TrainingSchedule = Record<string, TrainingDay>;

export interface TrainingMemory {
    text: string;
    schedule?: TrainingSchedule;
    maxWeight?: number;
}