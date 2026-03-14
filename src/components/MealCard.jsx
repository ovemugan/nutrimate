import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const MealCard = ({ meal, items }) => {
  const { deleteLog } = useApp();
  const [expanded, setExpanded] = useState(false);

  const mealIcons = {
    Breakfast: '🌅',
    Lunch: '☀️',
    Snacks: '🍪',
    Dinner: '🌙',
  };

  const totalCalories = items.reduce((sum, item) => sum + (item.calories || 0), 0);

  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-fade-in">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex justify-between items-center p-4 min-h-[56px] active:bg-gray-50 dark:active:bg-dark-border transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{mealIcons[meal] || '🍽️'}</span>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{meal}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {items.length} item{items.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-saffron">{Math.round(totalCalories)} kcal</span>
          <span className={`text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </button>

      {expanded && items.length > 0 && (
        <div className="px-4 pb-3 space-y-2 border-t border-gray-100 dark:border-dark-border">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-2 animate-fade-in">
              <div className="flex-1">
                <p className="text-sm text-gray-800 dark:text-gray-200">{item.foodName}</p>
                <p className="text-xs text-gray-400">
                  {item.quantity} × {item.servingSize}{item.servingUnit} • P:{Math.round(item.protein)}g C:{Math.round(item.carbs)}g F:{Math.round(item.fat)}g
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-saffron">{Math.round(item.calories)} kcal</span>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteLog(item.id); }}
                  className="min-w-[28px] min-h-[28px] flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {expanded && items.length === 0 && (
        <div className="px-4 pb-4 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500 py-2">No items logged</p>
        </div>
      )}
    </div>
  );
};

export default MealCard;
