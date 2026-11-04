import { UserProfile } from '../types/user';
import { FoodItem } from '../types/food';
import { LoggedMeal } from '../types/history';
import { Recommendation } from '../types/recommendation';
import { DEMO_USER_PROFILE } from '../data/initialUser';
import { DEFAULT_CANTEEN_MENU } from '../data/defaultMenu';
import { INITIAL_MEAL_HISTORY } from '../data/initialHistory';

const KEYS = {
  USER_PROFILE: 'foovio_user_profile_v1',
  CANTEEN_MENU: 'foovio_canteen_menu_v1',
  MEAL_HISTORY: 'foovio_meal_history_v1',
  SAVED_RECS: 'foovio_saved_recommendations_v1',
  API_KEY: 'foovio_gemini_api_key',
};

export const storageService = {
  // User Profile
  getUserProfile(): UserProfile {
    try {
      const data = localStorage.getItem(KEYS.USER_PROFILE);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to read user profile from localStorage', e);
    }
    return { ...DEMO_USER_PROFILE };
  },

  saveUserProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save user profile to localStorage', e);
    }
  },

  // Canteen Menu
  getCanteenMenu(): FoodItem[] {
    try {
      const data = localStorage.getItem(KEYS.CANTEEN_MENU);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to read menu from localStorage', e);
    }
    return [...DEFAULT_CANTEEN_MENU];
  },

  saveCanteenMenu(menu: FoodItem[]): void {
    try {
      localStorage.setItem(KEYS.CANTEEN_MENU, JSON.stringify(menu));
    } catch (e) {
      console.error('Failed to save menu to localStorage', e);
    }
  },

  // Meal History
  getMealHistory(): LoggedMeal[] {
    try {
      const data = localStorage.getItem(KEYS.MEAL_HISTORY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to read meal history from localStorage', e);
    }
    return [...INITIAL_MEAL_HISTORY];
  },

  saveMealHistory(history: LoggedMeal[]): void {
    try {
      localStorage.setItem(KEYS.MEAL_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save meal history to localStorage', e);
    }
  },

  addMeal(meal: LoggedMeal): LoggedMeal[] {
    const history = this.getMealHistory();
    const updated = [meal, ...history];
    this.saveMealHistory(updated);
    return updated;
  },

  updateMeal(updatedMeal: LoggedMeal): LoggedMeal[] {
    const history = this.getMealHistory();
    const updated = history.map((m) => (m.id === updatedMeal.id ? updatedMeal : m));
    this.saveMealHistory(updated);
    return updated;
  },

  deleteMeal(mealId: string): LoggedMeal[] {
    const history = this.getMealHistory();
    const updated = history.filter((m) => m.id !== mealId);
    this.saveMealHistory(updated);
    return updated;
  },

  // Saved Recommendations
  getSavedRecommendations(): Recommendation[] {
    try {
      const data = localStorage.getItem(KEYS.SAVED_RECS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to read saved recommendations', e);
    }
    return [];
  },

  saveRecommendation(rec: Recommendation): Recommendation[] {
    const current = this.getSavedRecommendations();
    if (!current.some((r) => r.id === rec.id)) {
      const updated = [rec, ...current];
      try {
        localStorage.setItem(KEYS.SAVED_RECS, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save recommendation', e);
      }
      return updated;
    }
    return current;
  },

  removeSavedRecommendation(recId: string): Recommendation[] {
    const current = this.getSavedRecommendations();
    const updated = current.filter((r) => r.id !== recId);
    try {
      localStorage.setItem(KEYS.SAVED_RECS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to remove recommendation', e);
    }
    return updated;
  },

  // Gemini API Key (optional user override in settings)
  getGeminiApiKey(): string {
    return localStorage.getItem(KEYS.API_KEY) || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  },

  saveGeminiApiKey(key: string): void {
    if (key.trim()) {
      localStorage.setItem(KEYS.API_KEY, key.trim());
    } else {
      localStorage.removeItem(KEYS.API_KEY);
    }
  },

  // Reset to Rahul Demo
  resetToDemo(): { profile: UserProfile; menu: FoodItem[]; history: LoggedMeal[] } {
    localStorage.removeItem(KEYS.USER_PROFILE);
    localStorage.removeItem(KEYS.CANTEEN_MENU);
    localStorage.removeItem(KEYS.MEAL_HISTORY);
    localStorage.removeItem(KEYS.SAVED_RECS);

    const profile = { ...DEMO_USER_PROFILE };
    const menu = [...DEFAULT_CANTEEN_MENU];
    const history = [...INITIAL_MEAL_HISTORY];

    this.saveUserProfile(profile);
    this.saveCanteenMenu(menu);
    this.saveMealHistory(history);

    return { profile, menu, history };
  },

  // Clear all data
  clearAllData(): void {
    localStorage.removeItem(KEYS.USER_PROFILE);
    localStorage.removeItem(KEYS.CANTEEN_MENU);
    localStorage.removeItem(KEYS.MEAL_HISTORY);
    localStorage.removeItem(KEYS.SAVED_RECS);
    localStorage.removeItem(KEYS.API_KEY);
  },
};
