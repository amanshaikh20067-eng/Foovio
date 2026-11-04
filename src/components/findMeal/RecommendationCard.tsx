import React, { useState } from 'react';
import { Recommendation } from '../../types/recommendation';
import { formatCalories, formatGrams, formatINR } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  CheckCircle2,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  TrendingDown,
  Dumbbell,
  Check,
} from 'lucide-react';

interface RecommendationCardProps {
  recommendation: Recommendation;
  rank: number; // 1, 2, or 3
  onSelectAndLogMeal: (rec: Recommendation) => void;
  onToggleCompare: (rec: Recommendation) => void;
  isCompared: boolean;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  rank,
  onSelectAndLogMeal,
  onToggleCompare,
  isCompared,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [loggedSuccess, setLoggedSuccess] = useState(false);

  const {
    type,
    title,
    subtitle,
    items,
    totalPrice,
    calories,
    protein,
    carbs,
    fat,
    budgetRemaining,
    goalCompatibilityScore,
    reason,
    tradeOffs,
    alternatives,
    canteenTip,
    allergenAlerts,
  } = recommendation;

  // Custom styling per recommendation type
  const isBestOverall = type === 'best_overall';
  const isBudgetFriendly = type === 'budget_friendly';
  const isProteinFocused = type === 'protein_focused';

