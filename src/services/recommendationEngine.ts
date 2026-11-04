import { FoodItem, MealItemSelection } from '../types/food';
import { Recommendation, RecommendationRequest, RecommendationType } from '../types/recommendation';
import { formatINR } from '../utils/formatters';

interface CandidateCombo {
  items: MealItemSelection[];
  totalPrice: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  budgetRemaining: number;
  overallScore: number;
  budgetScore: number;
  proteinScore: number;
}

export function generateRecommendations(request: RecommendationRequest): {
  recommendations: Recommendation[];
  candidateCount: number;
  filteredCount: number;
  message?: string;
} {
  const { budget, mealType, goal, diet, allergies, availableFoodItems, proteinTarget } = request;

  // 1. Filter out unavailable foods, allergens, and incompatible diets
  const safeItems = availableFoodItems.filter((item) => {
    if (!item.isAvailable) return false;

    // Diet check
    if (diet === 'veg' && item.dietaryType !== 'veg') return false;
    if (diet === 'eggetarian' && item.dietaryType === 'non-veg') return false;

    // Allergen check
    if (allergies && allergies.length > 0) {
      const hasAllergen = item.allergens.some((a) =>
        allergies.some((userAllergy) => userAllergy.toLowerCase() === a.toLowerCase())
      );
      if (hasAllergen) return false;
    }

    return true;
  });

  const filteredCount = availableFoodItems.length - safeItems.length;

  if (safeItems.length === 0) {
    return {
      recommendations: [],
      candidateCount: 0,
      filteredCount,
      message: 'No items match your dietary and allergy restrictions. Try adjusting your preferences.',
    };
  }

  // 2. Generate valid meal combinations within budget
  const combos: CandidateCombo[] = [];

  // Helper to calculate combo totals
  const evaluateCombo = (items: MealItemSelection[]): CandidateCombo | null => {
    const totalPrice = items.reduce((sum, i) => sum + i.item.price * i.quantity, 0);
    if (totalPrice > budget) return null; // exceeds budget

    const calories = items.reduce((sum, i) => sum + i.item.calories * i.quantity, 0);
    const protein = items.reduce((sum, i) => sum + i.item.protein * i.quantity, 0);
    const carbs = items.reduce((sum, i) => sum + i.item.carbs * i.quantity, 0);
    const fat = items.reduce((sum, i) => sum + i.item.fat * i.quantity, 0);
    const fiber = items.reduce((sum, i) => sum + (i.item.fiber || 0) * i.quantity, 0);
    const budgetRemaining = budget - totalPrice;

    // Calculate Goal Fit Score
    let goalScore = 50;
    if (goal === 'muscle_gain') {
      const proteinRatio = calories > 0 ? (protein * 4) / calories : 0;
      goalScore = Math.min(100, Math.round(protein * 2.8 + proteinRatio * 80));
    } else if (goal === 'fat_loss') {
      const calEfficiency = calories > 0 && calories <= 450 ? 50 : Math.max(10, 50 - (calories - 450) / 10);
      const proteinBonus = protein * 1.5;
      const fiberBonus = fiber * 3;
      goalScore = Math.min(100, Math.round(calEfficiency + proteinBonus + fiberBonus));
    } else if (goal === 'balanced') {
      const hasGrain = items.some((i) => ['chapati_sabzi', 'dal_rice', 'rajma_rice', 'poha', 'idli_sambar'].includes(i.item.id));
      const hasSide = items.some((i) => i.item.category === 'side' || i.item.category === 'beverage');
      goalScore = 50 + (hasGrain ? 25 : 10) + (hasSide ? 15 : 0) + (fiber >= 4 ? 10 : 0);
    } else {
      // maintenance
      goalScore = 65 + (calories >= 350 && calories <= 650 ? 25 : 5);
    }

    // Budget Score (cheaper = higher budget score)
    const budgetScore = Math.min(100, Math.round((budgetRemaining / Math.max(budget, 1)) * 60 + 40));

    // Protein Score
    const proteinScore = Math.min(100, Math.round(protein * 3.5));

    // Overall Score (goal weighted + budget efficiency)
    const overallScore = Math.round(goalScore * 0.65 + (100 - (totalPrice / budget) * 30) * 0.35);

    return {
      items,
      totalPrice,
      calories,
      protein: Number(protein.toFixed(1)),
      carbs: Number(carbs.toFixed(1)),
      fat: Number(fat.toFixed(1)),
      fiber: Number(fiber.toFixed(1)),
      budgetRemaining,
      overallScore: Math.min(99, Math.max(40, overallScore)),
      budgetScore,
      proteinScore,
    };
  };

  // Generate single-item meals
  for (const item of safeItems) {
    const candidate = evaluateCombo([{ item, quantity: 1 }]);
    if (candidate) combos.push(candidate);
  }

  // Generate dual-item combos
  for (let i = 0; i < safeItems.length; i++) {
    for (let j = i + 1; j < safeItems.length; j++) {
      const item1 = safeItems[i];
      const item2 = safeItems[j];

      // Logic: avoid two heavy main meals together (e.g. rajma rice + dal rice)
      if (item1.category === 'main' && item2.category === 'main') continue;

      const candidate = evaluateCombo([
        { item: item1, quantity: 1 },
        { item: item2, quantity: 1 },
      ]);
      if (candidate) combos.push(candidate);
    }
  }

  // Generate three-item combos for higher budgets
  if (budget >= 70) {
    for (let i = 0; i < safeItems.length; i++) {
      if (safeItems[i].category !== 'main' && safeItems[i].category !== 'breakfast') continue;
      for (let j = i + 1; j < safeItems.length; j++) {
        if (safeItems[j].category !== 'side' && safeItems[j].category !== 'snack') continue;
        for (let k = j + 1; k < safeItems.length; k++) {
          if (safeItems[k].category !== 'beverage' && safeItems[k].category !== 'side') continue;

          const candidate = evaluateCombo([
            { item: safeItems[i], quantity: 1 },
            { item: safeItems[j], quantity: 1 },
            { item: safeItems[k], quantity: 1 },
          ]);
          if (candidate) combos.push(candidate);
        }
      }
    }
  }

  if (combos.length === 0) {
    // If no combo fits under budget, suggest the single cheapest item available
    const cheapestItem = [...safeItems].sort((a, b) => a.price - b.price)[0];
    if (cheapestItem) {
      return {
        recommendations: [
          createRecommendation(
            'best_overall',
            [{ item: cheapestItem, quantity: 1 }],
            budget,
            goal,
            'Lowest price available in canteen'
          ),
        ],
        candidateCount: 1,
        filteredCount,
        message: `Your budget of ${formatINR(budget)} is below standard canteen meal prices. Showing closest affordable item (${cheapestItem.name} at ${formatINR(cheapestItem.price)}).`,
      };
    }
    return {
      recommendations: [],
      candidateCount: 0,
      filteredCount,
      message: `No food items found under ${formatINR(budget)}. Please increase your budget or check canteen availability.`,
    };
  }

  // 3. Select 3 distinct ranked recommendations
  // Pick #1: Best Overall (Highest overall score)
  const sortedOverall = [...combos].sort((a, b) => b.overallScore - a.overallScore || a.totalPrice - b.totalPrice);
  const bestOverall = sortedOverall[0];

  // Pick #2: Most Budget-Friendly (Lowest price with decent satiety)
  const sortedBudget = [...combos]
    .filter((c) => getComboKey(c) !== getComboKey(bestOverall))
    .sort((a, b) => a.totalPrice - b.totalPrice || b.calories - a.calories);
  const budgetFriendly = sortedBudget[0] || sortedOverall[1] || bestOverall;

  // Pick #3: Protein-Focused (Highest protein within budget)
  const sortedProtein = [...combos]
    .filter(
      (c) =>
        getComboKey(c) !== getComboKey(bestOverall) &&
        getComboKey(c) !== getComboKey(budgetFriendly)
    )
    .sort((a, b) => b.protein - a.protein || a.totalPrice - b.totalPrice);
  const proteinFocused = sortedProtein[0] || sortedOverall[2] || sortedBudget[1] || bestOverall;

  const resultRecs: Recommendation[] = [];

  // 1. Best Overall
  resultRecs.push(
    createRecommendation(
      'best_overall',
      bestOverall.items,
      budget,
      goal,
      generateReason('best_overall', bestOverall, goal, budget)
    )
  );

  // 2. Budget Friendly
  resultRecs.push(
    createRecommendation(
      'budget_friendly',
      budgetFriendly.items,
      budget,
      goal,
      generateReason('budget_friendly', budgetFriendly, goal, budget)
    )
  );

  // 3. Protein Focused
  resultRecs.push(
    createRecommendation(
      'protein_focused',
      proteinFocused.items,
      budget,
      goal,
      generateReason('protein_focused', proteinFocused, goal, budget)
    )
  );

  return {
    recommendations: resultRecs,
    candidateCount: combos.length,
    filteredCount,
  };
}

