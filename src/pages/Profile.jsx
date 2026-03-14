import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ThemeToggle from '../components/ThemeToggle';
import { calculateDailyCalories } from '../utils/nutritionCalculator';
import { calculateMacros } from '../utils/macroCalculator';

const ACTIVITY_LABELS = {
  sedentary: 'Sedentary',
  lightly_active: 'Lightly Active',
  moderately_active: 'Moderately Active',
  very_active: 'Very Active',
  extra_active: 'Extra Active',
};

const GOAL_LABELS = {
  lose: 'Lose Weight',
  maintain: 'Maintain Weight',
  gain: 'Gain Weight',
};

const Profile = () => {
  const { profile, setProfile, dailyCalories, macroGoals } = useApp();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile || {});

  if (!profile) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-bg flex items-center justify-center pb-safe">
        <div className="text-center animate-fade-in">
          <p className="text-5xl mb-4">👤</p>
          <p className="text-gray-500 mb-4">No profile set up yet</p>
          <button
            onClick={() => navigate('/onboarding')}
            className="px-6 py-3 bg-saffron text-white rounded-xl font-semibold min-h-[48px]"
          >
            Set Up Profile
          </button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    const updatedProfile = {
      ...form,
      age: parseInt(form.age),
      weight: parseFloat(form.weight),
      height: parseFloat(form.height),
    };
    setProfile(updatedProfile);
    setEditing(false);
  };

  const handleReset = () => {
    if (window.confirm('This will clear all your data and restart the app. Are you sure?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg pb-safe">
      <div className="px-5 pt-6 pb-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Profile</h1>
          <ThemeToggle />
        </div>
      </div>

      <div className="px-5 space-y-4">
        {/* Profile card */}
        <div className="glass-card rounded-2xl p-5 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-saffron to-orange-600 flex items-center justify-center text-2xl text-white font-bold shadow-lg">
              {profile.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{profile.name}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {profile.age}y • {profile.gender === 'male' ? '♂️' : '♀️'} • {profile.weight}kg • {profile.height}cm
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-saffron/10">
              <p className="text-xs text-gray-500 dark:text-gray-400">Daily Goal</p>
              <p className="text-lg font-bold text-saffron">{dailyCalories} kcal</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
              <p className="text-xs text-gray-500 dark:text-gray-400">Activity</p>
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{ACTIVITY_LABELS[profile.activityLevel]}</p>
            </div>
            <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
              <p className="text-xs text-gray-500 dark:text-gray-400">Goal</p>
              <p className="text-sm font-semibold text-green-600 dark:text-green-400">{GOAL_LABELS[profile.goal]}</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20">
              <p className="text-xs text-gray-500 dark:text-gray-400">BMI</p>
              <p className="text-lg font-bold text-purple-600">{(profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)}</p>
            </div>
          </div>
        </div>

        {/* Macro targets */}
        <div className="glass-card rounded-2xl p-5 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Daily Macro Targets</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
              <p className="text-xl font-bold text-blue-500">{macroGoals.protein}g</p>
              <p className="text-xs text-gray-500">Protein</p>
            </div>
            <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
              <p className="text-xl font-bold text-green-500">{macroGoals.carbs}g</p>
              <p className="text-xs text-gray-500">Carbs</p>
            </div>
            <div className="p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20">
              <p className="text-xl font-bold text-yellow-600">{macroGoals.fat}g</p>
              <p className="text-xs text-gray-500">Fat</p>
            </div>
          </div>
        </div>

        {/* Edit profile */}
        {editing ? (
          <div className="glass-card rounded-2xl p-5 space-y-3 animate-slide-up">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Edit Profile</h3>
            <input type="text" placeholder="Name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white outline-none focus:border-saffron min-h-[44px]" />
            <div className="grid grid-cols-3 gap-2">
              <input type="number" placeholder="Age" value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                className="px-3 py-3 rounded-xl bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border text-sm text-gray-900 dark:text-white outline-none focus:border-saffron min-h-[44px]" />
              <input type="number" placeholder="Weight" value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                className="px-3 py-3 rounded-xl bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border text-sm text-gray-900 dark:text-white outline-none focus:border-saffron min-h-[44px]" />
              <input type="number" placeholder="Height" value={form.height}
                onChange={(e) => setForm({ ...form, height: e.target.value })}
                className="px-3 py-3 rounded-xl bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border text-sm text-gray-900 dark:text-white outline-none focus:border-saffron min-h-[44px]" />
            </div>
            <select value={form.activityLevel}
              onChange={(e) => setForm({ ...form, activityLevel: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border text-sm text-gray-900 dark:text-white outline-none focus:border-saffron min-h-[44px]">
              {Object.entries(ACTIVITY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <select value={form.goal}
              onChange={(e) => setForm({ ...form, goal: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border text-sm text-gray-900 dark:text-white outline-none focus:border-saffron min-h-[44px]">
              {Object.entries(GOAL_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <div className="flex gap-3">
              <button onClick={() => setEditing(false)}
                className="flex-1 py-3 bg-gray-100 dark:bg-dark-card text-gray-600 dark:text-gray-300 rounded-xl font-semibold text-sm min-h-[48px]">
                Cancel
              </button>
              <button onClick={handleSave}
                className="flex-1 py-3 bg-saffron text-white rounded-xl font-semibold text-sm hover:bg-saffron-600 min-h-[48px]">
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={() => setEditing(true)}
              className="w-full py-3.5 bg-saffron text-white rounded-xl font-semibold text-sm hover:bg-saffron-600 transition-colors min-h-[48px]"
            >
              Edit Profile
            </button>
            <button
              onClick={() => navigate('/analytics')}
              className="w-full py-3.5 bg-gray-100 dark:bg-dark-card text-gray-600 dark:text-gray-300 rounded-xl font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors min-h-[48px]"
            >
              📊 View Analytics
            </button>
            <button
              onClick={() => navigate('/weight')}
              className="w-full py-3.5 bg-gray-100 dark:bg-dark-card text-gray-600 dark:text-gray-300 rounded-xl font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors min-h-[48px]"
            >
              ⚖️ Weight Tracker
            </button>
            <button
              onClick={handleReset}
              className="w-full py-3.5 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl font-semibold text-sm hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors min-h-[48px]"
            >
              Reset All Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
