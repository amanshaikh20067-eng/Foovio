import React, { useState } from 'react';
import { LoggedMeal } from '../types/history';
import { UserProfile } from '../types/user';
import { WeeklyNutritionChart } from '../components/history/WeeklyNutritionChart';
import { HistoryList } from '../components/history/HistoryList';
import { MealHistoryModal } from '../components/history/MealHistoryModal';
import { Badge } from '../components/common/Badge';
import { History } from 'lucide-react';

interface MealHistoryPageProps {
  userProfile: UserProfile;
  mealHistory: LoggedMeal[];
  onAddMeal: (meal: LoggedMeal) => void;
  onUpdateMeal: (meal: LoggedMeal) => void;
  onDeleteMeal: (id: string) => void;
}

export const MealHistoryPage: React.FC<MealHistoryPageProps> = ({
  userProfile,
  mealHistory,
  onAddMeal,
  onUpdateMeal,
  onDeleteMeal,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mealToEdit, setMealToEdit] = useState<LoggedMeal | null>(null);

  const handleOpenAdd = () => {
    setMealToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (meal: LoggedMeal) => {
    setMealToEdit(meal);
    setIsModalOpen(true);
  };

  const handleSaveMeal = (meal: LoggedMeal) => {
    if (mealToEdit) {
      onUpdateMeal(meal);
    } else {
      onAddMeal(meal);
    }
    setIsModalOpen(false);
    setMealToEdit(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="border-b border-charcoal-200/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-charcoal-900 tracking-tight">
              Meal History & Trends
            </h1>
            <Badge variant="forest" size="sm">
              {mealHistory.length} Recorded Meals
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-600">
            Track daily calorie consumption, protein synthesis targets, and campus canteen expenditures.
          </p>
        </div>
      </div>

      {/* 7-Day Interactive Nutrition & Spend Trends */}
      <WeeklyNutritionChart
        meals={mealHistory}
        dailyCalorieTarget={userProfile.dailyCalorieTarget || 2200}
        dailyBudget={userProfile.dailyBudget || 250}
      />

      {/* Logged Meals List with Filters, Details, Edit & Delete */}
      <HistoryList
        meals={mealHistory}
        onDeleteMeal={onDeleteMeal}
        onEditMeal={handleOpenEdit}
        onOpenAddModal={handleOpenAdd}
      />

      {/* Add / Edit Meal Modal */}
      <MealHistoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setMealToEdit(null);
        }}
        onSaveMeal={handleSaveMeal}
        initialMeal={mealToEdit}
      />
    </div>
  );
};
