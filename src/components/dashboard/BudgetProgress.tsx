import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Wallet, IndianRupee, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

interface BudgetProgressProps {
  dailyBudget: number;
  spentToday: number;
  perMealBudget: number;
  mealsLoggedCount: number;
}

export const BudgetProgress: React.FC<BudgetProgressProps> = ({
  dailyBudget,
  spentToday,
  perMealBudget,
  mealsLoggedCount,
}) => {
  const remaining = dailyBudget - spentToday;
  const spentPercent = Math.min(100, Math.round((spentToday / Math.max(dailyBudget, 1)) * 100));

  const isOverBudget = remaining < 0;
  const isNearLimit = remaining >= 0 && remaining < perMealBudget;

  return (
    <Card variant="default">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-charcoal-900 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-forest-600" />
            <span>Today's Food Wallet</span>
          </h3>
          <p className="text-xs text-charcoal-500">Student daily allowance tracker</p>
        </div>
        <Badge variant={isOverBudget ? 'rose' : isNearLimit ? 'amber' : 'lime'}>
          {isOverBudget ? 'Budget Exceeded' : `${formatINR(remaining)} Left Today`}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4 text-center">
        <div className="p-3 rounded-xl bg-cream-200/60 border border-charcoal-100">
          <div className="text-[11px] font-semibold text-charcoal-500 uppercase tracking-wider">
            Daily Limit
          </div>
          <div className="text-lg font-black text-charcoal-900 mt-0.5">
            {formatINR(dailyBudget)}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-cream-200/60 border border-charcoal-100">
          <div className="text-[11px] font-semibold text-charcoal-500 uppercase tracking-wider">
            Spent Today
          </div>
          <div className="text-lg font-black text-forest-700 mt-0.5">
            {formatINR(spentToday)}
          </div>
        </div>

        <div
          className={`p-3 rounded-xl border ${
            isOverBudget
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : 'bg-limeAccent-50/70 border-limeAccent-200 text-forest-900'
          }`}
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider opacity-80">
            {isOverBudget ? 'Over By' : 'Remaining'}
          </div>
          <div className="text-lg font-black mt-0.5">
            {isOverBudget ? formatINR(Math.abs(remaining)) : formatINR(remaining)}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5 mb-4">
        <div className="flex justify-between text-xs text-charcoal-600 font-medium">
          <span>Spent: {spentPercent}%</span>
          <span>Target per meal: ~{formatINR(perMealBudget)}</span>
        </div>
        <div className="w-full bg-charcoal-100 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isOverBudget
                ? 'bg-rose-500'
                : isNearLimit
                ? 'bg-amber-500'
                : 'bg-forest-600'
            }`}
            style={{ width: `${Math.min(spentPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Status banner */}
      <div
        className={`p-3 rounded-xl text-xs flex items-start gap-2.5 ${
          isOverBudget
            ? 'bg-rose-50 border border-rose-200 text-rose-800'
            : isNearLimit
            ? 'bg-amber-50 border border-amber-200 text-amber-800'
            : 'bg-forest-50 border border-forest-100 text-forest-800'
        }`}
      >
        {isOverBudget ? (
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
        ) : isNearLimit ? (
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
        )}
        <div>
          {isOverBudget ? (
            <span>
              You have exceeded your daily budget by {formatINR(Math.abs(remaining))}. Consider low-cost hostel staples like dal rice or poha for dinner.
            </span>
          ) : isNearLimit ? (
            <span>
              You have {formatINR(remaining)} left. You can still get a nutritious meal like Chapati Sabzi (₹50) or Masala Omelette (₹40).
            </span>
          ) : (
            <span>
              Great job! You have {formatINR(remaining)} left for the rest of today's meals. On track for smart spending.
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};
