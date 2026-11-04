import { storageService } from './storageService';
import { UserProfile } from '../types/user';
import { FoodItem } from '../types/food';
import { formatINR } from '../utils/formatters';
import { generateRecommendations } from './recommendationEngine';

export interface ChatResponse {
  text: string;
  suggestedPrompts?: string[];
  actionRecommendationId?: string;
}

export async function askFoovioAssistant(userMessage: string): Promise<ChatResponse> {
  const profile = storageService.getUserProfile();
  const menu = storageService.getCanteenMenu();
  const apiKey = storageService.getGeminiApiKey();

  // Try Gemini API if key is present
  if (apiKey && apiKey.trim().length > 15) {
    try {
      const aiReply = await callGeminiChat(apiKey, userMessage, profile, menu);
      return {
        text: aiReply,
        suggestedPrompts: [
          'What can I eat under ₹60?',
          'Compare Poha and Samosa',
          'Show highest protein options',
        ],
      };
    } catch (err) {
      console.warn('Gemini chat failed, falling back to intelligent domain engine', err);
    }
  }

  // Domain-Aware Rule-Based & Semantic Engine
  await new Promise((resolve) => setTimeout(resolve, 600)); // Natural response delay
  return generateDomainResponse(userMessage, profile, menu);
}

function generateDomainResponse(
  query: string,
  profile: UserProfile,
  menu: FoodItem[]
): ChatResponse {
  const q = query.toLowerCase().trim();

  // 1. Budget specific questions (e.g. "under ₹80", "under 50", "budget")
  const budgetMatch = q.match(/(?:under|below|for|within|less than)?\s*₹?\s*(\d{2,3})\s*(?:rs|rupees|inr|bucks)?/i);
  if (q.includes('under') || q.includes('budget') || (budgetMatch && budgetMatch[1])) {
    const budgetAmount = budgetMatch && budgetMatch[1] ? parseInt(budgetMatch[1], 10) : profile.perMealBudget || 80;

    // Use recommendation engine dynamically
    const recs = generateRecommendations({
      budget: budgetAmount,
      mealType: profile.preferredMealType,
      goal: profile.goal,
      diet: profile.diet,
      allergies: profile.allergies,
      availableFoodItems: menu,
    });

    if (recs.recommendations.length > 0) {
      const top = recs.recommendations[0];
      const itemsList = top.items.map((i) => `${i.quantity}x ${i.item.name} (${formatINR(i.item.price)})`).join(' + ');

      return {
        text: `Here is the best meal combo for **${formatINR(budgetAmount)}** matching your **${formatGoal(profile.goal)}** goal and **${profile.diet}** diet:

• **${top.title}**: ${itemsList}
• **Total Cost**: ${formatINR(top.totalPrice)} (saves ${formatINR(top.budgetRemaining)})
• **Nutrition**: ${top.calories} kcal | **${top.protein}g Protein** | ${top.carbs}g Carbs | ${top.fat}g Fat

💡 *Canteen Tip*: ${top.reason} You can log this directly from the **Find My Meal** page!`,
        suggestedPrompts: [
          `Can I get more protein under ${formatINR(budgetAmount)}?`,
          'Compare Poha and Samosa',
          'Suggest a healthy evening snack',
        ],
      };
    }
  }

  // 2. Comparison queries (e.g. "compare poha and samosa", "idli vs dosa")
  if (q.includes('compare') || q.includes(' vs ') || q.includes('versus') || (q.includes('poha') && q.includes('samosa'))) {
    if (q.includes('poha') && q.includes('samosa')) {
      const poha = menu.find((m) => m.id === 'poha') || { price: 30, calories: 250, protein: 5, fat: 6 };
      const samosa = menu.find((m) => m.id === 'samosa') || { price: 15, calories: 260, protein: 4, fat: 15 };

      return {
        text: `### ⚖️ Head-to-Head: Poha vs Canteen Samosa

| Metric | Poha (1 plate) | Samosa (1 pc) | Verdict |
| :--- | :--- | :--- | :--- |
| **Price** | ${formatINR(poha.price)} | ${formatINR(samosa.price)} | Samosa is cheaper |
| **Calories** | ${poha.calories} kcal | ${samosa.calories} kcal | Similar calorie load |
| **Protein** | **${poha.protein}g** | 4g | Poha has roasted peanuts |
| **Fat** | **6g (low)** | **15g (deep-fried)** | Poha is far cleaner |
| **Digestion** | Light, sustained energy | Heavy maida, sluggishness | Poha wins for afternoon classes |

**Student Recommendation**: If you are studying for exams or going to class, choose **Poha**. Deep-fried samosas spike insulin and cause severe afternoon drowsiness. If budget is rock bottom (₹15), drink water with your samosa to aid digestion!`,
        suggestedPrompts: [
          'What is the best post-workout canteen meal?',
          'Show me all meals under ₹60',
          'Which foods fit my muscle gain goal?',
        ],
      };
    }

    if (q.includes('idli') && q.includes('dosa')) {
      return {
        text: `### ⚖️ Head-to-Head: Idli & Sambar vs Masala Dosa

• **Idli & Sambar (₹40)**: Steamed, zero added oil, ~220 kcal, 7g protein. Perfect for **fat loss** and light digestion.
• **Masala Dosa (₹55)**: Crisp crepe with potato masala, ~360 kcal, 11g fat. Great for quick calories and taste, but heavier.

Verdict: Choose **Idli & Sambar** for clean digestion and lower calories, or **Masala Dosa** if you have a long lab day ahead and need higher calories!`,
        suggestedPrompts: ['Compare Poha and Samosa', 'What can I eat under ₹50?', 'Best vegetarian protein sources'],
      };
    }
  }

  // 3. Protein queries ("suggest a vegetarian protein-rich meal", "protein sources", "eggs")
  if (q.includes('protein') || q.includes('muscle') || q.includes('gym') || q.includes('workout')) {
    const isVeg = profile.diet === 'veg';
    if (isVeg) {
      return {
        text: `### 🌱 Top Vegetarian Protein Combinations in Canteen:

1. **Rajma Rice + Curd**: **21g Protein** | ~₹90
   • Kidney beans provide lysine, rice provides methionine (complete amino acid profile), plus casein from dahi.
2. **Paneer Sandwich + Chaas**: **17g Protein** | ~₹75
   • 70g fresh cottage cheese + probiotic buttermilk for smooth digestion.
3. **Dal & Rice + Curd**: **18g Protein** | ~₹80
   • Traditional comfort with zero guilt and optimal gut bioavailability.

💡 *Pro Tip for Veg Students*: Pair grains and legumes together to form complete proteins without needing expensive supplements!`,
        suggestedPrompts: [
          'What can I eat under ₹80?',
          'What fits my current nutrition goal?',
          'How much protein do I need daily?',
        ],
      };
    } else {
      return {
        text: `### 🥚 High Protein Picks for Indian College Students:

1. **Dal Rice + 2 Boiled Eggs**: **26g Protein** | ₹85 total
   • The absolute gold standard for student muscle synthesis. Best protein-per-rupee ratio on campus (~₹3.2/g).
2. **Double Masala Omelette + Butter Toast**: **14g Protein** | ₹40
   • Quick morning hot protein; whip it up in 5 minutes before morning lectures.
3. **Egg Sandwich + Curd**: **20g Protein** | ₹65
   • Wholesome evening snack after workout sessions.

You are currently set to **${profile.goal.replace('_', ' ')}** with a target of **${profile.proteinTargetGrams || 85}g protein/day**.`,
        suggestedPrompts: [
          'What can I eat under ₹60?',
          'Compare Poha and Samosa',
          'Analyze a photo of my meal',
        ],
      };
    }
  }

  // 4. Goal-specific question ("What fits my current nutrition goal?")
  if (q.includes('goal') || q.includes('my profile') || q.includes('target') || q.includes('fits')) {
    const goalText = formatGoal(profile.goal);
    return {
      text: `### 🎯 Nutrition Plan for ${profile.name || 'Student'} (${goalText})

• **Diet**: ${profile.diet.toUpperCase()}
• **Daily Budget**: ${formatINR(profile.dailyBudget)} (${formatINR(profile.perMealBudget)}/meal)
• **Target Protein**: ${profile.proteinTargetGrams || 85}g/day

**Strategic Advice for ${goalText}**:
${
  profile.goal === 'muscle_gain'
    ? 'Focus on getting at least 20-25g of protein per meal. Prioritize boiled eggs, paneer, rajma, and curd. Keep carbs moderate to high for workout recovery.'
    : profile.goal === 'fat_loss'
    ? 'Choose high-volume, lower-calorie options like Idli-Sambar, Chapati & Sabzi, and Spiced Buttermilk. Avoid fried snacks like Samosa and Chole Bhature.'
    : 'Aim for balanced plates: 50% grains/carbs, 25% protein (dal/curd/eggs), and 25% seasonal vegetables.'
}

Would you like me to curate today's lunch based on your available canteen items?`,
      suggestedPrompts: [
        `What can I eat under ${formatINR(profile.perMealBudget)}?`,
        'Suggest a high-protein lunch',
        'Compare Poha and Samosa',
      ],
    };
  }

  // 5. Canteen items specifically
  if (q.includes('canteen') || q.includes('available') || q.includes('menu')) {
    const available = menu.filter((m) => m.isAvailable);
    const count = available.length;
    return {
      text: `Your college canteen currently has **${count} active food items** available.
Top items right now:
${available.slice(0, 6).map((item) => `• **${item.name}**: ${formatINR(item.price)} (${item.calories} kcal, ${item.protein}g protein)`).join('\n')}

You can customize available items and prices anytime in the **Find My Meal** tab!`,
      suggestedPrompts: [
        'What can I eat under ₹80?',
        'Suggest a vegetarian protein-rich meal',
        'Compare Poha and Samosa',
      ],
    };
  }

  // Default intelligent assistant reply
  return {
    text: `I'm **Foovio**, your Indian college canteen nutrition companion! I know your profile as **${profile.name || 'Student'}** (${formatGoal(profile.goal)}, ${profile.diet}, ${formatINR(profile.perMealBudget)} meal budget).

Here are a few things I can help you with right now:
• Recommend exact canteen combos under your budget
• Compare nutritional value between campus snacks (e.g., Poha vs Samosa)
• Maximize your daily protein on a student allowance
• Explain trade-offs in hostel mess food

Try asking one of the prompts below:`,
    suggestedPrompts: [
      `What can I eat under ${formatINR(profile.perMealBudget)}?`,
      'Suggest a vegetarian protein-rich meal',
      'Compare Poha and Samosa',
      'What fits my current nutrition goal?',
    ],
  };
}

