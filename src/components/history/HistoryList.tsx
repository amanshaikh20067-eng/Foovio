import React, { useState } from 'react';
import { LoggedMeal } from '../../types/history';
import { MealType } from '../../types/food';
import { formatCalories, formatGrams, formatINR, formatDate, formatTime } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  Calendar,
  Clock,
  Trash2,
  Edit2,
  Utensils,
  Filter,
  Eye,
  IndianRupee,
} from 'lucide-react';
import { Modal } from '../common/Modal';

interface HistoryListProps {
  meals: LoggedMeal[];
  onDeleteMeal: (id: string) => void;
  onEditMeal: (meal: LoggedMeal) => void;
  onOpenAddModal: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  meals,
  onDeleteMeal,
  onEditMeal,
  onOpenAddModal,
}) => {
  const [filterMealType, setFilterMealType] = useState<string>('all');
  const [selectedMealForView, setSelectedMealForView] = useState<LoggedMeal | null>(null);

  const filteredMeals = meals.filter((meal) => {
    if (filterMealType === 'all') return true;
    return meal.mealType === filterMealType;
  });

  // Calculate totals of currently filtered meals
  const totalFilteredCost = filteredMeals.reduce((sum, m) => sum + m.totalPrice, 0);
  const totalFilteredCalories = filteredMeals.reduce((sum, m) => sum + m.totalCalories, 0);
  const totalFilteredProtein = filteredMeals.reduce((sum, m) => sum + m.totalProtein, 0);

  return (
    <div className="space-y-4">
      {/* Filters and Actions Bar */}
      <div className="bg-white rounded-2xl border border-charcoal-200 p-4 shadow-soft-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-charcoal-500 font-bold mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Type:
          </span>
          {['all', 'breakfast', 'lunch', 'snacks', 'dinner'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterMealType(type)}
              className={`px-3 py-1.5 rounded-lg capitalize font-bold transition-all ${
                filterMealType === type
                  ? 'bg-forest-600 text-white shadow-soft-sm'
                  : 'bg-cream-200 text-charcoal-700 hover:bg-cream-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <Button variant="primary" size="sm" onClick={onOpenAddModal}>
          + Log Custom Meal
        </Button>
      </div>

      {/* Aggregate stats banner for filtered view */}
      <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-forest-50/70 border border-forest-100 text-center text-xs">
        <div>
          <div className="text-[10px] font-bold uppercase text-forest-800">Total Spent</div>
          <div className="text-base font-black text-forest-900 mt-0.5">
            {formatINR(totalFilteredCost)}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase text-forest-800">Total Calories</div>
          <div className="text-base font-black text-forest-900 mt-0.5">
            {formatCalories(totalFilteredCalories)}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase text-forest-800">Total Protein</div>
          <div className="text-base font-black text-forest-900 mt-0.5">
            {formatGrams(totalFilteredProtein)}
          </div>
        </div>
      </div>

      {/* Meals list */}
      {filteredMeals.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-charcoal-200 bg-white">
          <Utensils className="w-10 h-10 text-charcoal-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-charcoal-800">No meals found</h4>
          <p className="text-xs text-charcoal-500 max-w-xs mx-auto mt-1 mb-4">
            No logged meals match your filter criteria.
          </p>
          <Button variant="outline" size="sm" onClick={() => setFilterMealType('all')}>
            Reset Filter
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMeals.map((meal) => (
            <div
              key={meal.id}
              className="p-4 rounded-2xl border border-charcoal-200 bg-white hover:border-forest-300 transition-all shadow-soft-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-sm text-charcoal-900">{meal.name}</span>
                  <Badge variant="forest" size="sm" className="capitalize">
                    {meal.mealType}
                  </Badge>
                  {meal.source === 'recommendation' && (
                    <Badge variant="lime" size="sm">
                      Smart Rec
                    </Badge>
                  )}
                  {meal.source === 'analysis' && (
                    <Badge variant="amber" size="sm">
                      AI Scan
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-charcoal-500 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(meal.timestamp)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatTime(meal.timestamp)}
                  </span>
                </div>

                {meal.items.length > 0 && (
                  <div className="text-xs text-charcoal-600">
                    <span className="font-medium text-charcoal-400">Items: </span>
                    {meal.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                  </div>
                )}
              </div>

              {/* Nutrition and Price side */}
              <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-charcoal-100">
                <div className="text-left sm:text-right">
                  <div className="text-base font-black text-charcoal-900">
                    {formatINR(meal.totalPrice)}
                  </div>
                  <div className="text-xs text-charcoal-600 font-medium">
                    {formatCalories(meal.totalCalories)} •{' '}
                    <span className="text-forest-700 font-bold">
                      {formatGrams(meal.totalProtein)} P
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedMealForView(meal)}
                    className="p-2 text-charcoal-500 hover:text-charcoal-900 hover:bg-cream-200 rounded-lg transition-colors"
                    title="View details"
                    aria-label="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEditMeal(meal)}
                    className="p-2 text-charcoal-500 hover:text-forest-700 hover:bg-forest-50 rounded-lg transition-colors"
                    title="Edit meal"
                    aria-label="Edit meal"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteMeal(meal.id)}
                    className="p-2 text-charcoal-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete meal"
                    aria-label="Delete meal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Meal Details Modal */}
      {selectedMealForView && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedMealForView(null)}
          title="Meal Details"
          maxWidth="md"
        >
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-black text-charcoal-900">
                {selectedMealForView.name}
              </h4>
              <div className="flex items-center gap-2 text-xs text-charcoal-500 mt-1">
                <span>{formatDate(selectedMealForView.timestamp)}</span>
                <span>•</span>
                <span>{formatTime(selectedMealForView.timestamp)}</span>
                <span>•</span>
                <span className="capitalize font-bold text-forest-700">
                  {selectedMealForView.mealType}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center p-3 rounded-xl bg-cream-100 border border-charcoal-200">
              <div>
                <div className="text-[10px] font-bold text-charcoal-500">Price</div>
                <div className="text-sm font-black text-charcoal-900">
                  {formatINR(selectedMealForView.totalPrice)}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-charcoal-500">Calories</div>
                <div className="text-sm font-black text-charcoal-900">
                  {formatCalories(selectedMealForView.totalCalories)}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-forest-700">Protein</div>
                <div className="text-sm font-black text-forest-800">
                  {formatGrams(selectedMealForView.totalProtein)}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-charcoal-500">Carbs / Fat</div>
                <div className="text-xs font-bold text-charcoal-800 mt-0.5">
                  {formatGrams(selectedMealForView.totalCarbs)} / {formatGrams(selectedMealForView.totalFat)}
                </div>
              </div>
            </div>

            {selectedMealForView.items.length > 0 && (
              <div>
                <div className="text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-2">
                  Items List:
                </div>
                <div className="space-y-1.5 divide-y divide-charcoal-100 text-xs">
                  {selectedMealForView.items.map((item, idx) => (
                    <div key={idx} className="pt-1.5 flex justify-between">
                      <span className="font-semibold text-charcoal-800">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="text-charcoal-600">
                        {item.calories * item.quantity} kcal • {item.protein * item.quantity}g P • {formatINR(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedMealForView.notes && (
              <div className="p-3 rounded-xl bg-cream-50 text-xs text-charcoal-600 italic">
                Notes: {selectedMealForView.notes}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button variant="secondary" size="md" onClick={() => setSelectedMealForView(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
