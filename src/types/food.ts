export type DietaryType = 'veg' | 'eggetarian' | 'non-veg';
export type MealCategory = 'breakfast' | 'main' | 'snack' | 'beverage' | 'side';
export type MealType = 'breakfast' | 'lunch' | 'snacks' | 'dinner';

export interface FoodItem {
  id: string;
  name: string;
  hindiName?: string;
  price: number; // in INR (₹)
  servingSize: string;
  calories: number; // kcal
  protein: number; // g
  carbs: number; // g
  fat: number; // g
  fiber?: number; // g
  dietaryType: DietaryType;
  category: MealCategory;
  mealTypes: MealType[];
  allergens: string[]; // e.g., 'gluten', 'dairy', 'egg', 'peanuts', 'mustard', 'soy'
  ingredients: string[];
  isAvailable: boolean;
  isCustom?: boolean;
  tag?: string; // e.g., 'Budget King', 'Protein Pick', 'Quick Grab'
  canteenNotes?: string;
}

export interface MealItemSelection {
  item: FoodItem;
  quantity: number;
}
