import React, { useState } from 'react';
import { UserProfile, NutritionGoal } from '../types/user';
import { DietaryType, MealType } from '../types/food';
import { storageService } from '../services/storageService';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import {
  Settings,
  User,
  ShieldAlert,
  RotateCcw,
  Trash2,
  Key,
  CheckCircle2,
  Save,
  HelpCircle,
  IndianRupee,
} from 'lucide-react';
import { formatINR } from '../utils/formatters';

interface SettingsPageProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onResetDemo: () => void;
  onClearAllData: () => void;
}

const ALLERGEN_OPTIONS = [
  { id: 'gluten', label: 'Gluten / Wheat' },
  { id: 'dairy', label: 'Dairy / Milk' },
  { id: 'egg', label: 'Eggs' },
  { id: 'peanuts', label: 'Peanuts' },
  { id: 'mustard', label: 'Mustard' },
  { id: 'soy', label: 'Soy' },
];

export const SettingsPage: React.FC<SettingsPageProps> = ({
  userProfile,
  onUpdateProfile,
  onResetDemo,
  onClearAllData,
}) => {
  const [profile, setProfile] = useState<UserProfile>({ ...userProfile });
  const [apiKey, setApiKey] = useState(storageService.getGeminiApiKey());
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const handleToggleAllergy = (allergyId: string) => {
    setProfile((prev) => {
      const exists = prev.allergies.includes(allergyId);
      return {
        ...prev,
        allergies: exists
          ? prev.allergies.filter((a) => a !== allergyId)
          : [...prev.allergies, allergyId],
      };
    });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveGeminiApiKey(apiKey);
    onUpdateProfile(profile);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleConfirmClear = () => {
    onClearAllData();
    setIsClearModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header */}
      <div className="border-b border-charcoal-200/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-charcoal-900 tracking-tight">
              Settings & Profile
            </h1>
            <Badge variant="forest" size="sm">
              Preferences
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-600">
            Manage your student profile, campus budget targets, strict dietary restrictions, and API keys.
          </p>
        </div>

        {savedToast && (
          <div className="p-2.5 rounded-xl bg-forest-600 text-white text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-limeAccent-400" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* 1. Student Identity */}
        <div className="bg-white rounded-2xl border border-charcoal-200 p-6 shadow-soft-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-charcoal-100 pb-3">
            <User className="w-4 h-4 text-forest-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal-900">
              Student Identity & Diet
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                Student Name
              </label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-charcoal-300 rounded-xl focus:ring-2 focus:ring-forest-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                Age
              </label>
              <input
                type="number"
                min="16"
                max="60"
                required
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-sm border border-charcoal-300 rounded-xl focus:ring-2 focus:ring-forest-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                Dietary Preference
              </label>
              <select
                value={profile.diet}
                onChange={(e) => setProfile({ ...profile, diet: e.target.value as DietaryType })}
                className="w-full px-3.5 py-2 text-sm border border-charcoal-300 rounded-xl focus:ring-2 focus:ring-forest-500 capitalize"
              >
                <option value="veg">Vegetarian</option>
                <option value="eggetarian">Eggetarian</option>
                <option value="non-veg">Non-Vegetarian</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                Primary Nutrition Goal
              </label>
              <select
                value={profile.goal}
                onChange={(e) => setProfile({ ...profile, goal: e.target.value as NutritionGoal })}
                className="w-full px-3.5 py-2 text-sm border border-charcoal-300 rounded-xl focus:ring-2 focus:ring-forest-500"
              >
                <option value="muscle_gain">Muscle Gain & High Protein</option>
                <option value="fat_loss">Fat Loss & Calorie Deficit</option>
                <option value="balanced">Balanced Student Diet</option>
                <option value="maintenance">Weight Maintenance</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Budget & Daily Nutrition Targets */}
        <div className="bg-white rounded-2xl border border-charcoal-200 p-6 shadow-soft-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-charcoal-100 pb-3">
            <IndianRupee className="w-4 h-4 text-forest-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal-900">
              Campus Budget & Macro Targets
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                Daily Food Budget (₹)
              </label>
              <input
                type="number"
                min="50"
                max="1000"
                required
                value={profile.dailyBudget}
                onChange={(e) => setProfile({ ...profile, dailyBudget: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-sm border border-charcoal-300 rounded-xl focus:ring-2 focus:ring-forest-500"
              />
              <p className="text-[11px] text-charcoal-400 mt-1">
                Total amount you plan to spend across breakfast, lunch, snacks & dinner.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                Default Per-Meal Budget (₹)
              </label>
              <input
                type="number"
                min="20"
                max="500"
                required
                value={profile.perMealBudget}
                onChange={(e) => setProfile({ ...profile, perMealBudget: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-sm border border-charcoal-300 rounded-xl focus:ring-2 focus:ring-forest-500"
              />
              <p className="text-[11px] text-charcoal-400 mt-1">
                Starting target for the Find My Meal recommendation slider.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                Daily Protein Target (grams)
              </label>
              <input
                type="number"
                min="30"
                max="250"
                value={profile.proteinTargetGrams || 85}
                onChange={(e) =>
                  setProfile({ ...profile, proteinTargetGrams: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2 text-sm border border-charcoal-300 rounded-xl focus:ring-2 focus:ring-forest-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                Daily Calorie Target (kcal)
              </label>
              <input
                type="number"
                min="1200"
                max="4000"
                value={profile.dailyCalorieTarget || 2200}
                onChange={(e) =>
                  setProfile({ ...profile, dailyCalorieTarget: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2 text-sm border border-charcoal-300 rounded-xl focus:ring-2 focus:ring-forest-500"
              />
            </div>
          </div>
        </div>

        {/* 3. Strict Allergies & Restrictions */}
        <div className="bg-white rounded-2xl border border-charcoal-200 p-6 shadow-soft-sm space-y-3">
          <div className="flex items-center gap-2 border-b border-charcoal-100 pb-3">
            <ShieldAlert className="w-4 h-4 text-forest-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal-900">
              Strict Allergies & Exclusions
            </h3>
          </div>
          <p className="text-xs text-charcoal-500">
            Selected allergens will be strictly excluded from all recommendations generated for you.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {ALLERGEN_OPTIONS.map((allergy) => {
              const isSelected = profile.allergies.includes(allergy.id);
              return (
                <button
                  type="button"
                  key={allergy.id}
                  onClick={() => handleToggleAllergy(allergy.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
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

        {/* 4. Optional Gemini API Key (Client / Backend Integration) */}
        <div className="bg-white rounded-2xl border border-charcoal-200 p-6 shadow-soft-sm space-y-3">
          <div className="flex items-center justify-between border-b border-charcoal-100 pb-3">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-forest-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal-900">
                Google Gemini API Key (Optional)
              </h3>
            </div>
            <Badge variant="forest" size="sm">
              Live Multimodal
            </Badge>
          </div>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            Foovio operates <strong>100% offline</strong> using its deterministic campus recommendation engine and sample image analysis. If you wish to test live multimodal Gemini 1.5 Flash Vision or live chat, enter your Gemini API key below. Keys are stored locally in your browser.
          </p>

          <div>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-charcoal-300 rounded-xl focus:ring-2 focus:ring-forest-500 font-mono"
            />
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={<Save className="w-4 h-4 text-limeAccent-400" />}
          >
            Save All Preferences
          </Button>
        </div>
      </form>

      {/* Demo Management & Factory Reset */}
      <div className="bg-cream-100 rounded-2xl border border-charcoal-200 p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-charcoal-800">
          Demo Reset & Data Controls
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white border border-charcoal-200 flex flex-col justify-between space-y-3">
            <div>
              <div className="font-bold text-sm text-charcoal-900">Reset Demo Scenario</div>
              <p className="text-xs text-charcoal-500 mt-0.5">
                Restores Rahul's profile (Age 20, Eggetarian, ₹100 lunch budget, muscle gain) and standard Indian campus canteen menu.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onResetDemo}
              icon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Reset to Rahul (Demo Mode)
            </Button>
          </div>

          <div className="p-4 rounded-xl bg-white border border-rose-200 flex flex-col justify-between space-y-3">
            <div>
              <div className="font-bold text-sm text-rose-900">Clear All Local Data</div>
              <p className="text-xs text-rose-700/80 mt-0.5">
                Permanently wipes all saved meal logs, custom canteen food items, and profile preferences from your browser.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setIsClearModalOpen(true)}
              icon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Clear Local Storage
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Clearing Data */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Confirm Data Wipe"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-charcoal-600 leading-relaxed">
            Are you sure you want to clear all locally stored data? This will reset all logged meals, custom items, and profile targets to the initial setup.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setIsClearModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmClear}>
              Yes, Clear Everything
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
