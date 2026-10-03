import React from 'react';
import { AppRouter } from './router';
import { LanguageProvider } from './context/LanguageContext';

/**
 * Root Application Component
 * Wraps the application in LanguageProvider and delegates routing to AppRouter.
 * Profile state is managed directly within BuyerContext via localStorage ('buyer_current_profile').
 */
export default function App() {
  return (
    <LanguageProvider>
      <AppRouter />
    </LanguageProvider>
  );
}
