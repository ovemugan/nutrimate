import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getItem, setItem, cleanOldLogs, getTodayStr, getLogsForDate, addFoodLog, removeFoodLog, getWaterForDate, addWater, removeWater, STORAGE_KEYS } from '../utils/storage';
import { calculateDailyCalories, calculateFiberGoal } from '../utils/nutritionCalculator';
import { calculateMacros } from '../utils/macroCalculator';
import { cleanExpiredCache } from '../utils/cacheManager';
import { useTheme } from '../hooks/useTheme';

const AppContext = createContext(null);

const DEFAULT_PRESETS = {
  Monday: {
    Breakfast: ['Idli', 'Sambar', 'Banana', 'Chai'],
    Lunch: ['Aloo Fry', 'Bitter Gourd Masala', 'Tomato Pappu', 'Steamed Rice', 'Rasam', 'Chapati', 'Semiya Payasam'],
    Snacks: ['Pesara Punugulu', 'Bread', 'Peanut Butter', 'Chai'],
    Dinner: ['Egg Curry', 'Soya Pulao', 'Roti', 'Mushroom', 'Steamed Rice', 'Rasam', 'Chapati', 'Rice Kheer'],
  },
  Tuesday: {
    Breakfast: ['Dosa', 'Sambar', 'Boiled Egg', 'Sprouts', 'Banana', 'Chai'],
    Lunch: ['Arbi Fry', 'Aloo Masala', 'Palki Dal', 'Steamed Rice', 'Sambar', 'Chapati', 'Curd', 'Badusha'],
    Snacks: ['Pani Puri', 'Aloo Matar', 'Bread', 'Peanut Butter', 'Chai'],
    Dinner: ['Soya Masala', 'Lemon Rice', 'Dal Tadka', 'Steamed Rice', 'Sambar', 'Chapati', 'Chocolate Cake'],
  },
  Wednesday: {
    Breakfast: ['Puri', 'Upma', 'Aloo Masala', 'Boiled Egg', 'Banana', 'Chai'],
    Lunch: ['Beetroot Poriyal', 'Dal Tadka', 'Steamed Rice', 'Sambar', 'Chapati', 'Curd', 'Jalebi'],
    Snacks: ['Boiled Peanuts', 'Bread', 'Peanut Butter', 'Chai'],
    Dinner: ['Chicken Curry', 'Ragi Mudda', 'Paneer Butter Masala', 'Steamed Rice', 'Rasam', 'Chapati', 'Semiya Payasam'],
  },
  Thursday: {
    Breakfast: ['Mysore Bonda', 'Poha', 'Sambar', 'Sprouts', 'Banana', 'Chai'],
    Lunch: ['Cabbage Fry', 'Soya Masala', 'Dal', 'Steamed Rice', 'Sambar', 'Chapati', 'Curd', 'Moong Dal Halwa'],
    Snacks: ['Maggi', 'Biscuits', 'Chai'],
    Dinner: ['Egg Curry', 'Pulao', 'Veg Kofta', 'Steamed Rice', 'Rasam', 'Chapati', 'Sabudana Khichdi'],
  },
  Friday: {
    Breakfast: ['Dosa', 'Sambar', 'Boiled Egg', 'Banana', 'Chai'],
    Lunch: ['Mixed Veg', 'Dal Tadka', 'Steamed Rice', 'Sambar', 'Chapati', 'Curd', 'Halwa'],
    Snacks: ['Samosa', 'Chai'],
    Dinner: ['Palak Paneer', 'Jeera Rice', 'Roti', 'Steamed Rice', 'Rasam', 'Kheer'],
  },
  Saturday: {
    Breakfast: ['Bread Omelette', 'Chole Bhature', 'Boiled Egg', 'Sprouts', 'Banana', 'Chai'],
    Lunch: ['Bhindi Masala', 'Gutti Vankaya Curry', 'Gongura Pappu', 'Steamed Rice', 'Rasam', 'Chapati', 'Curd', 'Rawa Kesari'],
    Snacks: ['Pav Bhaji', 'Bread', 'Peanut Butter', 'Chai'],
    Dinner: ['Idli', 'Paratha', 'Aloo Masala', 'Pulao', 'Steamed Rice', 'Sambar', 'Gulab Jamun'],
  },
  Sunday: {
    Breakfast: ['Masala Dosa', 'Sabudana Khichdi', 'Sambar', 'Boiled Egg', 'Sprouts', 'Banana', 'Chai'],
    Lunch: ['Chicken Biryani', 'Veg Biryani', 'Raita', 'Curd Rice', 'Steamed Rice', 'Sambar', 'Fruit Salad'],
    Snacks: ['Sweet Corn', 'Popcorn', 'Bread', 'Peanut Butter', 'Chai'],
    Dinner: ['Aloo Gobi', 'Pulao', 'Dal Tadka', 'Steamed Rice', 'Rasam', 'Chapati', 'Curd', 'Ice Cream'],
  },
};

