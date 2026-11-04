import React, { useState } from 'react';
import { UserProfile, NutritionGoal } from '../types/user';
import { DietaryType, MealType } from '../types/food';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  UtensilsCrossed,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  ShieldCheck,
  IndianRupee,
} from 'lucide-react';
import { DEMO_USER_PROFILE } from '../data/initialUser';
import { formatINR } from '../utils/formatters';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: UserProfile) => void;
  onLoadDemo: () => void;
}

const ALLERGEN_OPTIONS = [
  { id: 'gluten', label: 'Gluten / Wheat' },
  { id: 'dairy', label: 'Dairy / Milk' },
  { id: 'egg', label: 'Eggs' },
  { id: 'peanuts', label: 'Peanuts' },
  { id: 'mustard', label: 'Mustard' },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  onLoadDemo,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState(20);
  const [goal, setGoal] = useState<NutritionGoal>('muscle_gain');
  const [diet, setDiet] = useState<DietaryType>('eggetarian');
  const [dailyBudget, setDailyBudget] = useState(250);
  const [perMealBudget, setPerMealBudget] = useState(100);
  const [preferredMealType, setPreferredMealType] = useState<MealType>('lunch');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [proteinTarget, setProteinTarget] = useState(85);

  if (!isOpen) return null;

  const toggleAllergy = (id: string) => {
    setAllergies((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    const finalProfile: UserProfile = {
      name: name.trim() || 'Student',
      age: Number(age) || 20,
      goal,
      diet,
      dailyBudget: Number(dailyBudget) || 200,
      perMealBudget: Number(perMealBudget) || 80,
      preferredMealType,
      allergies,
      dislikedIngredients: [],
      proteinTargetGrams: Number(proteinTarget) || 75,
      dailyCalorieTarget: 2200,
      isPro: false,
      onboardingCompleted: true,
    };
    onComplete(finalProfile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-charcoal-950/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-soft-lg border border-charcoal-200 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-charcoal-100 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-forest-600 flex items-center justify-center text-limeAccent-400">
              <UtensilsCrossed className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-lg font-black text-forest-900">Welcome to Foovio</span>
              <p className="text-[11px] text-charcoal-500">Eat smarter. Spend better.</p>
            </div>
          </div>

          <Badge variant="forest">Step {step} of 2</Badge>
        </div>

        {/* Quick Demo Skip Button for Presenters */}
        <div className="mb-6 p-3.5 rounded-2xl bg-forest-50 border border-forest-200/80 flex items-center justify-between gap-3">
          <div className="text-xs text-forest-900 leading-snug">
            <strong className="font-bold">Presenting or evaluating?</strong>
            <p className="text-[11px] text-forest-700">Skip setup and load Rahul's scenario instantly.</p>
          </div>
          <Button
            type="button"
            variant="lime"
            size="sm"
            onClick={onLoadDemo}
            icon={<Zap className="w-3.5 h-3.5" />}
          >
            Load Rahul Demo
          </Button>
        </div>

        <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2); } : handleFinish} className="space-y-5">
          {step === 1 ? (
            <>
              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul, Priya, Amit"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-charcoal-300 rounded-xl focus:ring-2 focus:ring-forest-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    min="16"
                    max="60"
                    required
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm border border-charcoal-300 rounded-xl focus:ring-2 focus:ring-forest-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                    Dietary Choice
                  </label>
                  <select
                    value={diet}
                    onChange={(e) => setDiet(e.target.value as DietaryType)}
                    className="w-full px-3.5 py-2.5 text-sm border border-charcoal-300 rounded-xl focus:ring-2 focus:ring-forest-500 capitalize"
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="eggetarian">Eggetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Primary Nutrition Goal
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'muscle_gain', label: 'Muscle Gain & Strength' },
                    { id: 'fat_loss', label: 'Fat Loss & High Satiety' },
                    { id: 'balanced', label: 'Balanced Student Diet' },
                    { id: 'maintenance', label: 'Weight Maintenance' },
                  ].map((g) => (
                    <button
                      type="button"
                      key={g.id}
                      onClick={() => setGoal(g.id as NutritionGoal)}
                      className={`p-2.5 rounded-xl text-xs font-bold border text-left transition-all ${
                        goal === g.id
                          ? 'bg-forest-600 text-white border-forest-600 shadow-soft-sm'
                          : 'bg-white hover:bg-cream-100 text-charcoal-800 border-charcoal-200'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Continue to Budget & Allergies
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                    Daily Food Allowance (₹)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="1000"
                    required
                    value={dailyBudget}
                    onChange={(e) => setDailyBudget(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm border border-charcoal-300 rounded-xl focus:ring-2 focus:ring-forest-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                    Per-Meal Target (₹)
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="500"
                    required
                    value={perMealBudget}
                    onChange={(e) => setPerMealBudget(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm border border-charcoal-300 rounded-xl focus:ring-2 focus:ring-forest-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                  Optional Protein Target (g/day)
                </label>
                <input
                  type="number"
                  min="30"
                  max="200"
                  value={proteinTarget}
                  onChange={(e) => setProteinTarget(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-sm border border-charcoal-300 rounded-xl focus:ring-2 focus:ring-forest-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Food Allergies & Restrictions (Strict Filter)
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALLERGEN_OPTIONS.map((allergy) => {
                    const isSelected = allergies.includes(allergy.id);
                    return (
                      <button
                        type="button"
                        key={allergy.id}
                        onClick={() => toggleAllergy(allergy.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
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

              <div className="flex justify-between pt-3 border-t border-charcoal-100">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={<CheckCircle2 className="w-4 h-4 text-limeAccent-400" />}
                >
                  Finish & Open Foovio
                </Button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
