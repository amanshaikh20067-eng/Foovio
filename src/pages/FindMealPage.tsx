import React, { useState, useMemo } from 'react';
import { UserProfile, NutritionGoal } from '../types/user';
import { FoodItem, DietaryType, MealType } from '../types/food';
import { Recommendation } from '../types/recommendation';
import { generateRecommendations } from '../services/recommendationEngine';
import { MealInputForm } from '../components/findMeal/MealInputForm';
import { RecommendationCard } from '../components/findMeal/RecommendationCard';
import { CanteenMenuSelector } from '../components/findMeal/CanteenMenuSelector';
import { ComparisonModal } from '../components/findMeal/ComparisonModal';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { formatINR } from '../utils/formatters';
import {
  Compass,
  AlertCircle,
  Columns,
  CheckCircle2,
  Sliders,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface FindMealPageProps {
  userProfile: UserProfile;
  canteenMenu: FoodItem[];
  onUpdateMenu: (updated: FoodItem[]) => void;
  onLogMealFromRecommendation: (rec: Recommendation) => void;
}

export const FindMealPage: React.FC<FindMealPageProps> = ({
  userProfile,
  canteenMenu,
  onUpdateMenu,
  onLogMealFromRecommendation,
}) => {
  // Decision parameters state (initialized from user profile)
  const [budget, setBudget] = useState<number>(userProfile.perMealBudget || 100);
  const [mealType, setMealType] = useState<MealType>(userProfile.preferredMealType || 'lunch');
  const [goal, setGoal] = useState<NutritionGoal>(userProfile.goal || 'muscle_gain');
  const [diet, setDiet] = useState<DietaryType>(userProfile.diet || 'eggetarian');
  const [allergies, setAllergies] = useState<string[]>(userProfile.allergies || []);

  // UI state
  const [showMenuDrawer, setShowMenuDrawer] = useState(false);
  const [comparedRecs, setComparedRecs] = useState<Recommendation[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleToggleAllergy = (allergy: string) => {
    setAllergies((prev) =>
      prev.includes(allergy) ? prev.filter((a) => a !== allergy) : [...prev, allergy]
    );
  };

  // Real-time deterministic recommendation calculation
  const { recommendations, candidateCount, filteredCount, message } = useMemo(() => {
    return generateRecommendations({
      budget,
      mealType,
      goal,
      diet,
      allergies,
      availableFoodItems: canteenMenu,
      proteinTarget: userProfile.proteinTargetGrams,
    });
  }, [budget, mealType, goal, diet, allergies, canteenMenu, userProfile.proteinTargetGrams]);

  const handleToggleCompare = (rec: Recommendation) => {
    if (comparedRecs.some((r) => r.id === rec.id)) {
      setComparedRecs((prev) => prev.filter((r) => r.id !== rec.id));
    } else {
      setComparedRecs((prev) => [...prev, rec]);
    }
  };

  const handleSelectAndLog = (rec: Recommendation) => {
    onLogMealFromRecommendation(rec);
    setToastMessage(`Logged "${rec.items.map((i) => i.item.name).join(' + ')}" (${formatINR(rec.totalPrice)}) to your history!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-charcoal-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-charcoal-900 tracking-tight">
              Find My Meal
            </h1>
            <Badge variant="lime" size="sm">
              Live Engine
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-600">
            Real-time ranked combinations generated from active canteen inventory & student budget
          </p>
        </div>

        <div className="flex items-center gap-2">
          {comparedRecs.length > 0 && (
            <Button
              variant="lime"
              size="sm"
              onClick={() => setIsCompareModalOpen(true)}
              icon={<Columns className="w-3.5 h-3.5" />}
            >
              Compare ({comparedRecs.length})
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMenuDrawer(!showMenuDrawer)}
            icon={showMenuDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          >
            {showMenuDrawer ? 'Hide Canteen Items' : 'View / Edit Canteen Items'}
          </Button>
        </div>
      </div>

      {/* Success Toast */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-forest-600 text-white shadow-soft-md flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-limeAccent-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white/80 hover:text-white text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Collapsible Canteen Menu Customizer */}
      {showMenuDrawer && (
        <div className="animate-in fade-in duration-200">
          <CanteenMenuSelector menu={canteenMenu} onUpdateMenu={onUpdateMenu} />
        </div>
      )}

      {/* Main Two-Column Layout: Controls on Left, 3 Ranked Recs on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Decision Parameters (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <MealInputForm
            budget={budget}
            onBudgetChange={setBudget}
            mealType={mealType}
            onMealTypeChange={setMealType}
            goal={goal}
            onGoalChange={setGoal}
            diet={diet}
            onDietChange={setDiet}
            allergies={allergies}
            onToggleAllergy={handleToggleAllergy}
          />

          {/* Engine diagnostic notice */}
          <div className="p-3.5 rounded-xl bg-cream-100 border border-charcoal-200 text-xs text-charcoal-600 space-y-1">
            <div className="font-bold text-charcoal-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-forest-600" />
              <span>Deterministic Ranking Active</span>
            </div>
            <p className="text-[11px] leading-snug">
              Calculated across <strong>{candidateCount}</strong> eligible combos. Filtered out <strong>{filteredCount}</strong> items incompatible with your diet or allergens.
            </p>
          </div>
        </div>

        {/* Right Column: 3 Ranked Recommendations (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-charcoal-900">
              Ranked Meal Recommendations ({recommendations.length})
            </h2>
            <span className="text-xs text-charcoal-500 font-medium">
              Ranked by Goal Fit, Protein & Cost
            </span>
          </div>

          {message && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>{message}</span>
            </div>
          )}

          {recommendations.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-charcoal-300 bg-white">
              <Compass className="w-12 h-12 text-charcoal-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-charcoal-800">
                No matching combinations found
              </h3>
              <p className="text-xs text-charcoal-500 max-w-sm mx-auto mt-1 mb-4">
                Try increasing your meal budget or unchecking strict allergy exclusions on the left.
              </p>
              <Button variant="primary" size="sm" onClick={() => setBudget(100)}>
                Set Budget to ₹100
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {recommendations.map((rec, index) => (
                <RecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  rank={index + 1}
                  onSelectAndLogMeal={handleSelectAndLog}
                  onToggleCompare={handleToggleCompare}
                  isCompared={comparedRecs.some((r) => r.id === rec.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Comparison Modal */}
      <ComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        recommendations={comparedRecs.length > 0 ? comparedRecs : recommendations}
        onSelectMeal={handleSelectAndLog}
      />
    </div>
  );
};