export const AppProvider = ({ children }) => {
  const { isDark, toggleTheme } = useTheme();
  const [profile, setProfileState] = useState(() => getItem(STORAGE_KEYS.USER_PROFILE));
  const [todayLogs, setTodayLogs] = useState([]);
  const [waterCount, setWaterCount] = useState(0);
  const [presets, setPresetsState] = useState(() => getItem(STORAGE_KEYS.MEAL_PRESETS) || DEFAULT_PRESETS);
  const [weightHistory, setWeightHistoryState] = useState(() => getItem(STORAGE_KEYS.WEIGHT_HISTORY) || []);

  const today = getTodayStr();

  // On mount: clean old logs and expired cache
  useEffect(() => {
    cleanOldLogs();
    cleanExpiredCache();
  }, []);

  // Load today's data
  useEffect(() => {
    setTodayLogs(getLogsForDate(today));
    setWaterCount(getWaterForDate(today));
  }, [today]);

  // Calculate calorie and macro goals
  const dailyCalories = useMemo(() => calculateDailyCalories(profile), [profile]);
  const macroGoals = useMemo(() => calculateMacros(dailyCalories, profile?.goal || 'maintain'), [dailyCalories, profile]);
  const fiberGoal = useMemo(() => calculateFiberGoal(dailyCalories), [dailyCalories]);

  // Calculate consumed totals
  const consumed = useMemo(() => {
    return todayLogs.reduce(
      (acc, log) => ({
        calories: acc.calories + (log.calories || 0),
        protein: acc.protein + (log.protein || 0),
        carbs: acc.carbs + (log.carbs || 0),
        fat: acc.fat + (log.fat || 0),
        fiber: acc.fiber + (log.fiber || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
  }, [todayLogs]);

  // Profile
  const setProfile = useCallback((data) => {
    setProfileState(data);
    setItem(STORAGE_KEYS.USER_PROFILE, data);
  }, []);

  // Food logging
  const logFood = useCallback((entry) => {
    const newLogs = addFoodLog(entry);
    setTodayLogs(getLogsForDate(today));
    return newLogs;
  }, [today]);

  const deleteLog = useCallback((id) => {
    removeFoodLog(id);
    setTodayLogs(getLogsForDate(today));
  }, [today]);

  // Water
  const incrementWater = useCallback(() => {
    const count = addWater(today);
    setWaterCount(count);
  }, [today]);

  const decrementWater = useCallback(() => {
    const count = removeWater(today);
    setWaterCount(count);
  }, [today]);

  // Presets
  const updatePresets = useCallback((newPresets) => {
    setPresetsState(newPresets);
    setItem(STORAGE_KEYS.MEAL_PRESETS, newPresets);
  }, []);

  // Weight
  const addWeight = useCallback((entry) => {
    const history = [...weightHistory, entry].sort((a, b) => a.date.localeCompare(b.date));
    setWeightHistoryState(history);
    setItem(STORAGE_KEYS.WEIGHT_HISTORY, history);
  }, [weightHistory]);

  const deleteWeight = useCallback((date) => {
    const history = weightHistory.filter((w) => w.date !== date);
    setWeightHistoryState(history);
    setItem(STORAGE_KEYS.WEIGHT_HISTORY, history);
  }, [weightHistory]);

  const value = useMemo(() => ({
    // Theme
    isDark,
    toggleTheme,
    // Profile
    profile,
    setProfile,
    // Goals
    dailyCalories,
    macroGoals,
    fiberGoal,
    // Logs
    todayLogs,
    consumed,
    logFood,
    deleteLog,
    // Water
    waterCount,
    incrementWater,
    decrementWater,
    // Presets
    presets,
    updatePresets,
    // Weight
    weightHistory,
    addWeight,
    deleteWeight,
    // Helpers
    today,
  }), [isDark, toggleTheme, profile, setProfile, dailyCalories, macroGoals, fiberGoal, todayLogs, consumed, logFood, deleteLog, waterCount, incrementWater, decrementWater, presets, updatePresets, weightHistory, addWeight, deleteWeight, today]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export default AppContext;
