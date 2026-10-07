// What this file does: Main application component with route definitions, lazy loading, and language provider wrapper.

import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ROUTES } from './routes';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import RoleSelectPage from './pages/RoleSelectPage';
import BuyerLogin from './pages/BuyerLogin';
import BuyerRegister from './pages/BuyerRegister';
import BuyerDashboardLayout from './components/BuyerDashboardLayout';
import Skeleton from './components/Skeleton';

// Lazy-loaded buyer dashboard sub-pages directly without barrel files for optimal code splitting
const Overview = lazy(() => import('./pages/buyer/Overview.jsx'));
const Crops = lazy(() => import('./pages/buyer/Crops.jsx'));
const Orders = lazy(() => import('./pages/buyer/Orders.jsx'));
const Track = lazy(() => import('./pages/buyer/Track.jsx'));
const Messages = lazy(() => import('./pages/buyer/Messages.jsx'));
const Profile = lazy(() => import('./pages/buyer/Profile.jsx'));

/**
 * Fallback skeleton loader during lazy chunk transition
 */
function DashboardPageFallback() {
  return (
    <div className="buyer-view-container animate-fade-in" style={{ padding: '8px 0' }}>
      <Skeleton variant="card" height={320} />
    </div>
  );
}

/**
 * App Component
 * Wraps application in LanguageProvider and defines top-level route tree.
 */
export default function App() {
  return (
    <LanguageProvider>
      <Routes>
        {/* 1. Public Home Landing Page */}
        <Route path={ROUTES.HOME} element={<HomePage />} />

        {/* 2. Unified Role Selection */}
        <Route path={ROUTES.ROLE_SELECT} element={<RoleSelectPage />} />

        {/* 3. Buyer Portal Auth: Login & Register (Guest Protected: logged in users go to dashboard) */}
        <Route
          path={ROUTES.BUYER_LOGIN}
          element={
            <ProtectedRoute mode="guest">
              <BuyerLogin />
            </ProtectedRoute>
          }
        />
        <Route path="/buyer/login" element={<Navigate to={ROUTES.BUYER_LOGIN} replace />} />
        <Route
          path={ROUTES.BUYER_REGISTER}
          element={
            <ProtectedRoute mode="guest">
              <BuyerRegister />
            </ProtectedRoute>
          }
        />
        <Route path="/buyer/register" element={<Navigate to={ROUTES.BUYER_REGISTER} replace />} />

        {/* Buyer dashboard alias routes (supports slash-separated /buyer and /buyer/dashboard/* paths) */}
        <Route path="/buyer" element={<Navigate to={ROUTES.BUYER_DASHBOARD} replace />} />
        <Route path="/buyer/dashboard" element={<Navigate to={ROUTES.BUYER_DASHBOARD} replace />} />
        <Route path="/buyer/dashboard/crops" element={<Navigate to={ROUTES.BUYER_DASHBOARD_CROPS} replace />} />
        <Route path="/buyer/dashboard/orders" element={<Navigate to={ROUTES.BUYER_DASHBOARD_ORDERS} replace />} />
        <Route path="/buyer/dashboard/track" element={<Navigate to={ROUTES.BUYER_DASHBOARD_TRACK} replace />} />
        <Route path="/buyer/dashboard/messages" element={<Navigate to={ROUTES.BUYER_DASHBOARD_MESSAGES} replace />} />
        <Route path="/buyer/dashboard/profile" element={<Navigate to={ROUTES.BUYER_DASHBOARD_PROFILE} replace />} />
        <Route path="/buyer/dashboard/*" element={<Navigate to={ROUTES.BUYER_DASHBOARD} replace />} />

        {/* 4. Commercial Buyer Hub Dashboard (Auth Protected: unauthenticated go to login) */}
        <Route
          path={ROUTES.BUYER_DASHBOARD}
          element={
            <ProtectedRoute mode="auth">
              <BuyerDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <Suspense fallback={<DashboardPageFallback />}>
                <Overview />
              </Suspense>
            }
          />
          <Route
            path="crops"
            element={
              <Suspense fallback={<DashboardPageFallback />}>
                <Crops />
              </Suspense>
            }
          />
          <Route
            path="orders"
            element={
              <Suspense fallback={<DashboardPageFallback />}>
                <Orders />
              </Suspense>
            }
          />
          <Route
            path="track"
            element={
              <Suspense fallback={<DashboardPageFallback />}>
                <Track />
              </Suspense>
            }
          />
          <Route
            path="messages"
            element={
              <Suspense fallback={<DashboardPageFallback />}>
                <Messages />
              </Suspense>
            }
          />
          <Route
            path="profile"
            element={
              <Suspense fallback={<DashboardPageFallback />}>
                <Profile />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to={ROUTES.BUYER_DASHBOARD} replace />} />
        </Route>

        {/* 5. Wildcard Fallback */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </LanguageProvider>
  );
}
