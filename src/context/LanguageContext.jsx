/* oxlint-disable react/only-export-components */
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

/**
 * LanguageContext
 * Manages global bilingual state ('en' | 'ta') across the entire application.
 * Persists selected language to localStorage and synchronizes with document.documentElement.lang.
 */
export const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
  toggleLang: () => {},
});

const STORAGE_KEY = 'naam_uzhavar_lang';

export function LanguageProvider({ children, initialLang = 'en' }) {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'ta' || saved === 'en') {
        return saved;
      }
    } catch {
      // Ignore localStorage access issues
    }
    return initialLang;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore localStorage access issues
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const toggleLang = () => {
    setLang((prev) => (prev === 'ta' ? 'en' : 'ta'));
  };

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggleLang,
    }),
    [lang]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
