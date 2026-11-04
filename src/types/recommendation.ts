import { FoodItem, MealItemSelection } from './food';

export type RecommendationType = 'best_overall' | 'budget_friendly' | 'protein_focused';

export interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  subtitle: string;
  items: MealItemSelection[];
  totalPrice: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  budgetRemaining: number;
  goalCompatibilityScore: number; // 0 to 100
  reason: string;
  tradeOffs: string;
  alternatives: string[];
  allergenAlerts?: string[];
  canteenTip?: string;
}

export interface RecommendationRequest {
  budget: number;
  mealType: 'breakfast' | 'lunch' | 'snacks' | 'dinner';
  goal: 'fat_loss' | 'muscle_gain' | 'maintenance' | 'balanced';
  diet: 'veg' | 'eggetarian' | 'non-veg';
  allergies: string[];
  availableFoodItems: FoodItem[];
  proteinTarget?: number;
}
