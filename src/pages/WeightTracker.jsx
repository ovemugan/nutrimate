import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ThemeToggle from '../components/ThemeToggle';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WeightTracker = () => {
  const { weightHistory, addWeight, deleteWeight, isDark } = useApp();
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const textColor = isDark ? '#9ca3af' : '#6b7280';
  const gridColor = isDark ? '#374151' : '#e5e7eb';

  const handleAdd = () => {
    if (!weight || !date) return;
    addWeight({ date, weight: parseFloat(weight) });
    setWeight('');
  };

  const chartData = weightHistory.slice(-30).map((w) => ({
    date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: w.weight,
  }));

  const latestWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : null;
  const previousWeight = weightHistory.length > 1 ? weightHistory[weightHistory.length - 2].weight : null;
  const weightDiff = latestWeight && previousWeight ? (latestWeight - previousWeight).toFixed(1) : null;

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg pb-safe">
      <div className="px-5 pt-6 pb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Weight Tracker</h1>
          <ThemeToggle />
        </div>
      </div>

      <div className="px-5 space-y-4">
        {/* Current stats */}
        {latestWeight && (
          <div className="glass-card rounded-2xl p-5 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Current Weight</p>
                <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
                  {latestWeight} <span className="text-lg font-normal text-gray-400">kg</span>
                </p>
              </div>
              {weightDiff && (
                <div className={`px-3 py-1.5 rounded-full text-sm font-bold ${
                  parseFloat(weightDiff) > 0
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-500'
                    : parseFloat(weightDiff) < 0
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-500'
                    : 'bg-gray-100 dark:bg-dark-card text-gray-500'
                }`}>
                  {parseFloat(weightDiff) > 0 ? '+' : ''}{weightDiff} kg
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add weight form */}
        <div className="glass-card rounded-2xl p-5 animate-fade-in">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Log Weight</h3>
          <div className="flex gap-2">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 px-3 py-3 rounded-xl bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border text-sm text-gray-900 dark:text-white outline-none focus:border-saffron min-h-[48px]"
            />
            <input
              type="number"
              step="0.1"
              placeholder="kg"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-24 px-3 py-3 rounded-xl bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border text-sm text-gray-900 dark:text-white outline-none focus:border-saffron min-h-[48px]"
            />
            <button
              onClick={handleAdd}
              disabled={!weight}
              className="px-5 py-3 bg-saffron text-white rounded-xl font-bold text-sm hover:bg-saffron-600 transition-colors disabled:opacity-50 min-h-[48px]"
            >
              +
            </button>
          </div>
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <div className="glass-card rounded-2xl p-4 animate-fade-in">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">📈 Trend</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: textColor }} />
                  <YAxis tick={{ fontSize: 11, fill: textColor }} domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{
                      background: isDark ? '#1f2937' : '#fff',
                      border: `1px solid ${gridColor}`,
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                    formatter={(val) => [`${val} kg`, 'Weight']}
                  />
                  <Line type="monotone" dataKey="weight" stroke="#FF9933" strokeWidth={2.5} dot={{ fill: '#FF9933', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* History */}
        <div className="glass-card rounded-2xl p-4 animate-fade-in">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">History</h3>
          {weightHistory.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {[...weightHistory].reverse().map((entry, i) => {
                const prev = weightHistory.length > 1 && i < weightHistory.length - 1
                  ? [...weightHistory].reverse()[i + 1]
                  : null;
                const diff = prev ? (entry.weight - prev.weight).toFixed(1) : null;
                return (
                  <div key={entry.date} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-dark-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {diff && (
                        <span className={`text-xs font-medium ${
                          parseFloat(diff) > 0 ? 'text-red-400' : parseFloat(diff) < 0 ? 'text-green-400' : 'text-gray-400'
                        }`}>
                          {parseFloat(diff) > 0 ? '+' : ''}{diff}
                        </span>
                      )}
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{entry.weight} kg</span>
                      <button
                        onClick={() => deleteWeight(entry.date)}
                        className="text-red-400 hover:text-red-600 text-xs min-w-[28px] min-h-[28px] flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">No entries yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeightTracker;
