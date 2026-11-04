import React, { useState, useEffect } from 'react';
import { LoggedMeal } from '../../types/history';
import { MealType } from '../../types/food';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface MealHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveMeal: (meal: LoggedMeal) => void;
  initialMeal?: LoggedMeal | null;
}

export const MealHistoryModal: React.FC<MealHistoryModalProps> = ({
  isOpen,
  onClose,
  onSaveMeal,
  initialMeal,
}) => {
  const [name, setName] = useState('');
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [price, setPrice] = useState(50);
  const [calories, setCalories] = useState(350);
  const [protein, setProtein] = useState(12);
  const [carbs, setCarbs] = useState(45);
  const [fat, setFat] = useState(10);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialMeal) {
      setName(initialMeal.name);
      setMealType(initialMeal.mealType);
      setPrice(initialMeal.totalPrice);
      setCalories(initialMeal.totalCalories);
      setProtein(initialMeal.totalProtein);
      setCarbs(initialMeal.totalCarbs);
      setFat(initialMeal.totalFat);
      setNotes(initialMeal.notes || '');
    } else {
      setName('');
      setMealType('lunch');
      setPrice(50);
      setCalories(350);
      setProtein(12);
      setCarbs(45);
      setFat(10);
      setNotes('');
    }
  }, [initialMeal, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const meal: LoggedMeal = {
      id: initialMeal ? initialMeal.id : `meal_${Date.now()}`,
      timestamp: initialMeal ? initialMeal.timestamp : new Date().toISOString(),
      mealType,
      name: name.trim(),
      items: initialMeal
        ? initialMeal.items
        : [
            {
              id: `item_${Date.now()}`,
              name: name.trim(),
              quantity: 1,
              servingSize: '1 meal portion',
              price: Number(price),
              calories: Number(calories),
              protein: Number(protein),
              carbs: Number(carbs),
              fat: Number(fat),
            },
          ],
      totalPrice: Number(price),
      totalCalories: Number(calories),
      totalProtein: Number(protein),
      totalCarbs: Number(carbs),
      totalFat: Number(fat),
      notes: notes.trim(),
      source: initialMeal ? initialMeal.source : 'manual',
    };

    onSaveMeal(meal);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialMeal ? 'Edit Logged Meal' : 'Log Custom Meal'}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
            Meal Title / Description
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Canteen Egg Fried Rice, Masala Dosa + Chaas"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-charcoal-300 rounded-xl focus:ring-2 focus:ring-forest-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
              Meal Time
            </label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value as MealType)}
              className="w-full px-3 py-2 text-sm border border-charcoal-300 rounded-xl capitalize focus:ring-2 focus:ring-forest-500"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="snacks">Snacks</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
              Total Cost (₹)
            </label>
            <input
              type="number"
              min="0"
              max="1000"
              required
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-charcoal-300 rounded-xl focus:ring-2 focus:ring-forest-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
              Calories (kcal)
            </label>
            <input
              type="number"
              min="0"
              max="3000"
              required
              value={calories}
              onChange={(e) => setCalories(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-charcoal-300 rounded-xl focus:ring-2 focus:ring-forest-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
              Protein (g)
            </label>
            <input
              type="number"
              min="0"
              max="200"
              step="0.5"
              required
              value={protein}
              onChange={(e) => setProtein(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-charcoal-300 rounded-xl focus:ring-2 focus:ring-forest-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
              Carbohydrates (g)
            </label>
            <input
              type="number"
              min="0"
              max="400"
              value={carbs}
              onChange={(e) => setCarbs(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-charcoal-300 rounded-xl focus:ring-2 focus:ring-forest-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
              Fat (g)
            </label>
            <input
              type="number"
              min="0"
              max="200"
              value={fat}
              onChange={(e) => setFat(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-charcoal-300 rounded-xl focus:ring-2 focus:ring-forest-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
            Notes / Location
          </label>
          <input
            type="text"
            placeholder="e.g. Science block stall, extra curd added"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-charcoal-300 rounded-xl focus:ring-2 focus:ring-forest-500"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md">
            {initialMeal ? 'Save Changes' : 'Add to Log'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
