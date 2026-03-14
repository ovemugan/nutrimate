// CalorieNinja API
// Free API key from: https://calorieninjas.com/api

const API_KEY = ''; // Add your CalorieNinja API key
const BASE_URL = 'https://api.calorieninjas.com/v1/nutrition';

export const searchCalorieNinja = async (query) => {
  try {
    if (!API_KEY) return null;

    const res = await fetch(`${BASE_URL}?query=${encodeURIComponent(query)}`, {
      headers: { 'X-Api-Key': API_KEY },
    });
    if (!res.ok) return null;
    const data = await res.json();

    if (!data.items || data.items.length === 0) return null;

    return data.items.map((item) => ({
      name: item.name || query,
      serving_size: item.serving_size_g || 100,
      serving_unit: 'g',
      calories: Math.round(item.calories || 0),
      protein: Math.round((item.protein_g || 0) * 10) / 10,
      carbs: Math.round((item.carbohydrates_total_g || 0) * 10) / 10,
      fat: Math.round((item.fat_total_g || 0) * 10) / 10,
      fiber: Math.round((item.fiber_g || 0) * 10) / 10,
      source: 'CalorieNinja',
    }));
  } catch {
    return null;
  }
};
