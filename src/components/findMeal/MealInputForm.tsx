import React from 'react';
import { NutritionGoal } from '../../types/user';
import { DietaryType, MealType } from '../../types/food';
import { formatINR } from '../../utils/formatters';
import { IndianRupee, Sparkles, Filter, ShieldCheck, Flame, Dumbbell, Scale, Heart } from 'lucide-react';
import { Button } from '../common/Button';

interface MealInputFormProps {
  budget: number;
  onBudgetChange: (val: number) => void;
  mealType: MealType;
  onMealTypeChange: (val: MealType) => void;
  goal: NutritionGoal;
  onGoalChange: (val: NutritionGoal) => void;
  diet: DietaryType;
  onDietChange: (val: DietaryType) => void;
  allergies: string[];
  onToggleAllergy: (allergy: string) => void;
}

const COMMON_ALLERGENS = [
  { id: 'gluten', label: 'Gluten / Wheat' },
  { id: 'dairy', label: 'Dairy / Milk' },
  { id: 'egg', label: 'Eggs' },
  { id: 'peanuts', label: 'Peanuts' },
  { id: 'mustard', label: 'Mustard' },
];

const PRESET_BUDGETS = [40, 60, 80, 100, 120];

export const MealInputForm: React.FC<MealInputFormProps> = ({
  budget,
  onBudgetChange,
  mealType,
  onMealTypeChange,
  goal,
  onGoalChange,
  diet,
  onDietChange,
  allergies,
  onToggleAllergy,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-charcoal-200 p-5 shadow-soft-sm space-y-5">
      <div className="flex items-center justify-between border-b border-charcoal-100 pb-3">
        <h3 className="text-base font-bold text-charcoal-900 flex items-center gap-2">
          <Filter className="w-4 h-4 text-forest-600" />
          <span>Decision Parameters</span>
        </h3>
        <span className="text-xs text-charcoal-500 font-medium">Real-time recalculation</span>
      </div>

      {/* 1. Meal Budget Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-charcoal-800 uppercase tracking-wider flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5 text-forest-700" />
            <span>Budget For This Meal</span>
          </label>
          <div className="text-xl font-black text-forest-900 px-3 py-1 rounded-xl bg-forest-50 border border-forest-200">
            {formatINR(budget)}
          </div>
        </div>

        <input
          type="range"
          min="20"
          max="200"
          step="5"
          value={budget}
          onChange={(e) => onBudgetChange(Number(e.target.value))}
          className="w-full h-2.5 bg-charcoal-200 rounded-lg appearance-none cursor-pointer accent-forest-600"
        />

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-charcoal-500 font-medium mr-1">Quick:</span>
            {PRESET_BUDGETS.map((amt) => (
              <button
                key={amt}
                onClick={() => onBudgetChange(amt)}
                className={`px-2 py-0.5 rounded-md text-xs font-bold transition-all ${
                  budget === amt
                    ? 'bg-forest-600 text-white shadow-soft-sm'
                    : 'bg-cream-200 hover:bg-cream-300 text-charcoal-700'
                }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>
          <span className="text-[11px] text-charcoal-400">Max ₹200</span>
        </div>
      </div>

      {/* 2. Meal Type & Diet Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Meal Type */}
        <div>
          <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-2">
            Meal Time
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {(['breakfast', 'lunch', 'snacks', 'dinner'] as MealType[]).map((type) => (
              <button
                key={type}
                onClick={() => onMealTypeChange(type)}
                className={`py-2 text-xs font-bold rounded-xl capitalize transition-colors ${
                  mealType === type
                    ? 'bg-forest-600 text-white shadow-soft-sm'
                    : 'bg-cream-200 hover:bg-cream-300 text-charcoal-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Dietary Preference */}
        <div>
          <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-2">
            Dietary Preference
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {(['veg', 'eggetarian', 'non-veg'] as DietaryType[]).map((d) => (
              <button
                key={d}
                onClick={() => onDietChange(d)}
                className={`py-2 text-xs font-bold rounded-xl capitalize transition-colors ${
                  diet === d
                    ? 'bg-forest-600 text-white shadow-soft-sm'
                    : 'bg-cream-200 hover:bg-cream-300 text-charcoal-700'
                }`}
              >
                {d === 'eggetarian' ? 'Eggetarian' : d === 'veg' ? 'Pure Veg' : 'Non-Veg'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Nutrition Goal Selector */}
      <div>
        <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-2">
          Nutrition Priority
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'muscle_gain', label: 'Muscle Gain', icon: <Dumbbell className="w-3.5 h-3.5" /> },
            { id: 'fat_loss', label: 'Fat Loss', icon: <Flame className="w-3.5 h-3.5" /> },
            { id: 'balanced', label: 'Balanced Plate', icon: <Scale className="w-3.5 h-3.5" /> },
            { id: 'maintenance', label: 'Maintenance', icon: <Heart className="w-3.5 h-3.5" /> },
          ].map((g) => (
            <button
              key={g.id}
              onClick={() => onGoalChange(g.id as NutritionGoal)}
              className={`flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-bold border transition-all ${
                goal === g.id
                  ? 'bg-forest-600 text-white border-forest-600 shadow-soft-sm'
                  : 'bg-white hover:bg-cream-100 text-charcoal-700 border-charcoal-200'
              }`}
            >
              {g.icon}
              <span>{g.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Allergies / Restrictions Filter */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-charcoal-700 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
            <span>Strict Allergies & Exclusions</span>
          </label>
          {allergies.length > 0 && (
            <span className="text-[11px] text-rose-600 font-bold">
              {allergies.length} Excluded
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {COMMON_ALLERGENS.map((allergy) => {
            const isSelected = allergies.includes(allergy.id);
            return (
              <button
                key={allergy.id}
                onClick={() => onToggleAllergy(allergy.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  isSelected
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : 'bg-cream-100 hover:bg-cream-200 text-charcoal-700 border-charcoal-200'
                }`}
              >
                {isSelected ? '✕ ' : '+ '}
                {allergy.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
