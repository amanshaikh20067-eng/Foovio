import React, { useState, useEffect } from 'react';
import { PageRoute, Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { FindMealPage } from './pages/FindMealPage';
import { AnalyzeFoodPage } from './pages/AnalyzeFoodPage';
import { MealHistoryPage } from './pages/MealHistoryPage';
import { AskFoovioPage } from './pages/AskFoovioPage';
import { PremiumPage } from './pages/PremiumPage';
import { SettingsPage } from './pages/SettingsPage';
import { OnboardingModal } from './pages/OnboardingModal';
import { MealHistoryModal } from './components/history/MealHistoryModal';
import { storageService } from './services/storageService';
import { UserProfile } from './types/user';
import { FoodItem } from './types/food';
import { LoggedMeal } from './types/history';
import { Recommendation } from './types/recommendation';
import { DEMO_USER_PROFILE } from './data/initialUser';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageRoute>('landing');
  const [userProfile, setUserProfile] = useState<UserProfile>(() => storageService.getUserProfile());
  const [canteenMenu, setCanteenMenu] = useState<FoodItem[]>(() => storageService.getCanteenMenu());
  const [mealHistory, setMealHistory] = useState<LoggedMeal[]>(() => storageService.getMealHistory());
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [toastBanner, setToastBanner] = useState<string | null>(null);

  // Check if onboarding is needed
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const navigateTo = (page: PageRoute) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (msg: string) => {
    setToastBanner(msg);
    setTimeout(() => setToastBanner(null), 3500);
  };

  // Trigger Demo Mode: Rahul (Eggetarian, ₹100 Lunch, Muscle Gain)
  const handleTriggerDemo = () => {
    const { profile, menu, history } = storageService.resetToDemo();
    setUserProfile(profile);
    setCanteenMenu(menu);
    setMealHistory(history);
    setIsOnboardingOpen(false);
    navigateTo('dashboard');
    showToast('Loaded Demo: Rahul Sharma (Eggetarian, ₹100 Lunch Budget, Muscle Gain)');
  };

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    storageService.saveUserProfile(newProfile);
  };

  const handleUpdateMenu = (newMenu: FoodItem[]) => {
    setCanteenMenu(newMenu);
    storageService.saveCanteenMenu(newMenu);
  };

  const handleAddMeal = (newMeal: LoggedMeal) => {
    const updated = storageService.addMeal(newMeal);
    setMealHistory(updated);
  };

  const handleUpdateMeal = (updatedMeal: LoggedMeal) => {
    const updated = storageService.updateMeal(updatedMeal);
    setMealHistory(updated);
  };

  const handleDeleteMeal = (mealId: string) => {
    const updated = storageService.deleteMeal(mealId);
    setMealHistory(updated);
    showToast('Meal removed from log');
  };

  const handleLogMealFromRecommendation = (rec: Recommendation) => {
    const newMeal: LoggedMeal = {
      id: `rec_meal_${Date.now()}`,
      timestamp: new Date().toISOString(),
      mealType: userProfile.preferredMealType || 'lunch',
      name: rec.items.map((i) => i.item.name).join(' + '),
      items: rec.items.map((i) => ({
        id: i.item.id,
        name: i.item.name,
        quantity: i.quantity,
        servingSize: i.item.servingSize,
        price: i.item.price,
        calories: i.item.calories,
        protein: i.item.protein,
        carbs: i.item.carbs,
        fat: i.item.fat,
      })),
      totalPrice: rec.totalPrice,
      totalCalories: rec.calories,
      totalProtein: rec.protein,
      totalCarbs: rec.carbs,
      totalFat: rec.fat,
      notes: `Ranked Pick: ${rec.title}`,
      source: 'recommendation',
    };

    handleAddMeal(newMeal);
  };

  const handleClearAllData = () => {
    storageService.clearAllData();
    setUserProfile({
      name: '',
      age: 20,
      goal: 'balanced',
      diet: 'veg',
      dailyBudget: 200,
      perMealBudget: 80,
      allergies: [],
      dislikedIngredients: [],
      preferredMealType: 'lunch',
      proteinTargetGrams: 60,
      dailyCalorieTarget: 2000,
      isPro: false,
      onboardingCompleted: false,
    });
    setMealHistory([]);
    setCanteenMenu(storageService.getCanteenMenu());
    navigateTo('landing');
    showToast('Local application storage cleared');
  };

  const handleSimulatedUpgrade = () => {
    const updated = { ...userProfile, isPro: true };
    handleUpdateProfile(updated);
    showToast('Foovio Pro Demo Activated! All premium comparison features unlocked.');
  };

  const handleDowngradeToFree = () => {
    const updated = { ...userProfile, isPro: false };
    handleUpdateProfile(updated);
    showToast('Switched back to Free Tier');
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 text-charcoal-900 selection:bg-forest-100 selection:text-forest-900">
      {/* Global Top Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateTo}
        onTriggerDemo={handleTriggerDemo}
        userName={userProfile.name}
        isPro={userProfile.isPro}
      />

      {/* Global Toast Alert */}
      {toastBanner && (
        <div className="fixed bottom-6 right-6 z-50 bg-forest-800 text-white px-5 py-3 rounded-2xl shadow-soft-lg border border-forest-600 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <span className="text-xs font-bold">{toastBanner}</span>
          <button
            onClick={() => setToastBanner(null)}
            className="text-forest-300 hover:text-white text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Active Page Body */}
      <main className="flex-1">
        {currentPage === 'landing' && (
          <LandingPage
            onNavigate={navigateTo}
            onTriggerDemo={handleTriggerDemo}
          />
        )}

        {currentPage === 'dashboard' && (
          <DashboardPage
            userProfile={userProfile}
            mealHistory={mealHistory}
            onNavigate={navigateTo}
            onDeleteMeal={handleDeleteMeal}
            onOpenManualLog={() => setIsManualModalOpen(true)}
          />
        )}

        {currentPage === 'find-meal' && (
          <FindMealPage
            userProfile={userProfile}
            canteenMenu={canteenMenu}
            onUpdateMenu={handleUpdateMenu}
            onLogMealFromRecommendation={handleLogMealFromRecommendation}
          />
        )}

        {currentPage === 'analyze' && (
          <AnalyzeFoodPage onAddMealToHistory={handleAddMeal} />
        )}

        {currentPage === 'history' && (
          <MealHistoryPage
            userProfile={userProfile}
            mealHistory={mealHistory}
            onAddMeal={handleAddMeal}
            onUpdateMeal={handleUpdateMeal}
            onDeleteMeal={handleDeleteMeal}
          />
        )}

        {currentPage === 'chat' && <AskFoovioPage />}

        {currentPage === 'premium' && (
          <PremiumPage
            isPro={!!userProfile.isPro}
            onUpgradeConfirmed={handleSimulatedUpgrade}
            onDowngradeToFree={handleDowngradeToFree}
          />
        )}

        {currentPage === 'settings' && (
          <SettingsPage
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onResetDemo={handleTriggerDemo}
            onClearAllData={handleClearAllData}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Manual Meal Log Modal (accessible anywhere via dashboard quick action) */}
      <MealHistoryModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onSaveMeal={handleAddMeal}
      />

      {/* Onboarding Modal for New Visitors */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={(p) => {
          handleUpdateProfile(p);
          setIsOnboardingOpen(false);
          navigateTo('dashboard');
        }}
        onLoadDemo={handleTriggerDemo}
      />
    </div>
  );
};
export default App;
