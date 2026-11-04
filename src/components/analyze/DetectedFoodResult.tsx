import React, { useState } from 'react';
import { AnalysisResult, DetectedFoodItem } from '../../services/foodAnalysisService';
import { formatCalories, formatGrams, formatINR } from '../../utils/formatters';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  Trash2,
  Plus,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { Modal } from '../common/Modal';

interface DetectedFoodResultProps {
  result: AnalysisResult;
  onSaveMealToHistory: (
    mealName: string,
    items: DetectedFoodItem[],
    notes?: string
  ) => void;
  onReset: () => void;
}

export const DetectedFoodResult: React.FC<DetectedFoodResultProps> = ({
  result,
  onSaveMealToHistory,
  onReset,
}) => {
  const [items, setItems] = useState<DetectedFoodItem[]>(result.detectedItems);
  const [mealName, setMealName] = useState(result.mealName);
  const [isEditingMealName, setIsEditingMealName] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Recalculate totals on the fly if user edited items
  const totalCalories = items.reduce((sum, i) => sum + i.calories * i.quantity, 0);
  const totalProtein = Number(items.reduce((sum, i) => sum + i.protein * i.quantity, 0).toFixed(1));
  const totalCarbs = Number(items.reduce((sum, i) => sum + i.carbs * i.quantity, 0).toFixed(1));
  const totalFat = Number(items.reduce((sum, i) => sum + i.fat * i.quantity, 0).toFixed(1));
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleUpdateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleConfirmSave = () => {
    onSaveMealToHistory(mealName, items, `Vision Engine: ${result.mode}`);
    setSaveSuccess(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-charcoal-200 p-6 shadow-soft-sm space-y-6 animate-in fade-in duration-300">
      {/* Header Mode Alert */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-charcoal-100 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-black text-charcoal-900">{mealName}</h3>
            <button
              onClick={() => setIsEditingMealName(!isEditingMealName)}
              className="text-charcoal-400 hover:text-charcoal-700 p-1"
              title="Edit meal name"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-charcoal-500">
            Detected foods & estimated macronutrients from image analysis
          </p>
        </div>

        <div>
          {result.mode === 'live_ai' ? (
            <Badge variant="forest" size="md" icon={<Sparkles className="w-3.5 h-3.5 text-limeAccent-400" />}>
              Live Gemini 1.5 Flash Vision
            </Badge>
          ) : (
            <Badge variant="amber" size="md" icon={<HelpCircle className="w-3.5 h-3.5" />}>
              Sample Analysis Mode (Deterministic Engine)
            </Badge>
          )}
        </div>
      </div>

      {isEditingMealName && (
        <div className="flex gap-2">
          <input
            type="text"
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            className="flex-1 px-3 py-1.5 text-sm border border-charcoal-300 rounded-xl"
            placeholder="Edit meal name"
          />
          <Button size="sm" variant="secondary" onClick={() => setIsEditingMealName(false)}>
            Done
          </Button>
        </div>
      )}

      {/* Portion Uncertainty Callout */}
      <div className="p-4 rounded-xl bg-cream-200/60 border border-charcoal-200 text-xs">
        <div className="flex items-center justify-between font-bold text-charcoal-900 mb-1">
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Portion-Size Uncertainty
          </span>
          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px]">
            ±{result.portionUncertainty.percentage}% Variance
          </span>
        </div>
        <p className="text-charcoal-600 leading-snug">
          {result.portionUncertainty.reason}
        </p>
      </div>

      {/* Macro Summary Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3 rounded-xl bg-forest-50 border border-forest-100">
          <div className="text-[10px] uppercase font-bold text-forest-800">Total Calories</div>
          <div className="text-lg font-black text-forest-900 mt-0.5">
            {formatCalories(totalCalories)}
          </div>
          <div className="text-[10px] text-forest-700">±{Math.round(totalCalories * (result.portionUncertainty.percentage / 100))} kcal</div>
        </div>

        <div className="p-3 rounded-xl bg-limeAccent-50 border border-limeAccent-200">
          <div className="text-[10px] uppercase font-bold text-forest-900">Total Protein</div>
          <div className="text-lg font-black text-forest-900 mt-0.5">
            {formatGrams(totalProtein)}
          </div>
          <div className="text-[10px] text-forest-700 font-medium">Muscle Synthesis</div>
        </div>

        <div className="p-3 rounded-xl bg-cream-200/60 border border-charcoal-200">
          <div className="text-[10px] uppercase font-bold text-charcoal-600">Carbs / Fat</div>
          <div className="text-base font-extrabold text-charcoal-900 mt-0.5">
            {formatGrams(totalCarbs)} / {formatGrams(totalFat)}
          </div>
          <div className="text-[10px] text-charcoal-500">Sustained energy</div>
        </div>

        <div className="p-3 rounded-xl bg-cream-200/60 border border-charcoal-200">
          <div className="text-[10px] uppercase font-bold text-charcoal-600">Estimated Price</div>
          <div className="text-lg font-black text-charcoal-900 mt-0.5">
            {formatINR(totalPrice)}
          </div>
          <div className="text-[10px] text-charcoal-500">Canteen average</div>
        </div>
      </div>

      {/* Detected Food Items List (Editable) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-charcoal-700 uppercase tracking-wider">
          <span>Detected Plate Items ({items.length})</span>
          <span className="text-[11px] text-charcoal-500 font-normal">
            Adjust quantities if needed
          </span>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl border border-charcoal-200 bg-white hover:border-forest-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-charcoal-900">{item.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-forest-100 text-forest-800 rounded font-semibold">
                    {Math.round(item.confidence * 100)}% Match
                  </span>
                </div>
                <div className="text-xs text-charcoal-500">{item.servingSize}</div>
                <div className="text-xs text-charcoal-600">
                  {item.calories * item.quantity} kcal • {item.protein * item.quantity}g Protein • {formatINR(item.price * item.quantity)}
                </div>
              </div>

              {/* Quantity Controls & Remove */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <div className="flex items-center border border-charcoal-200 rounded-lg overflow-hidden bg-cream-100">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, -1)}
                    className="px-2.5 py-1 text-xs font-bold text-charcoal-700 hover:bg-cream-300"
                  >
                    -
                  </button>
                  <span className="px-2 py-1 text-xs font-black text-charcoal-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, 1)}
                    className="px-2.5 py-1 text-xs font-bold text-charcoal-700 hover:bg-cream-300"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-1.5 text-charcoal-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nutritional Insights */}
      {result.nutritionalInsights && result.nutritionalInsights.length > 0 && (
        <div className="p-3.5 rounded-xl bg-forest-50/70 border border-forest-100 text-xs space-y-1">
          <div className="font-bold text-forest-900 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-forest-700" />
            <span>Nutritional Insights:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-forest-800">
            {result.nutritionalInsights.map((ins, i) => (
              <li key={i}>{ins}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Confirmation & Save CTA */}
      <div className="pt-2 border-t border-charcoal-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <Button variant="secondary" size="md" onClick={onReset} className="w-full sm:w-auto">
          Scan Another Photo
        </Button>

        <Button
          variant="primary"
          size="lg"
          onClick={handleConfirmSave}
          disabled={saveSuccess || items.length === 0}
          icon={saveSuccess ? <CheckCircle2 className="w-4 h-4 text-limeAccent-400" /> : <Sparkles className="w-4 h-4" />}
          className="w-full sm:w-auto"
        >
          {saveSuccess ? 'Meal Saved to History!' : 'Confirm & Save to Meal History'}
        </Button>
      </div>
    </div>
  );
};
