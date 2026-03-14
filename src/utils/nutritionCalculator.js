// Harris-Benedict BMR and TDEE calculator

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
};

const GOAL_ADJUSTMENTS = {
  lose: -500,
  maintain: 0,
  gain: 300,
};

// Calculate BMR using Harris-Benedict equation
export const calculateBMR = (gender, weight, height, age) => {
  if (gender === 'male') {
    return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
  }
  return 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age;
};

// Calculate TDEE (Total Daily Energy Expenditure)
export const calculateTDEE = (bmr, activityLevel) => {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.2;
  return Math.round(bmr * multiplier);
};

// Calculate daily calorie target with goal adjustment
export const calculateDailyCalories = (profile) => {
  if (!profile) return 2000;
  const { gender, weight, height, age, activityLevel, goal } = profile;
  const bmr = calculateBMR(gender, weight, height, age);
  const tdee = calculateTDEE(bmr, activityLevel);
  const adjustment = GOAL_ADJUSTMENTS[goal] || 0;
  return Math.max(1200, Math.round(tdee + adjustment));
};

// Fiber goal (general recommendation)
export const calculateFiberGoal = (calories) => {
  return Math.round(calories / 1000 * 14); // ~14g per 1000 calories
};

export { ACTIVITY_MULTIPLIERS, GOAL_ADJUSTMENTS };
