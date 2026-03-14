import React from 'react';
import { useApp } from '../context/AppContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useApp();

  return (
    <button
      onClick={toggleTheme}
      className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 active:scale-95"
      aria-label="Toggle theme"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="text-lg transition-transform duration-300" style={{ transform: isDark ? 'rotate(180deg)' : 'rotate(0deg)' }}>
        {isDark ? '☀️' : '🌙'}
      </span>
    </button>
  );
};

export default ThemeToggle;
