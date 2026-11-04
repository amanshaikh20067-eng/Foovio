import { storageService } from './storageService';
import { FoodItem } from '../types/food';

export interface DetectedFoodItem {
  id: string;
  name: string;
  quantity: number;
  servingSize: string;
  confidence: number; // 0 to 1
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  price: number;
  notes?: string;
}

export interface AnalysisResult {
  mode: 'live_ai' | 'demo_sample';
  mealName: string;
  detectedItems: DetectedFoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalEstimatedPrice: number;
  portionUncertainty: {
    percentage: number; // e.g. 15 for ±15%
    reason: string;
  };
  nutritionalInsights: string[];
  disclaimer: string;
}

// Sample presets for Demo Mode
export const SAMPLE_PRESETS: {
  id: string;
  label: string;
  description: string;
  badge: string;
  presetData: AnalysisResult;
}[] = [
  {
    id: 'thali',
    label: 'Canteen Thali (Dal, Rice, Sabzi, Curd)',
    description: 'Standard campus lunch tray with yellow dal, seasonal aloo beans, white rice, and plain curd.',
    badge: 'Popular Lunch',
    presetData: {
      mode: 'demo_sample',
      mealName: 'Hostel Canteen Lunch Thali',
      detectedItems: [
        {
          id: 'item_dal',
          name: 'Tadka Dal',
          quantity: 1,
          servingSize: '1 medium katori (150g)',
          confidence: 0.94,
          calories: 160,
          protein: 8,
          carbs: 22,
          fat: 4,
          price: 25,
          notes: 'Yellow toor dal with cumin & mustard seed tempering',
        },
        {
          id: 'item_rice',
          name: 'Steamed White Rice',
          quantity: 1,
          servingSize: '1 mound (180g)',
          confidence: 0.98,
          calories: 230,
          protein: 4,
          carbs: 50,
          fat: 0.5,
          price: 25,
          notes: 'Standard canteen boiled rice',
        },
        {
          id: 'item_sabzi',
          name: 'Aloo Gobi Sabzi',
          quantity: 1,
          servingSize: '1 small katori (120g)',
          confidence: 0.89,
          calories: 140,
          protein: 3,
          carbs: 18,
          fat: 7,
          price: 25,
          notes: 'Potato & cauliflower dry curry with turmeric',
        },
        {
          id: 'item_curd',
          name: 'Plain Curd (Dahi)',
          quantity: 1,
          servingSize: '1 small cup (100g)',
          confidence: 0.96,
          calories: 60,
          protein: 3.5,
          carbs: 4.5,
          fat: 3,
          price: 15,
          notes: 'Fresh dahi for digestion and gut flora',
        },
      ],
      totalCalories: 590,
      totalProtein: 18.5,
      totalCarbs: 94.5,
      totalFat: 14.5,
      totalEstimatedPrice: 90,
      portionUncertainty: {
        percentage: 15,
        reason: 'Canteen serving sizes vary depending on ladle fill and oil used in tadka (±15%).',
      },
      nutritionalInsights: [
        'Complete amino acid profile achieved by pairing rice with dal.',
        'Curd adds beneficial live cultures and natural casein protein.',
        'High in complex carbs; great energy for afternoon labs or study sessions.',
      ],
      disclaimer: 'Generated via Demo Mode deterministic heuristics. Review and adjust portions as needed.',
    },
  },
  {
    id: 'poha_eggs',
    label: 'Hostel Breakfast (Poha + 2 Boiled Eggs)',
    description: 'Fresh yellow flattened rice topped with peanuts and coriander, accompanied by two hard-boiled eggs.',
    badge: 'High Protein Breakfast',
    presetData: {
      mode: 'demo_sample',
      mealName: 'Poha & Boiled Eggs Breakfast',
      detectedItems: [
        {
          id: 'item_poha',
          name: 'Canteen Poha',
          quantity: 1,
          servingSize: '1 plate (180g)',
          confidence: 0.97,
          calories: 250,
          protein: 5,
          carbs: 45,
          fat: 6,
          price: 30,
          notes: 'Tempered with roasted peanuts, curry leaves, and lemon',
        },
        {
          id: 'item_eggs',
          name: 'Boiled Eggs',
          quantity: 2,
          servingSize: '2 large hard-boiled eggs',
          confidence: 0.99,
          calories: 145,
          protein: 13,
          carbs: 1,
          fat: 10,
          price: 25,
          notes: 'High biological value protein with choline and vitamin B12',
        },
      ],
      totalCalories: 395,
      totalProtein: 18,
      totalCarbs: 46,
      totalFat: 16,
      totalEstimatedPrice: 55,
      portionUncertainty: {
        percentage: 10,
        reason: 'Boiled eggs have fixed size; poha portion varies slightly by plate size (±10%).',
      },
      nutritionalInsights: [
        'Superior satiety-to-calorie ratio; prevents mid-morning energy crashes.',
        'High bioavailability egg albumin supports muscle synthesis.',
        'Budget-friendly: only ₹55 total for 18g protein.',
      ],
      disclaimer: 'Generated via Demo Mode deterministic heuristics. Review and adjust portions as needed.',
    },
  },
  {
    id: 'dosa_sambar',
    label: 'South Indian Breakfast (Masala Dosa + Sambar)',
    description: 'Crispy fermented rice-lentil crepe filled with spiced potatoes, served with lentil sambar and coconut chutney.',
    badge: 'Campus Favorite',
    presetData: {
      mode: 'demo_sample',
      mealName: 'Masala Dosa with Sambar & Chutney',
      detectedItems: [
        {
          id: 'item_dosa',
          name: 'Masala Dosa',
          quantity: 1,
          servingSize: '1 large crisp dosa with potato filling',
          confidence: 0.96,
          calories: 340,
          protein: 6.5,
          carbs: 55,
          fat: 11,
          price: 50,
          notes: 'Golden fermented batter cooked with minimal oil on tawa',
        },
        {
          id: 'item_sambar',
          name: 'Vegetable Sambar',
          quantity: 1,
          servingSize: '1 bowl (150ml)',
          confidence: 0.93,
          calories: 75,
          protein: 3,
          carbs: 12,
          fat: 1.5,
          price: 10,
          notes: 'Toor dal broth with drumsticks and tamarind',
        },
      ],
      totalCalories: 415,
      totalProtein: 9.5,
      totalCarbs: 67,
      totalFat: 12.5,
      totalEstimatedPrice: 60,
      portionUncertainty: {
        percentage: 12,
        reason: 'Oil brushing on dosa and coconut chutney quantity introduce slight variance (±12%).',
      },
      nutritionalInsights: [
        'Fermented batter is easily digestible and gentler on student gut health.',
        'Consider ordering an extra boiled egg or chaas to increase protein density.',
      ],
      disclaimer: 'Generated via Demo Mode deterministic heuristics. Review and adjust portions as needed.',
    },
  },
];

