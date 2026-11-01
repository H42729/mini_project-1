// What this file does: Guards routes based on buyer authentication status ('auth' requires login, 'guest' requires unauthenticated).

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '../routes';

/**
 * ProtectedRoute Component
 * - mode='auth' (default): Protects private routes. Unauthenticated users go to ROUTES.BUYER_LOGIN.
 * - mode='guest': For guest/auth routes (login/register). Logged-in users go to ROUTES.BUYER_DASHBOARD.
 */
export function ProtectedRoute({ mode = 'auth', children }) {
  const hasSignedOut =
    typeof sessionStorage !== 'undefined' &&
    sessionStorage.getItem('buyer_explicit_signout') === 'true';

  let isAuthenticated = false;
  if (!hasSignedOut) {
    try {
      const raw =
        localStorage.getItem('buyer_current_profile') ||
        localStorage.getItem('buyer_registered_profile');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          isAuthenticated = true;
        }
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // If accessing protected buyer dashboard without valid credentials:
  // Redirect unauthenticated users to the login page
  if (mode === 'auth' && !isAuthenticated) {
    return <Navigate to={ROUTES.BUYER_LOGIN} replace />;
  }

  if (mode === 'guest' && isAuthenticated) {
    return <Navigate to={ROUTES.BUYER_DASHBOARD} replace />;
  }

  return children ? children : <Outlet />;
}

export default ProtectedRoute;
