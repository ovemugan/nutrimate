import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ThemeToggle from '../components/ThemeToggle';
import indianFoods from '../data/indianFoods.json';
import { v4 as uuidv4 } from 'uuid';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];

const Presets = () => {
  const { presets, updatePresets, logFood, today } = useApp();
  const [selectedDay, setSelectedDay] = useState(DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);
  const [editingMeal, setEditingMeal] = useState(null);
  const [editItems, setEditItems] = useState([]);
  const [showSuccess, setShowSuccess] = useState('');

  const dayPresets = presets[selectedDay] || {};

  const findFoodData = (name) => {
    return indianFoods.find((f) => f.name.toLowerCase() === name.toLowerCase()) || {
      name, serving_size: 100, serving_unit: 'g', calories: 100, protein: 5, carbs: 15, fat: 3, fiber: 2,
    };
  };

  const handleAddPresetToLog = (mealType) => {
    const items = dayPresets[mealType] || [];
    items.forEach((foodName) => {
      const food = findFoodData(foodName);
      logFood({
        id: uuidv4(),
        date: today,
        meal: mealType.toLowerCase(),
        foodName: food.name,
        servingSize: food.serving_size,
        servingUnit: food.serving_unit,
        quantity: 1,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        fiber: food.fiber || 0,
      });
    });
    setShowSuccess(mealType);
    setTimeout(() => setShowSuccess(''), 2000);
  };

  const handleEdit = (mealType) => {
    setEditingMeal(mealType);
    setEditItems([...(dayPresets[mealType] || [])]);
  };

  const handleSaveEdit = () => {
    const newPresets = {
      ...presets,
      [selectedDay]: {
        ...dayPresets,
        [editingMeal]: editItems.filter((item) => item.trim()),
      },
    };
    updatePresets(newPresets);
    setEditingMeal(null);
  };

  const handleAddItem = () => {
    setEditItems([...editItems, '']);
  };

  const handleRemoveItem = (index) => {
    setEditItems(editItems.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index, value) => {
    const newItems = [...editItems];
    newItems[index] = value;
    setEditItems(newItems);
  };

  const getMealCalories = (mealType) => {
    const items = dayPresets[mealType] || [];
    return items.reduce((sum, name) => sum + findFoodData(name).calories, 0);
  };

  const mealIcons = { Breakfast: '🌅', Lunch: '☀️', Snacks: '🍪', Dinner: '🌙' };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg pb-safe">
      <div className="px-5 pt-6 pb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Meal Presets</h1>
          <ThemeToggle />
        </div>

        {/* Day selector */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4">
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all min-h-[40px] ${
                selectedDay === day
                  ? 'bg-saffron text-white shadow-md shadow-saffron/25'
                  : 'bg-gray-100 dark:bg-dark-card text-gray-500 dark:text-gray-400'
              }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 space-y-3">
        {MEAL_TYPES.map((mealType) => {
          const items = dayPresets[mealType] || [];
          const calories = getMealCalories(mealType);

          return (
            <div key={mealType} className="glass-card rounded-2xl p-4 animate-fade-in">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{mealIcons[mealType]}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{mealType}</h3>
                    <p className="text-xs text-saffron font-medium">{calories} kcal</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(mealType)}
                    className="px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-dark-border rounded-lg hover:bg-gray-200 transition-colors min-h-[32px]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleAddPresetToLog(mealType)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all min-h-[32px] ${
                      showSuccess === mealType
                        ? 'bg-green-500 text-white'
                        : 'bg-saffron text-white hover:bg-saffron-600'
                    }`}
                  >
                    {showSuccess === mealType ? '✓ Added!' : '+ Log'}
                  </button>
                </div>
              </div>

              {items.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {items.map((item, i) => (
                    <span key={i} className="px-2.5 py-1 bg-gray-100 dark:bg-dark-border text-xs text-gray-600 dark:text-gray-300 rounded-full">
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">No items set</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Edit modal */}
      {editingMeal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center" onClick={() => setEditingMeal(null)}>
          <div className="bg-white dark:bg-dark-bg w-full max-w-lg rounded-t-3xl p-5 space-y-4 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Edit {editingMeal} — {selectedDay}
              </h3>
              <button onClick={() => setEditingMeal(null)} className="text-gray-400 text-lg">✕</button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {editItems.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleUpdateItem(i, e.target.value)}
                    placeholder="Food item name"
                    className="flex-1 px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border text-sm text-gray-900 dark:text-white outline-none focus:border-saffron min-h-[44px]"
                  />
                  <button onClick={() => handleRemoveItem(i)} className="text-red-400 hover:text-red-600 px-2 min-h-[44px]">✕</button>
                </div>
              ))}
            </div>

            <button onClick={handleAddItem} className="w-full py-2.5 border-2 border-dashed border-gray-200 dark:border-dark-border text-gray-400 rounded-xl text-sm hover:border-saffron hover:text-saffron transition-colors min-h-[44px]">
              + Add Item
            </button>

            <button
              onClick={handleSaveEdit}
              className="w-full py-3.5 bg-saffron text-white rounded-xl font-bold text-sm hover:bg-saffron-600 transition-colors min-h-[48px]"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Presets;
