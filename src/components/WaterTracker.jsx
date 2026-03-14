import React from 'react';
import { useApp } from '../context/AppContext';

const WaterTracker = () => {
  const { waterCount, incrementWater, decrementWater } = useApp();
  const target = 8;
  const percentage = Math.min((waterCount / target) * 100, 100);

  return (
    <div className="glass-card rounded-2xl p-4 animate-fade-in">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">💧</span>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Water Intake</h3>
        </div>
        <span className="text-xs font-semibold text-blue-500">
          {waterCount} / {target} glasses
        </span>
      </div>

      {/* Water glasses visualization */}
      <div className="flex justify-center gap-1.5 mb-3">
        {Array.from({ length: target }).map((_, i) => (
          <div
            key={i}
            className={`w-7 h-9 rounded-b-lg rounded-t-sm border-2 transition-all duration-300 flex items-end justify-center overflow-hidden ${
              i < waterCount
                ? 'border-blue-400'
                : 'border-gray-200 dark:border-gray-600'
            }`}
          >
            {i < waterCount && (
              <div
                className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-b-md transition-all duration-500"
                style={{ height: '80%' }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-100 dark:bg-dark-border rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500 animate-progress"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-3">
        <button
          onClick={decrementWater}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-gray-100 dark:bg-dark-border text-gray-600 dark:text-gray-300 rounded-xl text-lg font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors active:scale-95"
        >
          −
        </button>
        <button
          onClick={incrementWater}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-blue-500 text-white rounded-xl text-lg font-bold hover:bg-blue-600 transition-colors active:scale-95 shadow-lg shadow-blue-500/25"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default WaterTracker;
