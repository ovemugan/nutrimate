// ICMR-NIN Indian Nutrient Databank API
// Open access Indian food composition database
// Note: This uses the IFCT (Indian Food Composition Tables) data
// The actual ICMR API may vary; this provides a fallback search through known endpoints

const BASE_URL = 'https://api.ifct2017.com/v1';

export const searchICMR = async (query) => {
  try {
    // Try IFCT API endpoint
    const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}&limit=10`);
    if (!res.ok) return null;
    const data = await res.json();

    if (!data || !Array.isArray(data) || data.length === 0) return null;

    return data.map((item) => ({
      name: item.name || item.food_name || query,
      serving_size: 100,
      serving_unit: 'g',
      calories: Math.round(item.energy || item.calories || 0),
      protein: Math.round((item.protein || 0) * 10) / 10,
      carbs: Math.round((item.carbohydrate || item.carbs || 0) * 10) / 10,
      fat: Math.round((item.fat || item.total_fat || 0) * 10) / 10,
      fiber: Math.round((item.fiber || item.dietary_fiber || 0) * 10) / 10,
      iron: Math.round((item.iron || 0) * 10) / 10,
      calcium: Math.round((item.calcium || 0) * 10) / 10,
      source: 'ICMR',
    }));
  } catch {
    return null;
  }
};