export async function analyzeFoodImage(
  imageBase64: string,
  userDescription?: string,
  fileName?: string
): Promise<AnalysisResult> {
  const apiKey = storageService.getGeminiApiKey();

  // If a valid live Gemini API key is configured, invoke Gemini Vision API
  if (apiKey && apiKey.trim().length > 15) {
    try {
      return await callGeminiVision(apiKey, imageBase64, userDescription);
    } catch (err) {
      console.warn('Gemini API call failed, falling back to deterministic demo engine', err);
      // Fallback to sample mode with clear notification
    }
  }

  // Deterministic Demo Mode (Intelligent simulation based on file or description)
  await new Promise((resolve) => setTimeout(resolve, 1100)); // realistic UX feedback

  const descLower = (userDescription || '').toLowerCase();
  const fileLower = (fileName || '').toLowerCase();

  // Match heuristics
  if (descLower.includes('poha') || descLower.includes('egg') || fileLower.includes('egg') || fileLower.includes('poha')) {
    return { ...SAMPLE_PRESETS[1].presetData };
  } else if (descLower.includes('dosa') || descLower.includes('idli') || fileLower.includes('dosa')) {
    return { ...SAMPLE_PRESETS[2].presetData };
  }

  // Default to Canteen Thali
  const base = { ...SAMPLE_PRESETS[0].presetData };
  if (userDescription) {
    base.mealName = userDescription.slice(0, 40);
  }
  return base;
}

async function callGeminiVision(
  apiKey: string,
  imageBase64: string,
  userDescription?: string
): Promise<AnalysisResult> {
  // Extract pure base64 without prefix
  const cleanedBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

  const prompt = `You are Foovio, an AI Indian food nutritionist. Analyze this photo of an Indian meal${
    userDescription ? ` described by user as: "${userDescription}"` : ''
  }.
Return ONLY valid JSON matching this schema:
{
  "mealName": "Name of meal",
  "detectedItems": [
    {
      "name": "Food Item Name",
      "quantity": 1,
      "servingSize": "e.g. 1 plate or 1 cup",
      "confidence": 0.92,
      "calories": 250,
      "protein": 6,
      "carbs": 40,
      "fat": 7,
      "price": 35,
      "notes": "brief observation"
    }
  ],
  "portionUncertaintyPercentage": 15,
  "uncertaintyReason": "Hostel canteen oil and gravy thickness variations",
  "nutritionalInsights": ["insight 1", "insight 2"]
}`;

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
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: cleanedBase64,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          response_mime_type: 'application/json',
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini API');

  const parsed = JSON.parse(text);

  const detectedItems: DetectedFoodItem[] = (parsed.detectedItems || []).map((item: any, idx: number) => ({
    id: `gemini_item_${idx}_${Date.now()}`,
    name: item.name || 'Indian Food Item',
    quantity: item.quantity || 1,
    servingSize: item.servingSize || '1 standard portion',
    confidence: item.confidence || 0.9,
    calories: Number(item.calories) || 150,
    protein: Number(item.protein) || 5,
    carbs: Number(item.carbs) || 20,
    fat: Number(item.fat) || 5,
    price: Number(item.price) || 40,
    notes: item.notes,
  }));

  const totalCalories = detectedItems.reduce((sum, i) => sum + i.calories * i.quantity, 0);
  const totalProtein = Number(detectedItems.reduce((sum, i) => sum + i.protein * i.quantity, 0).toFixed(1));
  const totalCarbs = Number(detectedItems.reduce((sum, i) => sum + i.carbs * i.quantity, 0).toFixed(1));
  const totalFat = Number(detectedItems.reduce((sum, i) => sum + i.fat * i.quantity, 0).toFixed(1));
  const totalEstimatedPrice = detectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return {
    mode: 'live_ai',
    mealName: parsed.mealName || 'Analyzed Indian Meal',
    detectedItems,
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat,
    totalEstimatedPrice,
    portionUncertainty: {
      percentage: parsed.portionUncertaintyPercentage || 15,
      reason: parsed.uncertaintyReason || 'Visual volume estimation has ±15% variance for canteen gravies and oil.',
    },
    nutritionalInsights: parsed.nutritionalInsights || [
      'Visual estimation powered by Google Gemini Vision API.',
      'Always verify serving sizes with your canteen ladle quantity.',
    ],
    disclaimer: 'Live AI Analysis provided via Gemini 1.5 Flash. Nutrition values are estimates.',
  };
}
