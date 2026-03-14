import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const STEPS = [
  { key: 'welcome', title: 'Welcome to NutriMate', subtitle: 'Your smart calorie tracker for hostel life' },
  { key: 'name', title: "What's your name?", subtitle: 'Let us personalize your experience' },
  { key: 'basics', title: 'Tell us about yourself', subtitle: 'We need this to calculate your calorie needs' },
  { key: 'activity', title: 'Activity Level', subtitle: 'How active are you on a daily basis?' },
  { key: 'goal', title: "What's your goal?", subtitle: 'We\'ll adjust your calorie target accordingly' },
];

const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise, desk job', icon: '🪑' },
  { value: 'lightly_active', label: 'Lightly Active', desc: 'Light exercise 1-3 days/week', icon: '🚶' },
  { value: 'moderately_active', label: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week', icon: '🏃' },
  { value: 'very_active', label: 'Very Active', desc: 'Hard exercise 6-7 days/week', icon: '💪' },
  { value: 'extra_active', label: 'Extra Active', desc: 'Very hard exercise, physical job', icon: '🔥' },
];

const GOALS = [
  { value: 'lose', label: 'Lose Weight', desc: 'Calorie deficit (-500 kcal/day)', icon: '📉', color: 'from-blue-500 to-cyan-500' },
  { value: 'maintain', label: 'Maintain Weight', desc: 'Stay at current weight', icon: '⚖️', color: 'from-green-500 to-emerald-500' },
  { value: 'gain', label: 'Gain Weight', desc: 'Calorie surplus (+300 kcal/day)', icon: '📈', color: 'from-orange-500 to-red-500' },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { setProfile } = useApp();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: 'male',
    weight: '',
    height: '',
    activityLevel: '',
    goal: '',
  });

  const updateForm = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const canProceed = () => {
    switch (step) {
      case 0: return true;
      case 1: return form.name.trim().length > 0;
      case 2: return form.age && form.weight && form.height;
      case 3: return form.activityLevel;
      case 4: return form.goal;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      const profile = {
        ...form,
        age: parseInt(form.age),
        weight: parseFloat(form.weight),
        height: parseFloat(form.height),
      };
      setProfile(profile);
      navigate('/', { replace: true });
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="flex flex-col items-center text-center py-8 animate-fade-in">
            <div className="text-7xl mb-6">🥗</div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-saffron to-orange-600 bg-clip-text text-transparent mb-3">
              NutriMate
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs leading-relaxed">
              Track your meals, scan barcodes, and stay on top of your nutrition — even in a hostel!
            </p>
            <div className="flex gap-3 mt-8">
              {['🍛', '📊', '📷', '💧'].map((emoji, i) => (
                <div key={i} className="w-12 h-12 rounded-xl bg-saffron-light dark:bg-saffron-dark/30 flex items-center justify-center text-xl animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                  {emoji}
                </div>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4 animate-fade-in">
            <input
              type="text"
              placeholder="Enter your name"
              value={form.name}
              onChange={(e) => updateForm('name', e.target.value)}
              className="w-full text-center text-2xl font-semibold bg-transparent border-b-2 border-gray-200 dark:border-dark-border focus:border-saffron outline-none py-3 text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 transition-colors"
              autoFocus
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-5 animate-fade-in">
            {/* Gender */}
            <div className="flex gap-3">
              {['male', 'female'].map((g) => (
                <button
                  key={g}
                  onClick={() => updateForm('gender', g)}
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-200 min-h-[48px] ${
                    form.gender === g
                      ? 'bg-saffron text-white shadow-lg shadow-saffron/25'
                      : 'bg-gray-100 dark:bg-dark-card text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {g === 'male' ? '♂️ Male' : '♀️ Female'}
                </button>
              ))}
            </div>

            {/* Age */}
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Age</label>
              <input
                type="number"
                placeholder="e.g. 20"
                value={form.age}
                onChange={(e) => updateForm('age', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white outline-none focus:border-saffron transition-colors min-h-[48px]"
              />
            </div>

            {/* Weight & Height */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Weight (kg)</label>
                <input
                  type="number"
                  placeholder="e.g. 65"
                  value={form.weight}
                  onChange={(e) => updateForm('weight', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white outline-none focus:border-saffron transition-colors min-h-[48px]"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Height (cm)</label>
                <input
                  type="number"
                  placeholder="e.g. 170"
                  value={form.height}
                  onChange={(e) => updateForm('height', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white outline-none focus:border-saffron transition-colors min-h-[48px]"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-2.5 animate-fade-in">
            {ACTIVITY_LEVELS.map((level) => (
              <button
                key={level.value}
                onClick={() => updateForm('activityLevel', level.value)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all duration-200 min-h-[56px] ${
                  form.activityLevel === level.value
                    ? 'bg-saffron/10 border-2 border-saffron'
                    : 'bg-gray-50 dark:bg-dark-card border-2 border-transparent'
                }`}
              >
                <span className="text-2xl">{level.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{level.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{level.desc}</p>
                </div>
              </button>
            ))}
          </div>
        );

      case 4:
        return (
          <div className="space-y-3 animate-fade-in">
            {GOALS.map((goal) => (
              <button
                key={goal.value}
                onClick={() => updateForm('goal', goal.value)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-200 min-h-[72px] ${
                  form.goal === goal.value
                    ? 'bg-saffron/10 border-2 border-saffron shadow-lg'
                    : 'bg-gray-50 dark:bg-dark-card border-2 border-transparent'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${goal.color} flex items-center justify-center text-xl shadow-md`}>
                  {goal.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{goal.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{goal.desc}</p>
                </div>
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-dark-bg px-5 py-6">
      {/* Progress */}
      <div className="flex gap-1.5 mb-6">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1 rounded-full transition-all duration-300 ${
              i <= step ? 'bg-saffron' : 'bg-gray-200 dark:bg-dark-border'
            }`}
          />
        ))}
      </div>

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{STEPS[step].title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{STEPS[step].subtitle}</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">{renderStep()}</div>

      {/* Navigation */}
      <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-dark-border">
        {step > 0 && (
          <button
            onClick={handleBack}
            className="px-6 py-3.5 rounded-xl font-semibold text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-dark-card min-h-[48px] hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Back
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className={`flex-1 py-3.5 rounded-xl font-semibold text-sm min-h-[48px] transition-all duration-200 ${
            canProceed()
              ? 'bg-saffron text-white shadow-lg shadow-saffron/25 hover:bg-saffron-600 active:scale-[0.98]'
              : 'bg-gray-200 dark:bg-dark-border text-gray-400 cursor-not-allowed'
          }`}
        >
          {step === STEPS.length - 1 ? "Let's Go! 🚀" : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
