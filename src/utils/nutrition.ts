import { LoggedMeal, DailyNutritionSummary } from '../types/history';
import { isSameDay } from './formatters';

export function getTodayMeals(meals: LoggedMeal[]): LoggedMeal[] {
  const today = new Date();
  return meals.filter((meal) => isSameDay(new Date(meal.timestamp), today));
}

export function calculateDailyTotals(meals: LoggedMeal[]): {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  spent: number;
  mealCount: number;
} {
  return meals.reduce(
    (acc, meal) => {
      acc.calories += meal.totalCalories || 0;
      acc.protein += meal.totalProtein || 0;
      acc.carbs += meal.totalCarbs || 0;
      acc.fat += meal.totalFat || 0;
      acc.spent += meal.totalPrice || 0;
      acc.mealCount += 1;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, spent: 0, mealCount: 0 }
  );
}

export function generateLast7DaysSummaries(meals: LoggedMeal[]): (DailyNutritionSummary & { dayName: string })[] {
  const summaries: (DailyNutritionSummary & { dayName: string })[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const targetDate = new Date();
    targetDate.setDate(today.getDate() - i);
    const dayKey = targetDate.toISOString().split('T')[0];
    const dayMeals = meals.filter((m) => isSameDay(new Date(m.timestamp), targetDate));
    const totals = calculateDailyTotals(dayMeals);

    const dayName = targetDate.toLocaleDateString('en-IN', { weekday: 'short' });

    summaries.push({
      date: dayKey,
      dayName,
      totalCalories: Math.round(totals.calories),
      totalProtein: Math.round(totals.protein),
      totalCarbs: Math.round(totals.carbs),
      totalFat: Math.round(totals.fat),
      totalSpent: Math.round(totals.spent),
      mealCount: totals.mealCount,
    });
  }

  return summaries;
}

export function getMacroPercentages(proteinGrams: number, carbsGrams: number, fatGrams: number): {
  proteinPct: number;
  carbsPct: number;
  fatPct: number;
} {
  const pCal = proteinGrams * 4;
  const cCal = carbsGrams * 4;
  const fCal = fatGrams * 9;
  const total = pCal + cCal + fCal;

  if (total <= 0) return { proteinPct: 0, carbsPct: 0, fatPct: 0 };

  return {
    proteinPct: Math.round((pCal / total) * 100),
    carbsPct: Math.round((cCal / total) * 100),
    fatPct: Math.round((fCal / total) * 100),
  };
}
