import React, { useState, useCallback, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { debouncedSearch } from '../services/foodSearchService';
import FoodCard from '../components/FoodCard';
import Loader from '../components/Loader';
import ThemeToggle from '../components/ThemeToggle';
import { v4 as uuidv4 } from 'uuid';

const MEALS = [
  { value: 'breakfast', label: 'Breakfast', icon: '🌅' },
  { value: 'lunch', label: 'Lunch', icon: '☀️' },
  { value: 'snacks', label: 'Snacks', icon: '🍪' },
  { value: 'dinner', label: 'Dinner', icon: '🌙' },
];

const LogFood = () => {
  const { logFood, today } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState('breakfast');
  const [quantity, setQuantity] = useState(1);
  const [showManual, setShowManual] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [manualForm, setManualForm] = useState({
    foodName: '', calories: '', protein: '', carbs: '', fat: '', fiber: '',
    servingSize: '100', servingUnit: 'g',
  });
  const inputRef = useRef(null);

  const handleSearch = useCallback((value) => {
    setQuery(value);
    if (value.trim().length < 2) {
      setResults([]);
      setLoading(false);
      setNoResults(false);
      return;
    }
    setLoading(true);
    setNoResults(false);
    debouncedSearch(value, (res) => {
      setResults(res);
      setLoading(false);
      setNoResults(res.length === 0);
    });
  }, []);

  const handleSelectFood = (food) => {
    setSelectedFood(food);
    setQuantity(1);
  };

  const handleLog = () => {
    if (!selectedFood) return;
    const entry = {
      id: uuidv4(),
      date: today,
      meal: selectedMeal,
      foodName: selectedFood.name,
      servingSize: selectedFood.serving_size,
      servingUnit: selectedFood.serving_unit,
      quantity,
      calories: Math.round(selectedFood.calories * quantity),
      protein: Math.round(selectedFood.protein * quantity * 10) / 10,
      carbs: Math.round(selectedFood.carbs * quantity * 10) / 10,
      fat: Math.round(selectedFood.fat * quantity * 10) / 10,
      fiber: Math.round((selectedFood.fiber || 0) * quantity * 10) / 10,
    };
    logFood(entry);
    setSelectedFood(null);
    setQuery('');
    setResults([]);
  };

  const handleManualLog = () => {
    const entry = {
      id: uuidv4(),
      date: today,
      meal: selectedMeal,
      foodName: manualForm.foodName,
      servingSize: parseFloat(manualForm.servingSize) || 100,
      servingUnit: manualForm.servingUnit,
      quantity: 1,
      calories: parseFloat(manualForm.calories) || 0,
      protein: parseFloat(manualForm.protein) || 0,
      carbs: parseFloat(manualForm.carbs) || 0,
      fat: parseFloat(manualForm.fat) || 0,
      fiber: parseFloat(manualForm.fiber) || 0,
    };
    logFood(entry);
    setShowManual(false);
    setManualForm({ foodName: '', calories: '', protein: '', carbs: '', fat: '', fiber: '', servingSize: '100', servingUnit: 'g' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg pb-safe">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Log Food</h1>
          <ThemeToggle />
        </div>

        {/* Meal selector */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {MEALS.map((meal) => (
            <button
              key={meal.value}
              onClick={() => setSelectedMeal(meal.value)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all min-h-[44px] ${
                selectedMeal === meal.value
                  ? 'bg-saffron text-white shadow-lg shadow-saffron/25'
                  : 'bg-gray-100 dark:bg-dark-card text-gray-600 dark:text-gray-300'
              }`}
            >
              <span>{meal.icon}</span>
              {meal.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search food... (e.g. 'dal tadka', 'banana')"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-3.5 pl-10 rounded-xl bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white placeholder:text-gray-400 outline-none focus:border-saffron transition-colors min-h-[48px]"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>
      </div>

      <div className="px-5 space-y-3">
        {/* Loading */}
        {loading && <Loader />}

        {/* Results */}
        {!loading && results.length > 0 && !selectedFood && (
          <div className="space-y-2">
            <p className="text-xs text-gray-400 font-medium">{results.length} results found</p>
            {results.map((food, i) => (
              <FoodCard key={i} food={food} onSelect={handleSelectFood} />
            ))}
          </div>
        )}

        {/* No results */}
        {noResults && !loading && (
          <div className="text-center py-8 animate-fade-in">
            <p className="text-4xl mb-3">🤷</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">No food found for "{query}"</p>
            <button
              onClick={() => { setShowManual(true); setManualForm(prev => ({ ...prev, foodName: query })); }}
              className="px-6 py-3 bg-saffron text-white rounded-xl font-semibold text-sm hover:bg-saffron-600 transition-colors min-h-[48px]"
            >
              Add Manually
            </button>
          </div>
        )}

        {/* Selected food - quantity & confirm */}
        {selectedFood && (
          <div className="glass-card rounded-2xl p-5 space-y-4 animate-slide-up">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">{selectedFood.name}</h3>
                <p className="text-xs text-gray-500">{selectedFood.serving_size} {selectedFood.serving_unit} per serving</p>
              </div>
              <button onClick={() => setSelectedFood(null)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded-xl bg-saffron/10">
                <p className="text-lg font-bold text-saffron">{Math.round(selectedFood.calories * quantity)}</p>
                <p className="text-[10px] text-gray-500">kcal</p>
              </div>
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                <p className="text-lg font-bold text-blue-500">{Math.round(selectedFood.protein * quantity * 10) / 10}</p>
                <p className="text-[10px] text-gray-500">Protein</p>
              </div>
              <div className="p-2 rounded-xl bg-green-50 dark:bg-green-900/20">
                <p className="text-lg font-bold text-green-500">{Math.round(selectedFood.carbs * quantity * 10) / 10}</p>
                <p className="text-[10px] text-gray-500">Carbs</p>
              </div>
              <div className="p-2 rounded-xl bg-yellow-50 dark:bg-yellow-900/20">
                <p className="text-lg font-bold text-yellow-600">{Math.round(selectedFood.fat * quantity * 10) / 10}</p>
                <p className="text-[10px] text-gray-500">Fat</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(0.5, quantity - 0.5))}
                className="w-11 h-11 flex items-center justify-center bg-gray-100 dark:bg-dark-border rounded-xl text-lg font-bold active:scale-95"
              >
                −
              </button>
              <span className="text-xl font-bold text-gray-900 dark:text-white w-16 text-center">
                {quantity}x
              </span>
              <button
                onClick={() => setQuantity(quantity + 0.5)}
                className="w-11 h-11 flex items-center justify-center bg-gray-100 dark:bg-dark-border rounded-xl text-lg font-bold active:scale-95"
              >
                +
              </button>
            </div>

            <button
              onClick={handleLog}
              className="w-full py-3.5 bg-saffron text-white rounded-xl font-bold text-sm hover:bg-saffron-600 transition-colors active:scale-[0.98] shadow-lg shadow-saffron/25 min-h-[48px]"
            >
              Add to {MEALS.find(m => m.value === selectedMeal)?.label} ✓
            </button>
          </div>
        )}

        {/* Manual entry form */}
        {showManual && (
          <div className="glass-card rounded-2xl p-5 space-y-3 animate-slide-up">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-900 dark:text-white">Manual Entry</h3>
              <button onClick={() => setShowManual(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <input type="text" placeholder="Food name" value={manualForm.foodName}
              onChange={(e) => setManualForm(prev => ({ ...prev, foodName: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white outline-none focus:border-saffron min-h-[44px]"
            />
            <div className="grid grid-cols-2 gap-2">
              {['calories', 'protein', 'carbs', 'fat', 'fiber'].map((key) => (
                <input key={key} type="number" placeholder={key.charAt(0).toUpperCase() + key.slice(1) + (key === 'calories' ? ' (kcal)' : ' (g)')}
                  value={manualForm[key]}
                  onChange={(e) => setManualForm(prev => ({ ...prev, [key]: e.target.value }))}
                  className="px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border text-sm text-gray-900 dark:text-white outline-none focus:border-saffron min-h-[44px]"
                />
              ))}
            </div>
            <button
              onClick={handleManualLog}
              disabled={!manualForm.foodName || !manualForm.calories}
              className="w-full py-3 bg-saffron text-white rounded-xl font-bold text-sm hover:bg-saffron-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
            >
              Log Food ✓
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && results.length === 0 && !noResults && !selectedFood && !showManual && query.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <p className="text-5xl mb-4">🍽️</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Search for food or scan a barcode to log</p>
            <button
              onClick={() => setShowManual(true)}
              className="mt-4 px-6 py-2.5 text-saffron border border-saffron rounded-xl text-sm font-semibold hover:bg-saffron/10 transition-colors min-h-[44px]"
            >
              Or add manually
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogFood;
