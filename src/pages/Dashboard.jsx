import React from 'react';
import { useApp } from '../context/AppContext';
import MacroProgress from '../components/MacroProgress';
import MealCard from '../components/MealCard';
import WaterTracker from '../components/WaterTracker';
import ThemeToggle from '../components/ThemeToggle';

const Dashboard = () => {
  const { profile, dailyCalories, macroGoals, fiberGoal, consumed, todayLogs, today } = useApp();

  const remaining = dailyCalories - consumed.calories;

  // Group logs by meal
  const mealGroups = {
    Breakfast: todayLogs.filter((l) => l.meal === 'breakfast'),
    Lunch: todayLogs.filter((l) => l.meal === 'lunch'),
    Snacks: todayLogs.filter((l) => l.meal === 'snacks'),
    Dinner: todayLogs.filter((l) => l.meal === 'dinner'),
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg pb-safe">
      {/* Header */}
      <div className="bg-gradient-to-br from-saffron to-orange-600 px-5 pt-6 pb-8 rounded-b-3xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-white/80 text-xs font-medium">{formatDate(today)}</p>
            <h1 className="text-xl font-bold text-white mt-0.5">
              Hi, {profile?.name || 'there'} 👋
            </h1>
          </div>
          <ThemeToggle />
        </div>

        {/* Calorie Circle */}
        <div className="flex justify-center my-4">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="52" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${Math.min((consumed.calories / dailyCalories) * 327, 327)} 327`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-white">{Math.round(consumed.calories)}</span>
              <span className="text-white/70 text-xs">of {dailyCalories} kcal</span>
            </div>
          </div>
        </div>

        {/* Remaining */}
        <div className="text-center">
          <span className={`text-lg font-bold ${remaining >= 0 ? 'text-white' : 'text-red-200'}`}>
            {remaining >= 0 ? remaining : 0} kcal remaining
          </span>
          {remaining < 0 && (
            <p className="text-red-200 text-xs mt-0.5">Over by {Math.abs(remaining)} kcal</p>
          )}
        </div>
      </div>

      <div className="px-5 -mt-4 space-y-4">
        {/* Macro Progress */}
        <div className="glass-card rounded-2xl p-4 space-y-3 animate-slide-up">
          <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">Today's Macros</h2>
          <MacroProgress label="Protein" current={consumed.protein} goal={macroGoals.protein} color="#3b82f6" icon="🥩" />
          <MacroProgress label="Carbs" current={consumed.carbs} goal={macroGoals.carbs} color="#22c55e" icon="🌾" />
          <MacroProgress label="Fat" current={consumed.fat} goal={macroGoals.fat} color="#f59e0b" icon="🥑" />
          <MacroProgress label="Fiber" current={consumed.fiber} goal={fiberGoal} color="#8b5cf6" icon="🥬" />
        </div>

        {/* Water */}
        <WaterTracker />

        {/* Meals */}
        <div className="space-y-3 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">Meals</h2>
          {Object.entries(mealGroups).map(([meal, items]) => (
            <MealCard key={meal} meal={meal} items={items} />
          ))}
        </div>
      </div>

      {/* Spacer for bottom nav */}
      <div className="h-6" />
    </div>
  );
};

export default Dashboard;
