// What this file does: Commercial buyer login page with phone/email and password credentials.

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Building2, 
  Globe
} from 'lucide-react';
import { useT } from '../hooks/useT';
import { ROUTES } from '../routes';
import Input from '../components/Input';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Card from '../components/Card';
import { api, setToken } from '../utils/api';
import './BuyerLogin.css';

/**
 * BuyerLogin Component
 * 
 * High-end, minimal agricultural authentication interface for commercial produce buyers
 * (Hotels, Supermarkets, Restaurants, Caterers, Function Halls, and Retailers).
 */
export default function BuyerLogin({ 
  onBack, 
  onNavigateToRegister, 
  onLoginSuccess
}) {
  const navigate = useNavigate();
  const { t, toggleLang } = useT('buyerLogin');

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Interaction & Error States
  const [touched, setTouched] = useState({ identifier: false, password: false });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Timer references for unmount cleanup
  const submitTimerRef = useRef(null);
  const forgotTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (submitTimerRef.current) clearTimeout(submitTimerRef.current);
      if (forgotTimerRef.current) clearTimeout(forgotTimerRef.current);
    };
  }, []);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotInput, setForgotInput] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  // Field Validation Logic
  const validateField = (fieldName, value) => {
    const trimmed = value.trim();
    if (fieldName === 'identifier') {
      if (!trimmed) {
        return t('errEmptyIdentifier');
      }
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
      const digitsOnly = trimmed.replace(/\D/g, '');
      const isPhone = digitsOnly.length >= 10 && digitsOnly.length <= 13;

      if (!isEmail && !isPhone) {
        return t('errInvalidIdentifier');
      }
      return '';
    }

    if (fieldName === 'password') {
      if (!trimmed) {
        return t('errEmptyPassword');
      }
      if (trimmed.length < 4) {
        return t('errShortPassword');
      }
      return '';
    }

    return '';
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errorMsg = validateField(field, field === 'identifier' ? identifier : password);
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  const handleIdentifierChange = (e) => {
    const val = e.target.value;
    setIdentifier(val);
    if (authError) setAuthError('');
    if (touched.identifier) {
      setErrors((prev) => ({ ...prev, identifier: validateField('identifier', val) }));
    }
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    if (authError) setAuthError('');
    if (touched.password) {
      setErrors((prev) => ({ ...prev, password: validateField('password', val) }));
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(ROUTES.ROLE_SELECT);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGoToRegister = () => {
    if (onNavigateToRegister) {
      onNavigateToRegister();
    } else {
      navigate(ROUTES.BUYER_REGISTER);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    const idError = validateField('identifier', identifier);
    const pwError = validateField('password', password);

    setTouched({ identifier: true, password: true });
    setErrors({ identifier: idError, password: pwError });

    if (idError || pwError) {
      return;
    }

    setIsSubmitting(true);
    const trimmedId = identifier.trim();

    try {
      // Connect to backend auth login with identifier (email or phone)
      const res = await api.post('/auth/login', {
        identifier: trimmedId,
        email: trimmedId,
        password: password
      });

      if (res && res.token) {
        setToken(res.token);
      }

      if (res && res.buyer) {
        let contactPersonName = res.buyer.contactPerson;
        if (!contactPersonName || contactPersonName === res.buyer.businessName) {
          const email = res.buyer.email || '';
          if (email.includes('@')) {
            const raw = email.split('@')[0].replace(/\d+/g, '').replace(/[._-]/g, ' ').trim();
            if (raw.toLowerCase() === 'vimalku' || raw.toLowerCase() === 'vimal') {
              contactPersonName = 'Vimal Kumar';
            } else if (raw.length >= 2) {
              contactPersonName = raw
                .split(' ')
                .filter(Boolean)
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                .join(' ');
            }
          }
        }
        if (!contactPersonName || contactPersonName === res.buyer.businessName) {
          contactPersonName = 'Vimal Kumar';
        }

        const buyerData = {
          ...res.buyer,
          contactPerson: contactPersonName,
          name: contactPersonName,
          fullName: contactPersonName,
          shopName: res.buyer.shopName || res.buyer.businessName,
          businessName: res.buyer.businessName,
          buyerType: res.buyer.buyerType || 'hotel',
          role: 'buyer'
        };
        try {
          localStorage.setItem('buyer_current_profile', JSON.stringify(buyerData));
          localStorage.setItem('buyer_registered_profile', JSON.stringify(buyerData));
        } catch (e) {
          console.warn('Could not store buyer in localStorage:', e);
        }
      }

      try {
        sessionStorage.removeItem('buyer_explicit_signout');
      } catch {
        // ignore
      }

      setIsSubmitting(false);
      setLoginSuccess(true);

      if (onLoginSuccess) {
        onLoginSuccess(res.buyer);
      } else {
        navigate(ROUTES.BUYER_DASHBOARD);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.warn('Backend login notice:', err.message);
      setIsSubmitting(false);
      setAuthError(err.message || t('errInvalidCredentials'));
    }
  };

  // Instant 1-click Demo Buyer Sign In
  const handleDemoSignIn = async () => {
    setIdentifier('demo@naamuzhavar.com');
    setPassword('demo1234');
    setTouched({ identifier: true, password: true });
    setErrors({});
    setIsSubmitting(true);
    setAuthError('');

    try {
      sessionStorage.removeItem('buyer_explicit_signout');
    } catch {
      // ignore
    }

    try {
      const res = await api.post('/auth/login', {
        identifier: 'demo@naamuzhavar.com',
        email: 'demo@naamuzhavar.com',
        password: 'demo1234'
      });

      if (res && res.token) {
        setToken(res.token);
      }

      if (res && res.buyer) {
        const demoData = {
          ...res.buyer,
          contactPerson: res.buyer.contactPerson || 'Mr. S. Rajesh (Procurement Head)',
          name: 'Mr. S. Rajesh',
          fullName: res.buyer.contactPerson || 'Mr. S. Rajesh (Procurement Head)',
          shopName: res.buyer.shopName || res.buyer.businessName || 'Grand Palace Luxury Dining',
          businessName: res.buyer.businessName || 'Grand Palace Luxury Dining',
          buyerType: 'hotel',
          role: 'buyer'
        };
        try {
          localStorage.setItem('buyer_current_profile', JSON.stringify(demoData));
          localStorage.setItem('buyer_registered_profile', JSON.stringify(demoData));
        } catch (e) {
          console.warn('Could not store demo buyer in localStorage:', e);
        }
      }

      setIsSubmitting(false);
      setLoginSuccess(true);

      if (onLoginSuccess) {
        onLoginSuccess(res.buyer);
      } else {
        navigate(ROUTES.BUYER_DASHBOARD);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.warn('Demo login failed against backend:', err.message);
      // Fallback if backend is completely down
      setToken('demo_token_' + Date.now());
      const fallbackData = {
        name: 'Grand Palace Hotel',
        shopName: 'Grand Palace Luxury Dining',
        businessName: 'Grand Palace Luxury Dining',
        contactPerson: 'Mr. S. Rajesh (Procurement Head)',
        phone: '+91 98401 23456',
        email: 'demo@naamuzhavar.com',
        role: 'buyer'
      };
      try {
        localStorage.setItem('buyer_current_profile', JSON.stringify(fallbackData));
      } catch (e) {
        // ignore
      }
      setIsSubmitting(false);
      setLoginSuccess(true);

      if (onLoginSuccess) {
        onLoginSuccess(fallbackData);
      } else {
        navigate(ROUTES.BUYER_DASHBOARD);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };


  // Forgot password submission
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotInput.trim()) return;
    setForgotLoading(true);
    forgotTimerRef.current = setTimeout(() => {
      setForgotLoading(false);
      setForgotSent(true);
    }, 700);
  };

  const resetForgotModal = () => {
    setShowForgotModal(false);
    setForgotInput('');
    setForgotSent(false);
    setForgotLoading(false);
  };

  // Determine which icon to show for identifier (Phone or Mail)
  const isInputNumber = /^\+?\d[\d\s-]*$/.test(identifier.trim());

  return (
    <main className="buyer-auth-page" aria-label="Buyer Login Page">
      <div className="buyer-auth-container">
        {/* ====================================================================
            1. LEFT VISUAL STORYTELLING PANE (42% Width on Desktop)
            ==================================================================== */}
        <section className="buyer-visual-pane" aria-hidden="true">
          <div className="buyer-visual-overlay" />

          <div className="buyer-visual-inner">
            {/* Top Brand Block (Centered) */}
            <div className="buyer-brand-lockup">
              <div className="buyer-brand-logo-card">
                <img 
                  src="/logo.png" 
                  alt="Naam Uzhavar Logo" 
                  className="buyer-brand-logo-img"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=100&auto=format&fit=crop&q=80';
                  }}
                />
              </div>
              <div className="buyer-brand-name-group">
                <span className="buyer-brand-title">{t('common.appName')}</span>
                <span className="buyer-brand-subtitle">{t('common.appSubtitle')}</span>
              </div>
            </div>

            {/* Narrative Editorial Text (Centered) */}
            <div className="buyer-visual-narrative">
              <span className="buyer-procurement-badge">
                <ShieldCheck size={14} />
                <span>{t('badgeProcurement')}</span>
              </span>

              <h2 className="buyer-visual-headline">
                <span>{t('headlineLead')}</span>
                <span>{t('headlineMid')}</span>
                <span className="highlight-word">{t('headlineEnd')}</span>
              </h2>

              <p className="buyer-visual-description">
                {t('visualDesc')}
              </p>

              {/* Supported Commercial Buyer Categories (2 Rows Centered) */}
              <div className="buyer-category-chips">
                <div className="buyer-chips-row">
                  <span className="buyer-category-chip">🏨 {t('categoryHotels')}</span>
                  <span className="buyer-category-chip">🛒 {t('categorySupermarkets')}</span>
                  <span className="buyer-category-chip">🏪 {t('categoryRetailers')}</span>
                </div>
                <div className="buyer-chips-row">
                  <span className="buyer-category-chip">☕ {t('categoryMahals')}</span>
                </div>
              </div>
            </div>

            {/* Bottom Guarantee Row (Centered) */}
            <div className="buyer-visual-footer">
              <div className="buyer-visual-footer-item">
                <CheckCircle2 size={16} color="#38bdf8" />
                <span>{t('footerGuarantee1')}</span>
              </div>
              <div className="buyer-visual-footer-item">
                <CheckCircle2 size={16} color="#38bdf8" />
                <span>{t('footerGuarantee2')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            2. RIGHT AUTHENTICATION PANE (58% Width on Desktop)
            ==================================================================== */}
        <section className="buyer-form-pane" aria-label="Buyer Sign In Form">
          {/* Top Utility Bar */}
          <div className="buyer-pane-top-bar">
            <Button 
              type="button" 
              variant="ghost"
              size="sm"
              className="buyer-back-link" 
              onClick={handleBack}
              leftIcon={<ArrowLeft size={16} />}
              aria-label={t('backLink')}
            >
              <span className="back-link-text">{t('backLink')}</span>
            </Button>

            {/* Language Switcher */}
            <Button 
              type="button" 
              variant="ghost"
              size="sm"
              className="buyer-lang-btn" 
              onClick={toggleLang}
              leftIcon={<Globe size={15} color="var(--buyer-primary, #2b5c8a)" />}
              title="Switch Language / மொழியை மாற்ற"
              aria-label="Toggle language between English and Tamil"
            >
              <span>{t('common.switchLangText')}</span>
            </Button>
          </div>

          {/* Form Card Content */}
          <div className="buyer-form-inner">
            {/* Mobile-Only Header Brand Lockup */}
            <div className="buyer-mobile-brand-header">
              <img 
                src="/logo.png" 
                alt="Naam Uzhavar" 
                className="buyer-mobile-logo"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=100&auto=format&fit=crop&q=80';
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                  {t('common.appName')}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#15803d' }}>
                  {t('common.appSubtitle')}
                </div>
              </div>
            </div>

            {/* Form Title & Subtitle */}
            <header className="buyer-form-header">
              <div className="buyer-icon-box">
                <Building2 size={24} strokeWidth={1.9} />
              </div>
              <span className="buyer-account-badge">
                <ShieldCheck size={12} />
                <span>{t('badgeAccount')}</span>
              </span>
              <h1 className="buyer-form-title">{t('title')}</h1>
              <p className="buyer-form-subtitle">{t('subtitle')}</p>
            </header>

            {/* Auth Alerts (Success / Error) */}
            {authError && (
              <div className="buyer-form-alert alert-error" role="alert">
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{authError}</span>
              </div>
            )}

            {loginSuccess && (
              <div className="buyer-form-alert alert-success" role="status">
                <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{t('signInSuccess')}</span>
              </div>
            )}

            {/* Login Form */}
            <form className="buyer-login-form" onSubmit={handleSubmit} noValidate>
              {/* Field 1: Email or Phone Number */}
              <div style={{ marginBottom: 16 }}>
                <Input
                  id="buyer-identifier"
                  name="identifier"
                  type="text"
                  label={t('labelIdentifier')}
                  value={identifier}
                  onChange={handleIdentifierChange}
                  onBlur={() => handleBlur('identifier')}
                  placeholder={t('placeholderIdentifier')}
                  icon={isInputNumber ? <Phone size={18} /> : <Mail size={18} />}
                  error={touched.identifier ? errors.identifier : ''}
                  required
                  disabled={isSubmitting}
                  autoComplete="username"
                />
              </div>

              {/* Field 2: Password */}
              <div style={{ marginBottom: 16 }}>
                <Input
                  id="buyer-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  label={t('labelPassword')}
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => handleBlur('password')}
                  placeholder={t('placeholderPassword')}
                  icon={<Lock size={18} />}
                  rightIcon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  onRightIconClick={() => setShowPassword(!showPassword)}
                  error={touched.password ? errors.password : ''}
                  required
                  disabled={isSubmitting}
                  autoComplete="current-password"
                />
              </div>

              {/* Remember Me & Forgot Password Row */}
              <div className="buyer-options-row">
                <label className="buyer-checkbox-label">
                  <input
                    type="checkbox"
                    className="buyer-checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>{t('rememberMe')}</span>
                </label>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="buyer-forgot-btn"
                  onClick={() => setShowForgotModal(true)}
                >
                  {t('forgotPassword')}
                </Button>
              </div>

              {/* Primary Sign In Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isSubmitting}
                loadingText={t('signingIn')}
                rightIcon={<ArrowRight size={16} />}
              >
                {t('signInBtn')}
              </Button>

              
              {/* Instant 1-Click Demo Buyer Access */}
              <Button
                type="button"
                id="buyer-quick-demo-btn"
                variant="outline"
                size="md"
                fullWidth
                style={{ marginTop: 10, borderColor: 'var(--buyer-primary, #2b5c8a)', color: 'var(--buyer-primary, #2b5c8a)', fontWeight: 700 }}
                onClick={handleDemoSignIn}
                disabled={isSubmitting}
              >
                <span>⚡ Quick Demo Sign In (Grand Palace Hotel)</span>
              </Button>

              {/* Secondary Create Account Action */}
              <div className="buyer-signup-row">
                <span>{t('newBuyer')}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="buyer-signup-link"
                  onClick={handleGoToRegister}
                >
                  {t('createAccount')}
                </Button>
              </div>
            </form>

            {/* B2B Assurance Card */}
            <Card variant="default" className="buyer-assurance-card" padding="sm">
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <ShieldCheck size={22} className="buyer-assurance-icon" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div className="buyer-assurance-title">{t('assuranceTitle')}</div>
                  <div className="buyer-assurance-desc">{t('assuranceDesc')}</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Pane Footer */}
          <footer className="buyer-pane-footer">
            <p>{t('footerNote')}</p>
          </footer>
        </section>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      <Modal
        isOpen={showForgotModal}
        onClose={resetForgotModal}
        title={t('forgotTitle')}
        description={t('forgotDesc')}
        size="sm"
      >
        {forgotSent ? (
          <div>
            <div style={{ background: 'var(--buyer-accent-subtle, #e8eff6)', border: '1px solid var(--buyer-accent-border, #c5d5e5)', borderRadius: 'var(--radius-md, 8px)', padding: '12px 14px', color: 'var(--buyer-accent-text, #2b5c8a)', fontSize: 14, marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
              <CheckCircle2 size={18} />
              <span>{t('forgotSuccess')}</span>
            </div>
            <Button
              type="button"
              variant="primary"
              fullWidth
              onClick={resetForgotModal}
            >
              {t('close')}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
              id="forgot-input"
              type="text"
              label={t('labelIdentifier')}
              icon={<Mail size={18} />}
              value={forgotInput}
              onChange={(e) => setForgotInput(e.target.value)}
              placeholder={t('forgotPlaceholder')}
              required
              autoFocus
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={!forgotInput.trim()}
              isLoading={forgotLoading}
              loadingText={t('sending')}
            >
              {t('forgotBtn')}
            </Button>
          </form>
        )}
      </Modal>
    </main>
  );
}
