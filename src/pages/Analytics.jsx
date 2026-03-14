import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import ThemeToggle from '../components/ThemeToggle';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, ReferenceLine, Legend } from 'recharts';
import { getItem, STORAGE_KEYS } from '../utils/storage';

const Analytics = () => {
  const { dailyCalories, consumed, weightHistory, isDark } = useApp();

  const textColor = isDark ? '#9ca3af' : '#6b7280';
  const gridColor = isDark ? '#374151' : '#e5e7eb';

  // Weekly calorie data
  const weeklyData = useMemo(() => {
    const logs = getItem(STORAGE_KEYS.DAILY_LOGS) || [];
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayLogs = logs.filter((l) => l.date === dateStr);
      const total = dayLogs.reduce((sum, l) => sum + (l.calories || 0), 0);
      days.push({
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        calories: total,
        goal: dailyCalories,
      });
    }
    return days;
  }, [dailyCalories]);

  // Today's macro data  
  const macroData = useMemo(() => {
    if (consumed.protein + consumed.carbs + consumed.fat === 0) {
      return [
        { name: 'Protein', value: 1, color: '#3b82f6' },
        { name: 'Carbs', value: 1, color: '#22c55e' },
        { name: 'Fat', value: 1, color: '#f59e0b' },
      ];
    }
    return [
      { name: 'Protein', value: Math.round(consumed.protein), color: '#3b82f6' },
      { name: 'Carbs', value: Math.round(consumed.carbs), color: '#22c55e' },
      { name: 'Fat', value: Math.round(consumed.fat), color: '#f59e0b' },
    ];
  }, [consumed]);

  const macroTotal = macroData.reduce((sum, m) => sum + m.value, 0);

  // Weight chart data
  const weightData = useMemo(() => {
    return weightHistory.slice(-30).map((w) => ({
      date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: w.weight,
    }));
  }, [weightHistory]);

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg pb-safe">
      <div className="px-5 pt-6 pb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <ThemeToggle />
        </div>
      </div>

      <div className="px-5 space-y-4">
        {/* Weekly Calories Chart */}
        <div className="glass-card rounded-2xl p-4 animate-fade-in">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">📊 Weekly Calories</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: textColor }} />
                <YAxis tick={{ fontSize: 11, fill: textColor }} />
                <Tooltip
                  contentStyle={{
                    background: isDark ? '#1f2937' : '#fff',
                    border: `1px solid ${gridColor}`,
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <ReferenceLine y={dailyCalories} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'Goal', fill: '#ef4444', fontSize: 10 }} />
                <Bar dataKey="calories" fill="#FF9933" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Macro Pie Chart */}
        <div className="glass-card rounded-2xl p-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">🥧 Today's Macros</h3>
          <div className="h-52 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={45}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${Math.round(value / macroTotal * 100)}%`}
                  labelLine={false}
                >
                  {macroData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value}g`, name]}
                  contentStyle={{
                    background: isDark ? '#1f2937' : '#fff',
                    border: `1px solid ${gridColor}`,
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  formatter={(value) => <span style={{ color: textColor, fontSize: '11px' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weight Progress Chart */}
        <div className="glass-card rounded-2xl p-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">⚖️ Weight Progress</h3>
          {weightData.length > 0 ? (
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
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
                  />
                  <Line type="monotone" dataKey="weight" stroke="#FF9933" strokeWidth={2.5} dot={{ fill: '#FF9933', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-4xl mb-2">⚖️</p>
              <p className="text-sm text-gray-400">No weight data yet. Start logging your weight!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
