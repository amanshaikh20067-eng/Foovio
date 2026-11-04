import { DietaryType, MealType } from './food';

export type NutritionGoal = 'fat_loss' | 'muscle_gain' | 'maintenance' | 'balanced';

export interface UserProfile {
  name: string;
  age: number;
  goal: NutritionGoal;
  diet: DietaryType;
  dailyBudget: number; // in INR
  perMealBudget: number; // in INR
  allergies: string[]; // ['gluten', 'dairy', 'egg', 'peanuts']
  dislikedIngredients: string[];
  preferredMealType: MealType;
  proteinTargetGrams?: number;
  dailyCalorieTarget?: number;
  isPro?: boolean;
  onboardingCompleted: boolean;
}
