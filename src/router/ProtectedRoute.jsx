import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from './routes';

/**
 * ProtectedRoute Component
 * - mode='auth' (default): Protects private routes. Unauthenticated users go to ROUTES.BUYER_LOGIN.
 * - mode='guest': For guest/auth routes (login/register). Logged-in users go to ROUTES.BUYER_DASHBOARD.
 */
export function ProtectedRoute({ mode = 'auth', children }) {
  let isAuthenticated = false;
  try {
    const raw = localStorage.getItem('buyer_current_profile');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        isAuthenticated = true;
      }
    }
  } catch {
    isAuthenticated = false;
  }

  if (mode === 'auth' && !isAuthenticated) {
    return <Navigate to={ROUTES.BUYER_LOGIN} replace />;
  }

  if (mode === 'guest' && isAuthenticated) {
    return <Navigate to={ROUTES.BUYER_DASHBOARD} replace />;
  }

  return children ? children : <Outlet />;
}

export default ProtectedRoute;
