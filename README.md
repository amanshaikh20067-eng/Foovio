# Foovio — AI-Powered Nutrition Assistant for Indian College Students

> **Eat smarter. Spend better.**  
> Practical, personalized meal recommendations using real Indian college canteen menus and realistic student budgets.

---

## 🌟 What is Foovio?

Foovio directly answers the daily student dilemma:  
**"What should I eat right now based on my budget, nutrition goals, dietary preferences, and the food available to me?"**

Unlike generic calorie trackers that expect home-cooked Western meals or general AI chatbots that hallucinate unrealistic ingredients, Foovio is tailored specifically for Indian campus hostels, messes, and canteens.

---

## ✨ Key Features Implemented

1. **Deterministic Recommendation Engine (`Find My Meal`)**:
   - Dynamic combinatorial algorithm calculating optimal meals from actual active canteen food items (Poha, Rajma Rice, Dal Rice, Boiled Eggs, Dosa, Idli Sambar, Paneer Sandwich, Curd, etc.).
   - Generates **3 distinct ranked options**:
     1. 🥇 **Best Overall Match** (balanced macronutrients, goal fit, and satiety).
     2. 💰 **Most Budget-Friendly** (lowest cost with high satiety).
     3. 💪 **Protein-Focused** (maximum grams of bioavailable protein per rupee).
   - Strict allergen safety filtering (Gluten, Dairy, Egg, Peanuts, Mustard).
   - Dynamic real-time adjustments when the budget slider or canteen availability changes.
   - Side-by-side comparison modal.

2. **Personalized Student Dashboard**:
   - Real-time nutrition intake vs daily calorie and protein targets.
   - Food wallet tracking (daily budget in ₹, spent today, remaining allowance).
   - Visual macronutrient balance ratio (Protein / Carbs / Fat).
   - Recent logged meals with one-click deletion and immediate recalculation.

3. **Multimodal AI Plate Scanner (`Scan Food`)**:
   - Visual plate analysis supporting both **Live Google Gemini 1.5 Flash Vision** and **Sample Analysis Mode (Deterministic Demo Engine)**.
   - Portion-size uncertainty callout (e.g., ±15% variance due to canteen oil/gravy thickness).
   - Plate item breakdown with editable quantities before saving to history.

4. **Ask Foovio — Indian Canteen Assistant**:
   - Conversational interface answering budget queries (*"What can I eat under ₹80?"*), food comparisons (*"Compare poha and samosa"*), and student protein advice.
   - Hybrid architecture: Uses Google Gemini when configured, or domain-aware rule-based heuristics reading active profile and canteen menu.

5. **Meal History & 7-Day Analytics**:
   - Recharts visual graphs for 7-day calories, protein, and rupee expenditure.
   - Add, edit, delete, and view meal details.
   - Filter by meal type (Breakfast, Lunch, Snacks, Dinner).

6. **Interactive Demo Mode**:
   - One-click instant reset to **Rahul** (20 years old, Eggetarian, ₹100 lunch budget, Muscle Gain goal).
   - Seamless presentation path across all pages without requiring API keys or external services.

7. **Freemium & Simulated Pro Upgrade**:
   - Student special tier (₹99/mo illustrative).
   - Confetti celebration and non-billing safety disclaimer.

8. **Settings & Data Management**:
   - Edit student profile, budget limits, and strict allergens.
   - Add custom canteen items and customize local prices.
   - Full reset to demo or clear local storage.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS, Custom Design System (Forest Green `#1B4332`, Warm Off-White `#FBFBF8`, Lime Accent `#74D481`, Charcoal `#0F172A`)
- **Icons**: Lucide React
- **Visual Analytics**: Recharts
- **Celebration Effects**: Canvas Confetti
- **Persistence**: Safe browser LocalStorage with zero external database dependencies
- **AI Integration**: Google Gemini 1.5 Flash Vision & Chat (optional, with robust offline deterministic fallback)

---

## 🚀 Quickstart & Setup

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)

### 2. Installation
```bash
# Clone or navigate to the project directory
cd "ES project"

# Install dependencies
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 🔑 Environment Variables (Optional)

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_GEMINI_API_KEY` | Optional Google Gemini API key for live plate analysis and live chat. | Empty (Uses offline demo engine) |

> **Note:** Foovio operates completely offline in Deterministic Demo Mode if no API key is provided. You can also configure an API key directly inside the in-app **Settings** page.

---

## 🎬 Presentation Demo Walkthrough

Follow this uninterrupted presentation script:

1. **Landing Page**:
   - Review headline, value proposition, and the 3 pillars tailored for Indian college students.
   - Click **"Try Interactive Demo"** or **"Launch Rahul Demo"**.
2. **Dashboard**:
   - See Rahul's personalized greeting (*Eggetarian, Muscle Gain, ₹250 daily budget*).
   - Review today's logged meals and remaining ₹ balance.
3. **Find My Meal**:
   - Move the budget slider from ₹100 to ₹70 and watch recommendations update deterministically in real time.
   - Toggle **"Sold Out"** on Boiled Eggs to see the recommendation engine automatically re-route protein to Paneer or Dal combinations.
   - Click **"Compare"** on 2 options and launch the side-by-side comparison modal.
   - Click **"Choose & Log Meal"** on the Best Overall option.
4. **Dashboard Verification**:
   - Return to Dashboard to see the newly logged meal reflected immediately in calories, protein, and remaining budget.
5. **Scan Food (AI Food Plate Scanner)**:
   - Click the **"Canteen Thali"** or **"Hostel Breakfast"** instant test preset.
   - Review detected items, calories, and the **Portion-Size Uncertainty (±15%)** callout.
   - Click **"Confirm & Save to Meal History"**.
6. **Ask Foovio**:
   - Click the quick prompt chip: *"Compare poha and samosa"*.
   - Review the nutritional comparison breakdown (digestion, fat, protein, and study recommendations).
7. **Pro Plan Simulation**:
   - Navigate to **Pro Plan** and click **"Simulate Pro Upgrade"**.
   - Enjoy the confetti animation and test pro mode badge.

---

## 🔒 Limitations & Disclaimers

1. **Portion Uncertainty**: Canteen ladle sizes, oil levels in gravies, and cook variances introduce an estimated ±15% nutritional variance.
2. **Simulated Payments**: Foovio Pro is an educational demonstration prototype; no real financial transactions take place.
3. **Medical Disclaimer**: Nutritional calculations are for educational decision support and general student wellness, not medical advice.
