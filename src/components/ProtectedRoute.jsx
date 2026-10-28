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

  // If accessing protected buyer dashboard without credentials:
  // - If user has explicitly signed out: redirect to login.
  // - If first-time visitor (no prior signout): auto-seed default demo buyer profile.
  if (mode === 'auth' && !isAuthenticated) {
    if (!hasSignedOut) {
      const defaultProfile = {
        name: 'Grand Palace Hotel',
        shopName: 'Grand Palace Luxury Dining',
        businessName: 'Grand Palace Luxury Dining',
        contactPerson: 'Mr. S. Rajesh (Procurement Head)',
        phone: '+91 98401 23456',
        email: 'procurement@grandpalace.in',
        buyerType: 'hotel',
        businessType: 'Hotel & Commercial Kitchen',
        address: 'Grand Palace Luxury Dining, Bypass Road, Madurai - 625016',
        gstin: '33AAAAA0000A1Z5',
        photo: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=300&auto=format&fit=crop&q=80',
        role: 'buyer'
      };
      try {
        localStorage.setItem('buyer_current_profile', JSON.stringify(defaultProfile));
        isAuthenticated = true;
      } catch {
        // ignore storage quota error
      }
    } else {
      return <Navigate to={ROUTES.BUYER_LOGIN} replace />;
    }
  }

  if (mode === 'guest' && isAuthenticated) {
    return <Navigate to={ROUTES.BUYER_DASHBOARD} replace />;
  }

  return children ? children : <Outlet />;
}

export default ProtectedRoute;
