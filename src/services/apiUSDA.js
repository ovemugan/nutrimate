// USDA FoodData Central API
// Free API key from: https://fdc.nal.usda.gov/api-key-signup.html

const API_KEY = 'DEMO_KEY'; // Replace with your own key
const BASE_URL = 'https://api.nal.usda.gov/fdc/v1/foods/search';

export const searchUSDA = async (query) => {
  try {
    const url = `${BASE_URL}?query=${encodeURIComponent(query)}&api_key=${API_KEY}&pageSize=10&dataType=Foundation,SR%20Legacy`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();

    if (!data.foods || data.foods.length === 0) return null;

    return data.foods.map((food) => {
      const nutrients = {};
      (food.foodNutrients || []).forEach((n) => {
        if (n.nutrientName === 'Energy') nutrients.calories = Math.round(n.value || 0);
        if (n.nutrientName === 'Protein') nutrients.protein = Math.round((n.value || 0) * 10) / 10;
        if (n.nutrientName === 'Carbohydrate, by difference') nutrients.carbs = Math.round((n.value || 0) * 10) / 10;
        if (n.nutrientName === 'Total lipid (fat)') nutrients.fat = Math.round((n.value || 0) * 10) / 10;
        if (n.nutrientName === 'Fiber, total dietary') nutrients.fiber = Math.round((n.value || 0) * 10) / 10;
      });

      return {
        name: food.description,
        serving_size: 100,
        serving_unit: 'g',
        calories: nutrients.calories || 0,
        protein: nutrients.protein || 0,
        carbs: nutrients.carbs || 0,
        fat: nutrients.fat || 0,
        fiber: nutrients.fiber || 0,
        source: 'USDA',
      };
    });
  } catch {
    return null;
  }
};
