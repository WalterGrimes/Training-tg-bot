export interface UserData {
  gender?: 'male' | 'female';
  age?: number;
  weight?: number;
  BS?: number;
  PullUp?: number;
  PushUp?: number;
  exercise?: 'exercise_bench' | 'exercise_pullups' | 'exercise_dips';
  [key: string]: any;
}
