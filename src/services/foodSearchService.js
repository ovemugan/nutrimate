// Cascading food search service
// Priority: cache → local JSON → ICMR → USDA → CalorieNinja → OpenFoodFacts → manual entry

import { getCachedFood, saveFoodToCache } from '../utils/cacheManager';
import indianFoods from '../data/indianFoods.json';
import { searchICMR } from './apiICMR';
import { searchUSDA } from './apiUSDA';
import { searchCalorieNinja } from './apiCalorieNinja';
import { searchOpenFoodFacts } from './apiOpenFoodFacts';

// Search local Indian foods database
const searchLocalJSON = (query) => {
  const q = query.toLowerCase().trim();
  const results = indianFoods.filter(
    (food) =>
      food.name.toLowerCase().includes(q) ||
      food.category.toLowerCase().includes(q)
  );
  return results.length > 0 ? results : null;
};

// Main search function with cascading fallback
export const searchFood = async (query) => {
  if (!query || query.trim().length < 2) return [];

  const q = query.trim();

  // 1. Check cache
  const cached = getCachedFood(q);
  if (cached && cached.results) {
    return cached.results;
  }

  // 2. Search local JSON
  const localResults = searchLocalJSON(q);
  if (localResults && localResults.length > 0) {
    return localResults;
  }

  // 3-6. Try APIs in order (only if online)
  if (navigator.onLine) {
    // 3. ICMR
    try {
      const icmrResults = await searchICMR(q);
      if (icmrResults && icmrResults.length > 0) {
        saveFoodToCache(q, { results: icmrResults });
        return icmrResults;
      }
    } catch { /* continue */ }

    // 4. USDA
    try {
      const usdaResults = await searchUSDA(q);
      if (usdaResults && usdaResults.length > 0) {
        saveFoodToCache(q, { results: usdaResults });
        return usdaResults;
      }
    } catch { /* continue */ }

    // 5. CalorieNinja
    try {
      const ninjaResults = await searchCalorieNinja(q);
      if (ninjaResults && ninjaResults.length > 0) {
        saveFoodToCache(q, { results: ninjaResults });
        return ninjaResults;
      }
    } catch { /* continue */ }

    // 6. Open Food Facts
    try {
      const offResults = await searchOpenFoodFacts(q);
      if (offResults && offResults.length > 0) {
        saveFoodToCache(q, { results: offResults });
        return offResults;
      }
    } catch { /* continue */ }
  }

  // 7. Nothing found
  return [];
};

// Debounced search helper
let searchTimeout = null;
export const debouncedSearch = (query, callback, delay = 300) => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    const results = await searchFood(query);
    callback(results);
  }, delay);
};

export default searchFood;
