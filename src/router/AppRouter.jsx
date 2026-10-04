import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './routes';
import ProtectedRoute from './ProtectedRoute';
import HomePage from '../pages/HomePage';
import RoleSelectPage from '../pages/RoleSelectPage';
import BuyerLogin from '../features/buyer/pages/auth/BuyerLogin';
import BuyerRegister from '../features/buyer/pages/auth/BuyerRegister';
import BuyerDashboardLayout from '../features/buyer/layout/BuyerDashboardLayout';
import { Skeleton } from '../components/ui';

// Lazy-loaded buyer dashboard sub-pages directly without barrel files for optimal code splitting
const Overview = lazy(() => import('../features/buyer/pages/dashboard/Overview.jsx'));
const Crops = lazy(() => import('../features/buyer/pages/dashboard/Crops.jsx'));
const Orders = lazy(() => import('../features/buyer/pages/dashboard/Orders.jsx'));
const Track = lazy(() => import('../features/buyer/pages/dashboard/Track.jsx'));
const Messages = lazy(() => import('../features/buyer/pages/dashboard/Messages.jsx'));
const Profile = lazy(() => import('../features/buyer/pages/dashboard/Profile.jsx'));

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
 * AppRouter Component
 * Centralizes all application routes, protected flows, and dashboard navigation.
 */
export default function AppRouter() {
  return (
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
      </Route>

      {/* 5. Wildcard Fallback */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
}
