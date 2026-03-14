import React from 'react';

const FoodCard = ({ food, onSelect, showAddButton = true }) => {
  return (
    <div className="glass-card rounded-2xl p-4 animate-fade-in hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-[0.98]" onClick={() => onSelect && onSelect(food)}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
            {food.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {food.serving_size} {food.serving_unit}
            {food.source && <span className="ml-1 text-saffron">• {food.source}</span>}
          </p>
          <div className="flex gap-3 mt-2">
            <span className="text-xs font-medium text-saffron">{food.calories} kcal</span>
            <span className="text-xs text-blue-500">P: {food.protein}g</span>
            <span className="text-xs text-green-500">C: {food.carbs}g</span>
            <span className="text-xs text-yellow-600 dark:text-yellow-400">F: {food.fat}g</span>
          </div>
        </div>
        {showAddButton && (
          <button
            onClick={(e) => { e.stopPropagation(); onSelect && onSelect(food); }}
            className="min-w-[36px] min-h-[36px] flex items-center justify-center bg-saffron text-white rounded-xl text-lg font-bold hover:bg-saffron-600 transition-colors active:scale-95"
          >
            +
          </button>
        )}
      </div>
    </div>
  );
};

export default FoodCard;
