import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Flame, Beef, Wheat, Droplets, Target } from 'lucide-react';
import { formatCalories, formatGrams } from '../../utils/formatters';
import { getMacroPercentages } from '../../utils/nutrition';

interface NutritionSummaryCardProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  calorieTarget: number;
  proteinTarget: number;
  goal: string;
}

export const NutritionSummaryCard: React.FC<NutritionSummaryCardProps> = ({
  calories,
  protein,
  carbs,
  fat,
  calorieTarget,
  proteinTarget,
  goal,
}) => {
  const calPercent = Math.min(100, Math.round((calories / Math.max(calorieTarget, 1)) * 100));
  const proteinPercent = Math.min(100, Math.round((protein / Math.max(proteinTarget, 1)) * 100));
  const { proteinPct, carbsPct, fatPct } = getMacroPercentages(protein, carbs, fat);

  return (
    <Card variant="default" className="relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-charcoal-900 flex items-center gap-2">
            <Target className="w-4 h-4 text-forest-600" />
            <span>Today's Nutrition Intake</span>
          </h3>
          <p className="text-xs text-charcoal-500">Based on your verified logged meals today</p>
        </div>
        <Badge variant={proteinPercent >= 80 ? 'lime' : 'forest'}>
          {proteinPercent >= 100 ? 'Protein Goal Met!' : `${proteinPercent}% Protein Target`}
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {/* Calories Block */}
        <div className="p-4 rounded-xl bg-forest-50/70 border border-forest-100 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-forest-800 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-forest-600" /> Calories
            </span>
            <span className="text-xs text-forest-700 font-medium">
              Target: {formatCalories(calorieTarget)}
            </span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-black text-forest-900">
              {formatCalories(calories)}
            </div>
            <div className="text-xs text-forest-700">
              {calorieTarget - calories > 0
                ? `${formatCalories(calorieTarget - calories)} remaining`
                : `${formatCalories(calories - calorieTarget)} over target`}
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-forest-200/70 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                calPercent > 100 ? 'bg-amber-500' : 'bg-forest-600'
              }`}
              style={{ width: `${Math.min(calPercent, 100)}%` }}
            />
          </div>
        </div>

        {/* Protein Block */}
        <div className="p-4 rounded-xl bg-limeAccent-50/70 border border-limeAccent-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-forest-900 uppercase tracking-wider flex items-center gap-1.5">
              <Beef className="w-4 h-4 text-forest-700" /> Protein Focus
            </span>
            <span className="text-xs text-forest-700 font-medium">
              Target: {formatGrams(proteinTarget)}
            </span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-black text-forest-900">
              {formatGrams(protein)}
            </div>
            <div className="text-xs text-forest-700 font-medium">
              {protein >= proteinTarget
                ? 'Target achieved!'
                : `${formatGrams(proteinTarget - protein)} needed today`}
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-limeAccent-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-forest-600 transition-all duration-500 rounded-full"
              style={{ width: `${proteinPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Macronutrient breakdown */}
      <div className="border-t border-charcoal-100 pt-4">
        <div className="text-xs font-bold text-charcoal-700 mb-2 flex items-center justify-between">
          <span>Macronutrient Balance</span>
          <span className="text-[11px] text-charcoal-500 font-normal">
            Ratio: {proteinPct}% P • {carbsPct}% C • {fatPct}% F
          </span>
        </div>

        {/* Stacked macro bar */}
        <div className="w-full h-3 rounded-full bg-charcoal-100 flex overflow-hidden mb-3">
          <div
            className="bg-forest-600 transition-all duration-300"
            style={{ width: `${proteinPct}%` }}
            title={`Protein: ${proteinPct}%`}
          />
          <div
            className="bg-amber-400 transition-all duration-300"
            style={{ width: `${carbsPct}%` }}
            title={`Carbohydrates: ${carbsPct}%`}
          />
          <div
            className="bg-rose-400 transition-all duration-300"
            style={{ width: `${fatPct}%` }}
            title={`Fat: ${fatPct}%`}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 rounded-lg bg-cream-200/60 border border-charcoal-100">
            <div className="flex items-center justify-center gap-1 font-semibold text-forest-800">
              <span className="w-2 h-2 rounded-full bg-forest-600 inline-block" />
              <span>Protein</span>
            </div>
            <div className="font-bold text-charcoal-900 mt-0.5">{formatGrams(protein)}</div>
          </div>
          <div className="p-2 rounded-lg bg-cream-200/60 border border-charcoal-100">
            <div className="flex items-center justify-center gap-1 font-semibold text-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              <span>Carbs</span>
            </div>
            <div className="font-bold text-charcoal-900 mt-0.5">{formatGrams(carbs)}</div>
          </div>
          <div className="p-2 rounded-lg bg-cream-200/60 border border-charcoal-100">
            <div className="flex items-center justify-center gap-1 font-semibold text-rose-800">
              <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />
              <span>Fat</span>
            </div>
            <div className="font-bold text-charcoal-900 mt-0.5">{formatGrams(fat)}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