function getComboKey(c: CandidateCombo): string {
  return c.items.map((i) => `${i.item.id}:${i.quantity}`).sort().join('+');
}

function generateReason(
  type: RecommendationType,
  combo: CandidateCombo,
  goal: string,
  budget: number
): string {
  const itemNames = combo.items.map((i) => i.item.name).join(' and ');
  const saved = budget - combo.totalPrice;

  if (type === 'best_overall') {
    if (goal === 'muscle_gain') {
      return `Balanced pairing of ${itemNames} offering ${combo.protein}g protein and sustained energy, staying ₹${saved} below your ₹${budget} budget.`;
    } else if (goal === 'fat_loss') {
      return `Wholesome combination with high satiety and only ${combo.calories} kcal, saving ₹${saved} without leaving you hungry in class.`;
    }
    return `Optimized nutritional balance of complex carbohydrates and protein from ${itemNames}, utilizing ₹${combo.totalPrice} cleanly.`;
  }

  if (type === 'budget_friendly') {
    return `Maximum economy at only ₹${combo.totalPrice} (saves ₹${saved}). Provides ${combo.calories} kcal of clean fuel for lectures with minimal spending.`;
  }

  // protein_focused
  return `Peak protein efficiency with ${combo.protein}g protein at ₹${combo.totalPrice} (~₹${(combo.totalPrice / (combo.protein || 1)).toFixed(1)}/g protein), ideal for muscle repair and recovery.`;
}

