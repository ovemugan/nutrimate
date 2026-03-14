import React, { useState } from 'react';
import BarcodeScanner from '../components/BarcodeScanner';
import ThemeToggle from '../components/ThemeToggle';
import { getProductByBarcode } from '../services/apiOpenFoodFacts';
import { getCachedBarcode, saveBarcodeToCache } from '../utils/cacheManager';
import { useApp } from '../context/AppContext';
import { v4 as uuidv4 } from 'uuid';

const MEALS = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'snacks', label: 'Snacks' },
  { value: 'dinner', label: 'Dinner' },
];

const Scan = () => {
  const { logFood, today } = useApp();
  const [scanning, setScanning] = useState(true);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMeal, setSelectedMeal] = useState('snacks');
  const [logged, setLogged] = useState(false);

  const handleScan = async (barcode) => {
    setScanning(false);
    setLoading(true);
    setError('');
    setProduct(null);

    // Check cache first
    const cached = getCachedBarcode(barcode);
    if (cached) {
      setProduct(cached);
      setLoading(false);
      return;
    }

    // Fetch from API
    const result = await getProductByBarcode(barcode);
    if (result) {
      saveBarcodeToCache(barcode, result);
      setProduct(result);
    } else {
      setError(`Product not found for barcode: ${barcode}`);
    }
    setLoading(false);
  };

  const handleLog = () => {
    if (!product) return;
    logFood({
      id: uuidv4(),
      date: today,
      meal: selectedMeal,
      foodName: product.name,
      servingSize: product.serving_size,
      servingUnit: product.serving_unit,
      quantity: 1,
      calories: product.calories,
      protein: product.protein,
      carbs: product.carbs,
      fat: product.fat,
      fiber: product.fiber || 0,
    });
    setLogged(true);
    setTimeout(() => {
      setLogged(false);
      setProduct(null);
      setScanning(true);
    }, 1500);
  };

  const handleRetry = () => {
    setProduct(null);
    setError('');
    setScanning(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg pb-safe">
      <div className="px-5 pt-6 pb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Scan Barcode</h1>
          <ThemeToggle />
        </div>
      </div>

      <div className="px-5 space-y-4">
        {/* Scanner */}
        {scanning && (
          <div className="animate-fade-in">
            <BarcodeScanner
              onScan={handleScan}
              onError={(err) => setError(err)}
            />
            <p className="text-center text-xs text-gray-400 mt-3">
              Point your camera at a product barcode
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12 animate-fade-in">
            <div className="inline-block animate-spin text-4xl mb-3">⏳</div>
            <p className="text-sm text-gray-500">Looking up product...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-8 animate-fade-in">
            <p className="text-4xl mb-3">😕</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-saffron text-white rounded-xl font-semibold text-sm min-h-[48px]"
            >
              Scan Again
            </button>
          </div>
        )}

        {/* Product found */}
        {product && !loading && (
          <div className="glass-card rounded-2xl p-5 space-y-4 animate-slide-up">
            <div className="text-center">
              {product.image && (
                <img src={product.image} alt={product.name} className="w-20 h-20 object-contain mx-auto mb-3 rounded-xl" />
              )}
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">{product.name}</h3>
              {product.brand && <p className="text-xs text-gray-500">{product.brand}</p>}
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded-xl bg-saffron/10">
                <p className="text-lg font-bold text-saffron">{product.calories}</p>
                <p className="text-[10px] text-gray-500">kcal</p>
              </div>
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                <p className="text-lg font-bold text-blue-500">{product.protein}</p>
                <p className="text-[10px] text-gray-500">Protein</p>
              </div>
              <div className="p-2 rounded-xl bg-green-50 dark:bg-green-900/20">
                <p className="text-lg font-bold text-green-500">{product.carbs}</p>
                <p className="text-[10px] text-gray-500">Carbs</p>
              </div>
              <div className="p-2 rounded-xl bg-yellow-50 dark:bg-yellow-900/20">
                <p className="text-lg font-bold text-yellow-600">{product.fat}</p>
                <p className="text-[10px] text-gray-500">Fat</p>
              </div>
            </div>

            <div className="flex gap-2">
              {MEALS.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setSelectedMeal(m.value)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all min-h-[36px] ${
                    selectedMeal === m.value
                      ? 'bg-saffron text-white'
                      : 'bg-gray-100 dark:bg-dark-card text-gray-500'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRetry}
                className="flex-1 py-3 bg-gray-100 dark:bg-dark-card text-gray-600 dark:text-gray-300 rounded-xl font-semibold text-sm min-h-[48px]"
              >
                Scan Again
              </button>
              <button
                onClick={handleLog}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm min-h-[48px] transition-all ${
                  logged
                    ? 'bg-green-500 text-white'
                    : 'bg-saffron text-white hover:bg-saffron-600 shadow-lg shadow-saffron/25'
                }`}
              >
                {logged ? '✓ Logged!' : 'Add to Log'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scan;
