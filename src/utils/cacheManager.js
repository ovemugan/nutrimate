// Cache manager for food and barcode data
import { getItem, setItem, STORAGE_KEYS } from './storage';

const CACHE_EXPIRY_DAYS = 30;

// Check if a cache entry has expired
const isExpired = (cachedAt) => {
  if (!cachedAt) return true;
  const now = Date.now();
  const diff = now - cachedAt;
  return diff > CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
};

// Get food from cache by query
export const getCachedFood = (query) => {
  const cache = getItem(STORAGE_KEYS.FOOD_CACHE) || {};
  const key = query.toLowerCase().trim();
  const entry = cache[key];
  if (entry && !isExpired(entry.cachedAt)) {
    return entry;
  }
  if (entry && isExpired(entry.cachedAt)) {
    delete cache[key];
    setItem(STORAGE_KEYS.FOOD_CACHE, cache);
  }
  return null;
};

// Save food to cache
export const saveFoodToCache = (query, data) => {
  const cache = getItem(STORAGE_KEYS.FOOD_CACHE) || {};
  const key = query.toLowerCase().trim();
  cache[key] = { ...data, cachedAt: Date.now() };
  setItem(STORAGE_KEYS.FOOD_CACHE, cache);
};

// Get barcode from cache
export const getCachedBarcode = (barcode) => {
  const cache = getItem(STORAGE_KEYS.BARCODE_CACHE) || {};
  return cache[barcode] || null;
};

// Save barcode to cache (no expiry)
export const saveBarcodeToCache = (barcode, data) => {
  const cache = getItem(STORAGE_KEYS.BARCODE_CACHE) || {};
  cache[barcode] = data;
  setItem(STORAGE_KEYS.BARCODE_CACHE, cache);
};

// Clean expired food cache entries
export const cleanExpiredCache = () => {
  const cache = getItem(STORAGE_KEYS.FOOD_CACHE) || {};
  let changed = false;
  for (const key of Object.keys(cache)) {
    if (isExpired(cache[key].cachedAt)) {
      delete cache[key];
      changed = true;
    }
  }
  if (changed) setItem(STORAGE_KEYS.FOOD_CACHE, cache);
};