function formatGoal(goal: string): string {
  switch (goal) {
    case 'muscle_gain':
      return 'Muscle Gain';
    case 'fat_loss':
      return 'Fat Loss';
    case 'maintenance':
      return 'Weight Maintenance';
    case 'balanced':
      return 'Balanced Eating';
    default:
      return goal;
  }
}

async function callGeminiChat(
  apiKey: string,
  userMessage: string,
  profile: UserProfile,
  menu: FoodItem[]
): Promise<string> {
  const availableMenuStr = menu
    .filter((m) => m.isAvailable)
    .map((m) => `${m.name} (₹${m.price}, ${m.calories}kcal, ${m.protein}g protein, ${m.dietaryType})`)
    .join('; ');

  const prompt = `You are Foovio, a friendly, practical, and expert AI nutritionist specializing in Indian college students living in hostels and eating at campus canteens.
User Context:
- Name: ${profile.name}
- Goal: ${profile.goal}
- Diet: ${profile.diet}
- Per-meal Budget: ₹${profile.perMealBudget}
- Available Canteen Menu: ${availableMenuStr}

Rules:
- Give concise, realistic advice tailored to Indian college life and budgets.
- Always use INR (₹).
- Never recommend non-veg food if user is veg or eggetarian (unless eggs for eggetarians).
- Provide practical food combos with estimated prices and protein.

User question: "${userMessage}"`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received from Gemini.';
}
