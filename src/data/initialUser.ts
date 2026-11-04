import { UserProfile } from '../types/user';

export const DEMO_USER_PROFILE: UserProfile = {
  name: 'Rahul Sharma',
  age: 20,
  goal: 'muscle_gain',
  diet: 'eggetarian',
  dailyBudget: 250,
  perMealBudget: 100,
  allergies: [], // no allergies by default
  dislikedIngredients: [],
  preferredMealType: 'lunch',
  proteinTargetGrams: 85, // student target
  dailyCalorieTarget: 2200,
  isPro: false,
  onboardingCompleted: true,
};

export const EMPTY_NEW_USER_PROFILE: UserProfile = {
  name: '',
  age: 19,
  goal: 'balanced',
  diet: 'veg',
  dailyBudget: 200,
  perMealBudget: 80,
  allergies: [],
  dislikedIngredients: [],
  preferredMealType: 'lunch',
  proteinTargetGrams: 60,
  dailyCalorieTarget: 2000,
  isPro: false,
  onboardingCompleted: false,
};
