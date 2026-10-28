// What this file does: App entrance splash and logo loader screen that displays before the Home Page opens.
// Viva Note: Introduces the Naam Uzhavar brand identity, logo, and core mission on initial platform entry.

import React, { useState, useEffect, useCallback } from 'react';
import { Sprout, Sparkles } from 'lucide-react';
import './AppSplashLoader.css';
import { useT } from '../hooks/useT';

/**
 * AppSplashLoader Component
 *
 * @param {Object} props
 * @param {number} [props.duration=1800] - Duration in ms before transitioning to the Home Page.
 * @param {Function} props.onFinish - Callback invoked when the intro completes.
 */
export default function AppSplashLoader({ duration = 1800, onFinish }) {
  const { t, lang } = useT('splash');
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [statusText, setStatusText] = useState('Initializing agricultural platform...');

  const handleExit = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      if (typeof onFinish === 'function') {
        onFinish();
      }
    }, 380);
  }, [onFinish]);

  useEffect(() => {
    const startTime = Date.now();
    const intervalTime = 30;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 40) {
        setStatusText(
          lang === 'ta'
            ? 'வேளாண் தளம் தொடங்கப்படுகிறது...'
            : t('step1') || 'Starting Naam Uzhavar platform...'
        );
      } else if (pct < 80) {
        setStatusText(
          lang === 'ta'
            ? 'மண்டல மையங்கள் இணைக்கப்படுகின்றன...'
            : t('step2') || 'Connecting regional hubs & verified farmers...'
        );
      } else {
        setStatusText(
          lang === 'ta'
            ? 'நாம் உழவர் தளத்திற்கு நல்வரவு!'
            : t('step3') || 'Welcome to Naam Uzhavar • நாம் உழவர்'
        );
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        handleExit();
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [duration, handleExit, lang, t]);

  return (
    <div
      className={`nu-splash-overlay ${isExiting ? 'is-exiting' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Naam Uzhavar Loading Screen"
    >
      <div className="nu-splash-ambient-aura" aria-hidden="true" />

      <div className="nu-splash-container">
        {/* Brand Logo Presentation with Glow and Orbit */}
        <div className="nu-splash-logo-box">
          <div className="nu-splash-logo-aura" aria-hidden="true" />
          <div className="nu-splash-orbit-ring" aria-hidden="true" />

          <div className="nu-splash-logo-circle">
            <img
              src="/logo.jpg"
              alt="Naam Uzhavar Official Logo"
              className="nu-splash-logo-img"
              onError={(e) => {
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=200&auto=format&fit=crop&q=80';
              }}
            />
          </div>

          <div className="nu-splash-leaf-badge" aria-hidden="true">
            <Sprout size={18} strokeWidth={2.4} />
          </div>
        </div>

        {/* Region & Mission Badge */}
        <div className="nu-splash-badge">
          <Sparkles size={13} />
          <span>
            {lang === 'ta'
              ? 'தமிழ்நாடு • நேரடி வேளாண் சந்தை'
              : 'Direct Agri-Marketplace • Tamil Nadu'}
          </span>
        </div>

        {/* Bilingual App Titles */}
        <h1 className="nu-splash-title">Naam Uzhavar</h1>
        <h2 className="nu-splash-tamil-title">நாம் உழவர்</h2>

        <p className="nu-splash-subtitle">
          {lang === 'ta'
            ? 'விவசாயிகள் • வாங்குவோர் • ஓட்டுநர்கள் — இடைத்தரகர் இல்லாத வணிகம்'
            : 'Farmers • Buyers • Drivers — Zero Middlemen'}
        </p>

        {/* Animated Progress Bar & Telemetry Status */}
        <div className="nu-splash-progress-wrapper">
          <div className="nu-splash-track" aria-hidden="true">
            <div
              className="nu-splash-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="nu-splash-status-text" aria-live="polite">
            <span className="nu-live-dot" />
            <span>{statusText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

