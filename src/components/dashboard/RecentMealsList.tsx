import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { LoggedMeal } from '../../types/history';
import { formatCalories, formatGrams, formatINR, formatTime } from '../../utils/formatters';
import { Utensils, Trash2, Clock, Sparkles } from 'lucide-react';
import { PageRoute } from '../common/Navbar';

interface RecentMealsListProps {
  todayMeals: LoggedMeal[];
  onDeleteMeal: (mealId: string) => void;
  onNavigate: (page: PageRoute) => void;
}

export const RecentMealsList: React.FC<RecentMealsListProps> = ({
  todayMeals,
  onDeleteMeal,
  onNavigate,
}) => {
  return (
    <Card variant="default">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-charcoal-900 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-forest-600" />
            <span>Today's Logged Meals</span>
          </h3>
          <p className="text-xs text-charcoal-500">Real-time breakdown of meals recorded today</p>
        </div>
        <button
          onClick={() => onNavigate('history')}
          className="text-xs font-bold text-forest-700 hover:text-forest-900 underline"
        >
          View Full History
        </button>
      </div>

      {todayMeals.length === 0 ? (
        <div className="text-center py-8 px-4 rounded-xl border border-dashed border-charcoal-200 bg-cream-50">
          <div className="w-12 h-12 rounded-full bg-cream-200 flex items-center justify-center text-charcoal-400 mx-auto mb-3">
            <Utensils className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-charcoal-800 mb-1">No meals logged yet today</h4>
          <p className="text-xs text-charcoal-500 max-w-sm mx-auto mb-4">
            Find the smartest meal option in your campus canteen right now based on your remaining budget.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('find-meal')}
            icon={<Sparkles className="w-3.5 h-3.5 text-limeAccent-400" />}
          >
            Find My Meal
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {todayMeals.map((meal) => (
            <div
              key={meal.id}
              className="p-3.5 rounded-xl border border-charcoal-200/90 bg-cream-50/60 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-charcoal-900">{meal.name}</span>
                  <Badge variant="forest" size="sm" className="capitalize text-[10px]">
                    {meal.mealType}
                  </Badge>
                  {meal.source === 'recommendation' && (
                    <Badge variant="lime" size="sm" className="text-[10px]">
                      AI Match
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-charcoal-600">
                  <span className="flex items-center gap-1 text-[11px] text-charcoal-400">
                    <Clock className="w-3 h-3" />
                    {formatTime(meal.timestamp)}
                  </span>
                  <span>•</span>
                  <span>{formatCalories(meal.totalCalories)}</span>
                  <span>•</span>
                  <span className="font-semibold text-forest-700">
                    {formatGrams(meal.totalProtein)} Protein
                  </span>
                </div>
                {meal.items.length > 0 && (
                  <div className="text-[11px] text-charcoal-500">
                    {meal.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-charcoal-100">
                <div className="text-right">
                  <div className="text-sm font-extrabold text-charcoal-900">
                    {formatINR(meal.totalPrice)}
                  </div>
                  <div className="text-[10px] text-charcoal-400">Canteen Price</div>
                </div>
                <button
                  onClick={() => onDeleteMeal(meal.id)}
                  className="p-1.5 text-charcoal-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Remove from meal history"
                  aria-label="Delete meal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
