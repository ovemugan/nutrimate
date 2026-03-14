// Open Food Facts API
// No API key needed

const SEARCH_URL = 'https://world.openfoodfacts.org/cgi/search.pl';
const BARCODE_URL = 'https://world.openfoodfacts.org/api/v0/product';

// Search products by name
export const searchOpenFoodFacts = async (query) => {
  try {
    const url = `${SEARCH_URL}?search_terms=${encodeURIComponent(query)}&json=1&page_size=10&search_simple=1`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();

    if (!data.products || data.products.length === 0) return null;

    return data.products
      .filter((p) => p.product_name && p.nutriments)
      .map((p) => ({
        name: p.product_name,
        brand: p.brands || '',
        serving_size: 100,
        serving_unit: 'g',
        calories: Math.round(p.nutriments['energy-kcal_100g'] || p.nutriments.energy_100g / 4.184 || 0),
        protein: Math.round((p.nutriments.proteins_100g || 0) * 10) / 10,
        carbs: Math.round((p.nutriments.carbohydrates_100g || 0) * 10) / 10,
        fat: Math.round((p.nutriments.fat_100g || 0) * 10) / 10,
        fiber: Math.round((p.nutriments.fiber_100g || 0) * 10) / 10,
        barcode: p.code || '',
        image: p.image_small_url || '',
        source: 'OpenFoodFacts',
      }));
  } catch {
    return null;
  }
};

// Get product by barcode
export const getProductByBarcode = async (barcode) => {
  try {
    const res = await fetch(`${BARCODE_URL}/${barcode}.json`);
    if (!res.ok) return null;
    const data = await res.json();

    if (data.status !== 1 || !data.product) return null;

    const p = data.product;
    const n = p.nutriments || {};

    return {
      name: p.product_name || 'Unknown Product',
      brand: p.brands || '',
      serving_size: 100,
      serving_unit: 'g',
      calories: Math.round(n['energy-kcal_100g'] || n.energy_100g / 4.184 || 0),
      protein: Math.round((n.proteins_100g || 0) * 10) / 10,
      carbs: Math.round((n.carbohydrates_100g || 0) * 10) / 10,
      fat: Math.round((n.fat_100g || 0) * 10) / 10,
      fiber: Math.round((n.fiber_100g || 0) * 10) / 10,
      barcode,
      image: p.image_small_url || '',
      source: 'OpenFoodFacts',
    };
  } catch {
    return null;
  }
};
