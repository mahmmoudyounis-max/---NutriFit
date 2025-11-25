export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  height: number; // cm
  weight: number; // kg
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose_weight' | 'maintain' | 'gain_muscle';
  dietHistory?: string;
  isPremium: boolean;
  registrationDate: string;
}

export interface Meal {
  name: string;
  description: string;
  calories: number;
  protein: string;
  carbs: string;
  fats: string;
}

export interface DayPlan {
  day: string;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snack: Meal;
  totalCalories: number;
}

export interface DietPlan {
  id: string;
  userId: string;
  createdAt: string;
  summary: string;
  weeklyPlan: DayPlan[];
  recommendations: string[];
}

export enum ActivityLevel {
  Sedentary = 'sedentary',
  Light = 'light',
  Moderate = 'moderate',
  Active = 'active',
  VeryActive = 'very_active'
}

export enum Goal {
  LoseWeight = 'lose_weight',
  Maintain = 'maintain',
  GainMuscle = 'gain_muscle'
}