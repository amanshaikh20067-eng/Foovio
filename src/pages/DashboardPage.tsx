import React from 'react';
import { UserProfile } from '../types/user';
import { LoggedMeal } from '../types/history';
import { PageRoute } from '../components/common/Navbar';
import { NutritionSummaryCard } from '../components/dashboard/NutritionSummaryCard';
import { BudgetProgress } from '../components/dashboard/BudgetProgress';
import { QuickActions } from '../components/dashboard/QuickActions';
import { RecentMealsList } from '../components/dashboard/RecentMealsList';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { getTodayMeals, calculateDailyTotals } from '../utils/nutrition';
import { formatINR } from '../utils/formatters';
import {
  Sparkles,
  Compass,
  ArrowRight,
  TrendingUp,
  BookmarkCheck,
  Zap,
} from 'lucide-react';

interface DashboardPageProps {
  userProfile: UserProfile;
  mealHistory: LoggedMeal[];
  onNavigate: (page: PageRoute) => void;
  onDeleteMeal: (mealId: string) => void;
  onOpenManualLog: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  userProfile,
  mealHistory,
  onNavigate,
  onDeleteMeal,
  onOpenManualLog,
}) => {
  // Real application state calculations
  const todayMeals = getTodayMeals(mealHistory);
  const todayTotals = calculateDailyTotals(todayMeals);

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getGoalLabel = (goal: string) => {
    switch (goal) {
      case 'muscle_gain':
        return 'Muscle Gain & Strength';
      case 'fat_loss':
        return 'Fat Loss & High Satiety';
      case 'balanced':
        return 'Balanced Student Nutrition';
      case 'maintenance':
        return 'Weight Maintenance';
      default:
        return goal;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Personalized Welcome Header */}
      <div className="bg-gradient-to-r from-forest-700 to-forest-900 rounded-3xl p-6 sm:p-8 text-white shadow-soft-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="lime" size="sm">
              Student Nutrition Portal
            </Badge>
            <span className="text-xs text-forest-200">
              {userProfile.diet.toUpperCase()} • Age {userProfile.age}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {getGreeting()}, {userProfile.name || 'Student'}! 👋
          </h1>

          <p className="text-xs sm:text-sm text-forest-100 leading-relaxed">
            Your current priority is <strong>{getGoalLabel(userProfile.goal)}</strong> with a daily campus allowance of <strong>{formatINR(userProfile.dailyBudget)}</strong> (~{formatINR(userProfile.perMealBudget)}/meal).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 z-10">
          <Button
            variant="lime"
            size="md"
            onClick={() => onNavigate('find-meal')}
            icon={<Compass className="w-4 h-4 text-forest-900" />}
          >
            Find My Next Meal
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={() => onNavigate('settings')}
            className="border-forest-300 text-white hover:bg-forest-800"
          >
            Edit Profile
          </Button>
        </div>

        {/* Decorative background circle */}
        <div className="absolute right-0 top-0 translate-x-1/3 -translate-y-1/3 w-72 h-72 rounded-full bg-forest-500/20 pointer-events-none blur-2xl" />
      </div>

      {/* Quick Action Navigation Grid */}
      <QuickActions onNavigate={onNavigate} onOpenManualLog={onOpenManualLog} />

      {/* Key Real-time Metrics: Nutrition Intake & Daily Budget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real Nutrition intake */}
        <NutritionSummaryCard
          calories={todayTotals.calories}
          protein={todayTotals.protein}
          carbs={todayTotals.carbs}
          fat={todayTotals.fat}
          calorieTarget={userProfile.dailyCalorieTarget || 2200}
          proteinTarget={userProfile.proteinTargetGrams || 85}
          goal={userProfile.goal}
        />

        {/* Real Student Wallet / Budget */}
        <BudgetProgress
          dailyBudget={userProfile.dailyBudget}
          spentToday={todayTotals.spent}
          perMealBudget={userProfile.perMealBudget}
          mealsLoggedCount={todayTotals.mealCount}
        />
      </div>

      {/* Today's Logged Meals Breakdown */}
      <RecentMealsList
        todayMeals={todayMeals}
        onDeleteMeal={onDeleteMeal}
        onNavigate={onNavigate}
      />
    </div>
  );
};
