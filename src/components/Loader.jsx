import React from 'react';

const Loader = ({ text = 'Searching...', count = 3 }) => {
  return (
    <div className="space-y-3">
      {text && (
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center animate-pulse">{text}</p>
      )}
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl p-4 space-y-3" style={{ animationDelay: `${i * 100}ms` }}>
          <div className="flex justify-between items-start">
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-3 w-1/2" />
              <div className="flex gap-3">
                <div className="skeleton h-3 w-12" />
                <div className="skeleton h-3 w-10" />
                <div className="skeleton h-3 w-10" />
                <div className="skeleton h-3 w-10" />
              </div>
            </div>
            <div className="skeleton h-9 w-9 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loader;
