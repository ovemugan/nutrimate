import React from 'react';

const MacroProgress = ({ label, current, goal, color = '#FF9933', unit = 'g', icon }) => {
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  const isOver = current > goal;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          {icon && <span className="text-sm">{icon}</span>}
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</span>
        </div>
        <span className={`text-xs font-bold ${isOver ? 'text-red-500' : 'text-gray-800 dark:text-gray-200'}`}>
          {Math.round(current)}{unit} / {Math.round(goal)}{unit}
        </span>
      </div>
      <div className="h-2.5 bg-gray-100 dark:bg-dark-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out animate-progress"
          style={{
            width: `${percentage}%`,
            backgroundColor: isOver ? '#ef4444' : color,
          }}
        />
      </div>
    </div>
  );
};

export default MacroProgress;