function createRecommendation(
  type: RecommendationType,
  items: MealItemSelection[],
  budget: number,
  goal: string,
  reason: string
): Recommendation {
  const totalPrice = items.reduce((sum, i) => sum + i.item.price * i.quantity, 0);
  const calories = Math.round(items.reduce((sum, i) => sum + i.item.calories * i.quantity, 0));
  const protein = Number(items.reduce((sum, i) => sum + i.item.protein * i.quantity, 0).toFixed(1));
  const carbs = Number(items.reduce((sum, i) => sum + i.item.carbs * i.quantity, 0).toFixed(1));
  const fat = Number(items.reduce((sum, i) => sum + i.item.fat * i.quantity, 0).toFixed(1));
  const fiber = Number(items.reduce((sum, i) => sum + (i.item.fiber || 0) * i.quantity, 0).toFixed(1));
  const budgetRemaining = budget - totalPrice;

  let title = 'Best Overall Match';
  let subtitle = 'Optimal balance of budget, satiety & nutrition';
  let goalScore = 92;
  let tradeOffs = 'Moderate sodium from canteen preparation; drink plenty of water.';
  let alternatives = ['Add Plain Curd (+₹20) for gut probiotics and extra 5g protein'];
  let canteenTip = 'Ask the canteen bhaiya for less oil on the curry if possible.';

  if (type === 'budget_friendly') {
    title = 'Most Budget-Friendly';
    subtitle = `Maximum value under budget (saves ₹${budgetRemaining})`;
    goalScore = 84;
    tradeOffs = 'Lower total protein compared to specialized combinations, but saves money.';
    alternatives = ['Add 1 Boiled Egg (+₹13) for a fast +6.5g protein boost'];
    canteenTip = 'Great pick near month-end when hostel pocket money is tight.';
  } else if (type === 'protein_focused') {
    title = 'Protein-Focused Match';
    subtitle = `Top protein content (${protein}g) within your ₹${budget} budget`;
    goalScore = 96;
    tradeOffs = 'Slightly higher proportion of budget utilized.';
    alternatives = ['Pair with Spiced Buttermilk (+₹15) to aid digestion of heavy protein'];
    canteenTip = 'Ideal for consumption within 1-2 hours after gym or sports session.';
  }

  // Dynamic allergen alerts
  const allAllergens = Array.from(new Set(items.flatMap((i) => i.item.allergens)));

  return {
    id: `rec_${type}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type,
    title,
    subtitle,
    items,
    totalPrice,
    calories,
    protein,
    carbs,
    fat,
    fiber,
    budgetRemaining,
    goalCompatibilityScore: goalScore,
    reason,
    tradeOffs,
    alternatives,
    allergenAlerts: allAllergens.length > 0 ? allAllergens : undefined,
    canteenTip,
  };
}
