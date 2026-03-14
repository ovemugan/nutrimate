// Macro distribution calculator based on goal

const MACRO_RATIOS = {
  lose: { protein: 0.40, carbs: 0.35, fat: 0.25 },
  maintain: { protein: 0.30, carbs: 0.40, fat: 0.30 },
  gain: { protein: 0.30, carbs: 0.50, fat: 0.20 },
};

// Calculate macro goals in grams
export const calculateMacros = (dailyCalories, goal) => {
  const ratios = MACRO_RATIOS[goal] || MACRO_RATIOS.maintain;

  return {
    protein: Math.round((dailyCalories * ratios.protein) / 4),
    carbs: Math.round((dailyCalories * ratios.carbs) / 4),
    fat: Math.round((dailyCalories * ratios.fat) / 9),
  };
};

// Get macro ratios for a goal
export const getMacroRatios = (goal) => {
  return MACRO_RATIOS[goal] || MACRO_RATIOS.maintain;
};

export { MACRO_RATIOS };
