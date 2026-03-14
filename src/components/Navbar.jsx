import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/log', label: 'Log Food', icon: '🍽️' },
  { path: '/presets', label: 'Presets', icon: '📋' },
  { path: '/scan', label: 'Scan', icon: '📷' },
  { path: '/profile', label: 'Profile', icon: '👤' },
];

const Navbar = () => {
  const location = useLocation();

  // Hide navbar on onboarding
  if (location.pathname === '/onboarding') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-dark-bg border-t border-gray-200 dark:border-dark-border shadow-[0_-4px_20px_rgba(0,0,0,0.08)]" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex justify-around items-center max-w-lg mx-auto h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-xl transition-all duration-200"
            >
              <span
                className={`text-xl mb-0.5 transition-transform duration-200 ${
                  isActive ? 'scale-110' : ''
                }`}
              >
                {item.icon}
              </span>
              <span
                className={`text-[10px] font-semibold transition-colors duration-200 ${
                  isActive
                    ? 'text-saffron'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 w-8 h-0.5 bg-saffron rounded-full" />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
