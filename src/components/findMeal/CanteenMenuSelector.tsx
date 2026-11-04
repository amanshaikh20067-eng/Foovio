import React, { useState } from 'react';
import { FoodItem, DietaryType } from '../../types/food';
import { formatINR, formatGrams, formatCalories } from '../../utils/formatters';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { Check, Plus, Edit2, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';
import { DEFAULT_CANTEEN_MENU } from '../../data/defaultMenu';

interface CanteenMenuSelectorProps {
  menu: FoodItem[];
  onUpdateMenu: (updated: FoodItem[]) => void;
}

export const CanteenMenuSelector: React.FC<CanteenMenuSelectorProps> = ({
  menu,
  onUpdateMenu,
}) => {
  const [filterDiet, setFilterDiet] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editPriceVal, setEditPriceVal] = useState<number>(0);

  // New item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState(40);
  const [newItemCalories, setNewItemCalories] = useState(250);
  const [newItemProtein, setNewItemProtein] = useState(8);
  const [newItemDiet, setNewItemDiet] = useState<DietaryType>('veg');
  const [newItemServing, setNewItemServing] = useState('1 plate');

  const toggleAvailability = (itemId: string) => {
    const updated = menu.map((item) =>
      item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
    );
    onUpdateMenu(updated);
  };

  const handleStartEditPrice = (item: FoodItem) => {
    setEditingItemId(item.id);
    setEditPriceVal(item.price);
  };

  const handleSavePrice = (itemId: string) => {
    if (editPriceVal <= 0) return;
    const updated = menu.map((item) =>
      item.id === itemId ? { ...item, price: editPriceVal } : item
    );
    onUpdateMenu(updated);
    setEditingItemId(null);
  };

  const handleResetMenu = () => {
    onUpdateMenu([...DEFAULT_CANTEEN_MENU]);
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: FoodItem = {
      id: `custom_${Date.now()}`,
      name: newItemName.trim(),
      price: Number(newItemPrice),
      servingSize: newItemServing.trim() || '1 standard serving',
      calories: Number(newItemCalories),
      protein: Number(newItemProtein),
      carbs: Math.round(Number(newItemCalories) * 0.12),
      fat: Math.round(Number(newItemCalories) * 0.04),
      dietaryType: newItemDiet,
      category: 'main',
      mealTypes: ['lunch', 'dinner', 'breakfast', 'snacks'],
      allergens: [],
      ingredients: ['Campus canteen custom preparation'],
      isAvailable: true,
      isCustom: true,
      tag: 'Custom Campus Item',
    };

    onUpdateMenu([newItem, ...menu]);
    setIsAddModalOpen(false);
    setNewItemName('');
    setNewItemPrice(40);
  };

  const filteredMenu = menu.filter((item) => {
    if (filterDiet === 'all') return true;
    return item.dietaryType === filterDiet;
  });

  const availableCount = menu.filter((m) => m.isAvailable).length;

  return (
    <div className="bg-white rounded-2xl border border-charcoal-200 p-5 shadow-soft-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-charcoal-900 flex items-center gap-2">
            <span>Campus Canteen Menu</span>
            <Badge variant="forest" size="sm">
              {availableCount} Available
            </Badge>
          </h3>
          <p className="text-xs text-charcoal-500">
            Toggle foods available in your canteen today or edit prices to match your college
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetMenu}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            title="Reset menu to default Indian canteen items"
          >
            Reset Menu
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Item
          </Button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 text-xs">
        <span className="text-charcoal-500 font-semibold shrink-0">Filter Diet:</span>
        {['all', 'veg', 'eggetarian', 'non-veg'].map((d) => (
          <button
            key={d}
            onClick={() => setFilterDiet(d)}
            className={`px-3 py-1 rounded-lg capitalize font-semibold transition-colors ${
              filterDiet === d
                ? 'bg-forest-600 text-white'
                : 'bg-cream-200 text-charcoal-700 hover:bg-cream-300'
            }`}
          >
            {d === 'all' ? 'All Foods' : d}
          </button>
        ))}
      </div>

      {/* Food items grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto pr-1">
        {filteredMenu.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
              item.isAvailable
                ? 'bg-white border-charcoal-200 hover:border-forest-400'
                : 'bg-cream-200/50 border-dashed border-charcoal-300 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-1 mb-1">
                <div className="font-bold text-sm text-charcoal-900 leading-snug">
                  {item.name}
                  {item.hindiName && (
                    <span className="text-xs font-normal text-charcoal-500 ml-1.5">
                      ({item.hindiName})
                    </span>
                  )}
                </div>
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1 border ${
                    item.dietaryType === 'veg'
                      ? 'bg-emerald-600 border-emerald-700'
                      : item.dietaryType === 'eggetarian'
                      ? 'bg-amber-500 border-amber-600'
                      : 'bg-rose-600 border-rose-700'
                  }`}
                  title={item.dietaryType}
                />
              </div>

              <div className="text-[11px] text-charcoal-500 mb-2">
                {item.servingSize}
              </div>

              <div className="flex items-center gap-2 text-xs text-charcoal-600 mb-2 font-medium">
                <span>{formatCalories(item.calories)}</span>
                <span>•</span>
                <span className="text-forest-700 font-semibold">{formatGrams(item.protein)} P</span>
                <span>•</span>
                <span>{formatGrams(item.carbs)} C</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-charcoal-100">
              {editingItemId === item.id ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-charcoal-700">₹</span>
                  <input
                    type="number"
                    value={editPriceVal}
                    onChange={(e) => setEditPriceVal(Number(e.target.value))}
                    className="w-14 px-1.5 py-0.5 text-xs font-bold border border-forest-500 rounded bg-white text-charcoal-900 focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSavePrice(item.id)}
                    className="p-1 bg-forest-600 text-white rounded text-xs hover:bg-forest-700"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleStartEditPrice(item)}
                  className="flex items-center gap-1 text-xs font-extrabold text-charcoal-900 hover:text-forest-600 group"
                  title="Click to edit price for your canteen"
                >
                  <span>{formatINR(item.price)}</span>
                  <Edit2 className="w-3 h-3 text-charcoal-400 group-hover:text-forest-600" />
                </button>
              )}

              <button
                onClick={() => toggleAvailability(item.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  item.isAvailable
                    ? 'bg-forest-100 text-forest-800 hover:bg-forest-200'
                    : 'bg-charcoal-200 text-charcoal-600 hover:bg-charcoal-300'
                }`}
              >
                {item.isAvailable ? 'Available' : 'Sold Out'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Item Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Campus Canteen Food Item"
        maxWidth="md"
      >
        <form onSubmit={handleAddNewItem} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1">
              Food Item Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Masala Maggi, Chana Masala, Aloo Paratha"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-charcoal-300 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                Price in Canteen (₹)
              </label>
              <input
                type="number"
                min="5"
                max="500"
                required
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-charcoal-300 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                Diet Category
              </label>
              <select
                value={newItemDiet}
                onChange={(e) => setNewItemDiet(e.target.value as DietaryType)}
                className="w-full px-3 py-2 text-sm border border-charcoal-300 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
              >
                <option value="veg">Vegetarian</option>
                <option value="eggetarian">Eggetarian</option>
                <option value="non-veg">Non-Vegetarian</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                Estimated Calories (kcal)
              </label>
              <input
                type="number"
                min="20"
                max="1500"
                required
                value={newItemCalories}
                onChange={(e) => setNewItemCalories(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-charcoal-300 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal-700 mb-1">
                Protein (grams)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                required
                value={newItemProtein}
                onChange={(e) => setNewItemProtein(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-charcoal-300 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 mb-1">
              Serving Size Description
            </label>
            <input
              type="text"
              placeholder="e.g. 1 plate with dahi, 2 pieces"
              value={newItemServing}
              onChange={(e) => setNewItemServing(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-charcoal-300 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Add to Canteen Menu
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
