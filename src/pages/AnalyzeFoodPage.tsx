import React, { useState } from 'react';
import { ImageUploader } from '../components/analyze/ImageUploader';
import { DetectedFoodResult } from '../components/analyze/DetectedFoodResult';
import {
  analyzeFoodImage,
  AnalysisResult,
  DetectedFoodItem,
  SAMPLE_PRESETS,
} from '../services/foodAnalysisService';
import { LoggedMeal } from '../types/history';
import { Badge } from '../components/common/Badge';
import { Camera, Sparkles, CheckCircle2 } from 'lucide-react';
import { formatINR } from '../utils/formatters';

interface AnalyzeFoodPageProps {
  onAddMealToHistory: (meal: LoggedMeal) => void;
}

export const AnalyzeFoodPage: React.FC<AnalyzeFoodPageProps> = ({
  onAddMealToHistory,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleImageSelected = async (
    base64: string,
    description: string,
    fileName?: string
  ) => {
    setIsLoading(true);
    setToastMessage(null);
    try {
      const result = await analyzeFoodImage(base64, description, fileName);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Image analysis error', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSamplePreset = (presetId: string) => {
    const preset = SAMPLE_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setAnalysisResult({ ...preset.presetData });
    }
  };

  const handleSaveMealToHistory = (
    mealName: string,
    items: DetectedFoodItem[],
    notes?: string
  ) => {
    const totalCalories = items.reduce((sum, i) => sum + i.calories * i.quantity, 0);
    const totalProtein = Number(items.reduce((sum, i) => sum + i.protein * i.quantity, 0).toFixed(1));
    const totalCarbs = Number(items.reduce((sum, i) => sum + i.carbs * i.quantity, 0).toFixed(1));
    const totalFat = Number(items.reduce((sum, i) => sum + i.fat * i.quantity, 0).toFixed(1));
    const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const loggedMeal: LoggedMeal = {
      id: `analysis_meal_${Date.now()}`,
      timestamp: new Date().toISOString(),
      mealType: 'lunch',
      name: mealName,
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        servingSize: i.servingSize,
        price: i.price,
        calories: i.calories,
        protein: i.protein,
        carbs: i.carbs,
        fat: i.fat,
      })),
      totalPrice,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      notes: notes || 'Logged via Visual Plate Scanner',
      source: 'analysis',
    };

    onAddMealToHistory(loggedMeal);
    setToastMessage(`Saved "${mealName}" (${formatINR(totalPrice)}) to your meal history!`);
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setToastMessage(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="border-b border-charcoal-200/80 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal-900 tracking-tight">
            AI Food Plate Scanner
          </h1>
          <Badge variant="forest" size="sm">
            Multimodal
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-charcoal-600">
          Upload or capture a photo of your campus canteen tray to detect meal items, estimate macronutrients, and review portion uncertainties.
        </p>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-2xl bg-forest-600 text-white shadow-soft-md flex items-center justify-between gap-3 animate-in fade-in duration-300">
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

      {/* Main View: Upload vs Result */}
      {!analysisResult ? (
        <ImageUploader
          onImageSelected={handleImageSelected}
          isLoading={isLoading}
          onSelectSamplePreset={handleSelectSamplePreset}
        />
      ) : (
        <DetectedFoodResult
          result={analysisResult}
          onSaveMealToHistory={handleSaveMealToHistory}
          onReset={handleReset}
        />
      )}
    </div>
  );
};
