import { MealType } from './food';

export interface LoggedFoodItem {
  id: string;
  name: string;
  quantity: number;
  servingSize: string;
  price: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface LoggedMeal {
  id: string;
  timestamp: string; // ISO string
  mealType: MealType;
  name: string;
  items: LoggedFoodItem[];
  totalPrice: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  notes?: string;
  source: 'recommendation' | 'analysis' | 'manual';
}

export interface DailyNutritionSummary {
  date: string; // YYYY-MM-DD
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalSpent: number;
  mealCount: number;
}
