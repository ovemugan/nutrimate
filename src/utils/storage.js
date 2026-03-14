// localStorage utility helpers

const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  DAILY_LOGS: 'daily_logs',
  FOOD_CACHE: 'food_cache',
  BARCODE_CACHE: 'barcode_cache',
  MEAL_PRESETS: 'meal_presets',
  WATER_LOG: 'water_log',
  WEIGHT_HISTORY: 'weight_history',
  THEME: 'theme',
};

export const getItem = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

// Get today's date string in YYYY-MM-DD
export const getTodayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// Auto-delete log entries older than 30 days
export const cleanOldLogs = () => {
  const logs = getItem(STORAGE_KEYS.DAILY_LOGS) || [];
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const cutoffStr = cutoff.toISOString().split('T')[0];

  const filtered = logs.filter((log) => log.date >= cutoffStr);
  if (filtered.length !== logs.length) {
    setItem(STORAGE_KEYS.DAILY_LOGS, filtered);
  }
  return filtered;
};

// Get logs for a specific date
export const getLogsForDate = (date) => {
  const logs = getItem(STORAGE_KEYS.DAILY_LOGS) || [];
  return logs.filter((log) => log.date === date);
};

// Add a food log entry
export const addFoodLog = (entry) => {
  const logs = getItem(STORAGE_KEYS.DAILY_LOGS) || [];
  logs.push(entry);
  setItem(STORAGE_KEYS.DAILY_LOGS, logs);
  return logs;
};

// Remove a food log entry by id
export const removeFoodLog = (id) => {
  const logs = getItem(STORAGE_KEYS.DAILY_LOGS) || [];
  const filtered = logs.filter((log) => log.id !== id);
  setItem(STORAGE_KEYS.DAILY_LOGS, filtered);
  return filtered;
};

// Water log helpers
export const getWaterForDate = (date) => {
  const waterLog = getItem(STORAGE_KEYS.WATER_LOG) || {};
  return waterLog[date] || 0;
};

export const addWater = (date) => {
  const waterLog = getItem(STORAGE_KEYS.WATER_LOG) || {};
  waterLog[date] = (waterLog[date] || 0) + 1;
  setItem(STORAGE_KEYS.WATER_LOG, waterLog);
  return waterLog[date];
};

export const removeWater = (date) => {
  const waterLog = getItem(STORAGE_KEYS.WATER_LOG) || {};
  waterLog[date] = Math.max(0, (waterLog[date] || 0) - 1);
  setItem(STORAGE_KEYS.WATER_LOG, waterLog);
  return waterLog[date];
};

export { STORAGE_KEYS };