  const handleLog = () => {
    onSelectAndLogMeal(recommendation);
    setLoggedSuccess(true);
    setTimeout(() => setLoggedSuccess(false), 2500);
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
        isBestOverall
          ? 'bg-gradient-to-b from-white to-forest-50/40 border-forest-500 shadow-soft-md ring-1 ring-forest-500/20'
          : isProteinFocused
          ? 'bg-gradient-to-b from-white to-limeAccent-50/30 border-limeAccent-400 shadow-soft-sm'
          : 'bg-white border-charcoal-200 shadow-soft-sm hover:border-charcoal-300'
      }`}
    >
      {/* Top Header Badge */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                isBestOverall
                  ? 'bg-forest-600 text-white'
                  : isProteinFocused
                  ? 'bg-limeAccent-500 text-forest-900'
                  : 'bg-charcoal-700 text-white'
              }`}
            >
              #{rank}
            </span>
            <Badge
              variant={isBestOverall ? 'forest' : isProteinFocused ? 'lime' : 'charcoal'}
              size="sm"
              icon={
                isBestOverall ? (
                  <Sparkles className="w-3 h-3 text-forest-700" />
                ) : isProteinFocused ? (
                  <Dumbbell className="w-3 h-3 text-forest-800" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-charcoal-600" />
                )
              }
            >
              {title}
            </Badge>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-forest-800">
              {goalCompatibilityScore}% Fit
            </span>
            <div className="w-12 bg-charcoal-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-forest-600 h-full rounded-full"
                style={{ width: `${goalCompatibilityScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Meal Title & Subtitle */}
        <h4 className="text-lg font-black text-charcoal-900 leading-tight mb-1">
          {items.map((i) => i.item.name).join(' + ')}
        </h4>
        <p className="text-xs text-charcoal-500 leading-snug">{subtitle}</p>

        {/* Price & Budget pill */}
        <div className="flex items-center justify-between mt-3 p-3 rounded-xl bg-cream-100/90 border border-charcoal-200/80">
          <div>
            <div className="text-xs font-semibold text-charcoal-500">Meal Cost</div>
            <div className="text-xl font-black text-charcoal-900">{formatINR(totalPrice)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold text-charcoal-500">Remaining Budget</div>
            <div
              className={`text-sm font-black ${
                budgetRemaining >= 0 ? 'text-forest-700' : 'text-rose-600'
              }`}
            >
              {budgetRemaining >= 0 ? `+${formatINR(budgetRemaining)} saved` : 'Exact Budget'}
            </div>
          </div>
        </div>

        {/* Nutritional Breakdown Highlights */}
        <div className="grid grid-cols-4 gap-2 my-3 text-center">
          <div className="p-2 rounded-lg bg-cream-200/50">
            <div className="text-[10px] uppercase font-bold text-charcoal-500">Calories</div>
            <div className="text-xs font-extrabold text-charcoal-900">{formatCalories(calories)}</div>
          </div>
          <div className="p-2 rounded-lg bg-forest-50 border border-forest-100">
            <div className="text-[10px] uppercase font-bold text-forest-800">Protein</div>
            <div className="text-xs font-black text-forest-900">{formatGrams(protein)}</div>
          </div>
          <div className="p-2 rounded-lg bg-cream-200/50">
            <div className="text-[10px] uppercase font-bold text-charcoal-500">Carbs</div>
            <div className="text-xs font-bold text-charcoal-800">{formatGrams(carbs)}</div>
          </div>
          <div className="p-2 rounded-lg bg-cream-200/50">
            <div className="text-[10px] uppercase font-bold text-charcoal-500">Fat</div>
            <div className="text-xs font-bold text-charcoal-800">{formatGrams(fat)}</div>
          </div>
        </div>

        {/* Meal Items Breakdown list */}
        <div className="space-y-1.5 mb-3 border-t border-charcoal-100 pt-3">
          <div className="text-[11px] font-bold text-charcoal-600 uppercase tracking-wider">
            Items Included:
          </div>
          {items.map((i, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs text-charcoal-800">
              <span className="font-semibold">
                {i.quantity}x {i.item.name}{' '}
                <span className="text-[10px] font-normal text-charcoal-500">
                  ({i.item.servingSize})
                </span>
              </span>
              <span className="font-bold text-charcoal-900">{formatINR(i.item.price * i.quantity)}</span>
            </div>
          ))}
        </div>

        {/* Transparent Rationale Box */}
        <div className="p-3 rounded-xl bg-forest-50/80 border border-forest-100 text-xs text-forest-900 leading-relaxed mb-3">
          <div className="font-bold flex items-center gap-1 text-forest-800 mb-0.5">
            <Lightbulb className="w-3.5 h-3.5 text-forest-600 shrink-0" />
            <span>Why this choice:</span>
          </div>
          {reason}
        </div>

        {/* Expandable Trade-offs & Alternatives */}
        {showDetails && (
          <div className="space-y-2 mb-3 pt-2 border-t border-charcoal-100 text-xs animate-in fade-in duration-200">
            <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-amber-900">
              <div className="font-bold flex items-center gap-1 mb-0.5 text-amber-800">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Trade-offs & Considerations:</span>
              </div>
              <p className="leading-snug">{tradeOffs}</p>
            </div>

            {alternatives && alternatives.length > 0 && (
              <div className="p-2.5 rounded-lg bg-cream-200/60 border border-charcoal-200 text-charcoal-800">
                <div className="font-bold text-charcoal-900 mb-0.5">Suggested Alternative:</div>
                <p className="leading-snug">{alternatives[0]}</p>
              </div>
            )}

            {canteenTip && (
              <div className="text-[11px] text-charcoal-600 italic">
                💡 Canteen tip: {canteenTip}
              </div>
            )}
          </div>
        )}

        {/* Toggle Details button */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-charcoal-500 hover:text-charcoal-800 font-semibold flex items-center gap-1 w-full justify-center py-1 transition-colors"
        >
          <span>{showDetails ? 'Hide details' : 'View trade-offs & alternatives'}</span>
          {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Card Action Controls Footer */}
      <div className="p-4 pt-2 border-t border-charcoal-100/80 bg-white/50 flex items-center gap-2">
        <Button
          variant={isBestOverall ? 'primary' : 'secondary'}
          size="md"
          className="flex-1"
          onClick={handleLog}
          icon={loggedSuccess ? <Check className="w-4 h-4 text-limeAccent-400" /> : <CheckCircle2 className="w-4 h-4" />}
        >
          {loggedSuccess ? 'Meal Logged!' : 'Choose & Log Meal'}
        </Button>

        <Button
          variant={isCompared ? 'lime' : 'outline'}
          size="md"
          onClick={() => onToggleCompare(recommendation)}
          title="Compare this recommendation side-by-side"
        >
          {isCompared ? 'Compared' : 'Compare'}
        </Button>
      </div>
    </div>
  );
};
