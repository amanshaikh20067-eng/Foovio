import React from 'react';
import { Recommendation } from '../../types/recommendation';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { formatCalories, formatGrams, formatINR } from '../../utils/formatters';
import { CheckCircle2, X } from 'lucide-react';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendations: Recommendation[];
  onSelectMeal: (rec: Recommendation) => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  recommendations,
  onSelectMeal,
}) => {
  if (recommendations.length === 0) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Compare Meal Recommendations"
      maxWidth="2xl"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-charcoal-200">
              <th className="py-3 px-3 font-bold text-charcoal-500 w-32 uppercase tracking-wider">
                Feature
              </th>
              {recommendations.map((rec, i) => (
                <th key={rec.id} className="py-3 px-3 font-bold text-charcoal-900 min-w-[180px]">
                  <div className="text-forest-700 text-[11px] uppercase tracking-wider">
                    Option #{i + 1}
                  </div>
                  <div className="text-sm font-black mt-0.5">{rec.title}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-100">
            {/* Meal Items */}
            <tr>
              <td className="py-3 px-3 font-semibold text-charcoal-700">Included Items</td>
              {recommendations.map((rec) => (
                <td key={rec.id} className="py-3 px-3 text-charcoal-900">
                  <ul className="list-disc list-inside space-y-0.5">
                    {rec.items.map((it, idx) => (
                      <li key={idx} className="leading-snug">
                        {it.quantity}x {it.item.name}
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* Price */}
            <tr className="bg-cream-50/70">
              <td className="py-3 px-3 font-semibold text-charcoal-700">Total Price</td>
              {recommendations.map((rec) => (
                <td key={rec.id} className="py-3 px-3 font-black text-sm text-charcoal-900">
                  {formatINR(rec.totalPrice)}
                </td>
              ))}
            </tr>

            {/* Budget Remaining */}
            <tr>
              <td className="py-3 px-3 font-semibold text-charcoal-700">Remaining Budget</td>
              {recommendations.map((rec) => (
                <td
                  key={rec.id}
                  className={`py-3 px-3 font-bold ${
                    rec.budgetRemaining >= 0 ? 'text-forest-700' : 'text-rose-600'
                  }`}
                >
                  +{formatINR(rec.budgetRemaining)} saved
                </td>
              ))}
            </tr>

            {/* Calories */}
            <tr className="bg-cream-50/70">
              <td className="py-3 px-3 font-semibold text-charcoal-700">Calories</td>
              {recommendations.map((rec) => (
                <td key={rec.id} className="py-3 px-3 font-bold text-charcoal-900">
                  {formatCalories(rec.calories)}
                </td>
              ))}
            </tr>

            {/* Protein */}
            <tr>
              <td className="py-3 px-3 font-semibold text-forest-800">Protein</td>
              {recommendations.map((rec) => (
                <td key={rec.id} className="py-3 px-3 font-black text-forest-700 text-sm">
                  {formatGrams(rec.protein)}
                </td>
              ))}
            </tr>

            {/* Carbs & Fat */}
            <tr className="bg-cream-50/70">
              <td className="py-3 px-3 font-semibold text-charcoal-700">Carbs / Fat</td>
              {recommendations.map((rec) => (
                <td key={rec.id} className="py-3 px-3 text-charcoal-700">
                  {formatGrams(rec.carbs)} C / {formatGrams(rec.fat)} F
                </td>
              ))}
            </tr>

            {/* Compatibility Score */}
            <tr>
              <td className="py-3 px-3 font-semibold text-charcoal-700">Goal Match</td>
              {recommendations.map((rec) => (
                <td key={rec.id} className="py-3 px-3 font-black text-forest-800">
                  {rec.goalCompatibilityScore}%
                </td>
              ))}
            </tr>

            {/* Trade-offs */}
            <tr className="bg-cream-50/70">
              <td className="py-3 px-3 font-semibold text-charcoal-700">Consideration</td>
              {recommendations.map((rec) => (
                <td key={rec.id} className="py-3 px-3 text-charcoal-600 leading-snug">
                  {rec.tradeOffs}
                </td>
              ))}
            </tr>

            {/* Actions */}
            <tr>
              <td className="py-3 px-3 font-semibold text-charcoal-700">Action</td>
              {recommendations.map((rec) => (
                <td key={rec.id} className="py-3 px-3">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      onSelectMeal(rec);
                      onClose();
                    }}
                    icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  >
                    Select This
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </Modal>
  );
};
