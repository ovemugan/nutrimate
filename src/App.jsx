import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import useOffline from './hooks/useOffline';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const LogFood = lazy(() => import('./pages/LogFood'));
const Presets = lazy(() => import('./pages/Presets'));
const Scan = lazy(() => import('./pages/Scan'));
const Profile = lazy(() => import('./pages/Profile'));
const Analytics = lazy(() => import('./pages/Analytics'));
const WeightTracker = lazy(() => import('./pages/WeightTracker'));
const Onboarding = lazy(() => import('./pages/Onboarding'));

// Page loader
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-bg">
    <div className="text-center animate-fade-in">
      <div className="text-4xl mb-3 animate-pulse">🥗</div>
      <p className="text-sm text-gray-400">Loading...</p>
    </div>
  </div>
);

// Auth guard — redirect to onboarding if no profile
const RequireProfile = ({ children }) => {
  const { profile } = useApp();
  if (!profile) return <Navigate to="/onboarding" replace />;
  return children;
};

// Offline banner component
const OfflineBanner = () => {
  const isOffline = useOffline();
  if (!isOffline) return null;
  return (
    <div className="offline-banner">
      ⚡ You're offline — showing cached data only
    </div>
  );
};

const AppContent = () => {
  return (
    <div className="max-w-lg mx-auto min-h-screen relative">
      <OfflineBanner />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/" element={<RequireProfile><Dashboard /></RequireProfile>} />
          <Route path="/log" element={<RequireProfile><LogFood /></RequireProfile>} />
          <Route path="/presets" element={<RequireProfile><Presets /></RequireProfile>} />
          <Route path="/scan" element={<RequireProfile><Scan /></RequireProfile>} />
          <Route path="/profile" element={<RequireProfile><Profile /></RequireProfile>} />
          <Route path="/analytics" element={<RequireProfile><Analytics /></RequireProfile>} />
          <Route path="/weight" element={<RequireProfile><WeightTracker /></RequireProfile>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Navbar />
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
};

export default App;
