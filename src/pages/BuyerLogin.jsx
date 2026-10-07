// What this file does: Commercial buyer login page with phone/email and password credentials.

import React, { useState } from 'react';
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
  const handleSubmit = (e) => {
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

    setTimeout(() => {
      setIsSubmitting(false);

      if (password.toLowerCase() === 'invalid' || password.toLowerCase() === 'error') {
        setAuthError(t('errInvalidCredentials'));
        return;
      }

      setLoginSuccess(true);
      let savedProfile = null;
      try {
        const raw = localStorage.getItem('buyer_registered_profile') || localStorage.getItem('buyer_current_profile');
        if (raw) savedProfile = JSON.parse(raw);
      } catch {
        // ignore error
      }

      const trimmedId = identifier.trim();
      const isEmail = trimmedId.includes('@');
      
      const loginPayload = {
        identifier: trimmedId,
        role: 'buyer',
        rememberMe,
        name: savedProfile?.name || 'Mr. S. Rajesh',
        fullName: savedProfile?.name || 'Mr. S. Rajesh',
        contactPerson: savedProfile?.name || 'Mr. S. Rajesh (Procurement Head)',
        phone: savedProfile?.phone || (isEmail ? '+91 98401 23456' : (trimmedId.startsWith('+91') ? trimmedId : `+91 ${trimmedId}`)),
        email: savedProfile?.email || (isEmail ? trimmedId : 'procurement@grandpalace.in'),
        buyerType: savedProfile?.buyerType || 'hotel',
        businessType: savedProfile?.businessType || (savedProfile?.buyerType ? `${savedProfile.buyerType.toUpperCase()} Commercial Kitchen` : 'Hotel & Commercial Kitchen'),
        shopName: savedProfile?.shopName || 'Grand Palace Luxury Dining',
        businessName: savedProfile?.shopName || 'Grand Palace Luxury Dining',
        address: savedProfile?.address || 'Grand Palace Luxury Dining, Bypass Road, Madurai - 625016',
        gstin: savedProfile?.gstin || '33AAAAA0000A1Z5',
        photo: savedProfile?.photo || savedProfile?.photoPreview || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=300&auto=format&fit=crop&q=80',
        photoPreview: savedProfile?.photoPreview || savedProfile?.photo || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=300&auto=format&fit=crop&q=80'
      };

      try {
        localStorage.setItem('buyer_current_profile', JSON.stringify(loginPayload));
        sessionStorage.removeItem('buyer_explicit_signout');
      } catch {
        // ignore storage error
      }

      if (onLoginSuccess) {
        onLoginSuccess(loginPayload);
      } else {
        navigate(ROUTES.BUYER_DASHBOARD);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 800);
  };

  // Instant 1-click Demo Buyer Sign In
  const handleDemoSignIn = () => {
    setIdentifier('procurement@grandpalace.in');
    setPassword('Pass@1234');
    setTouched({ identifier: true, password: true });
    setErrors({});
    setIsSubmitting(true);
    try {
      sessionStorage.removeItem('buyer_explicit_signout');
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setLoginSuccess(true);
      const demoPayload = {
        identifier: 'procurement@grandpalace.in',
        role: 'buyer',
        rememberMe: true,
        name: 'Mr. S. Rajesh',
        fullName: 'Mr. S. Rajesh',
        contactPerson: 'Mr. S. Rajesh (Procurement Head)',
        phone: '+91 98401 23456',
        email: 'procurement@grandpalace.in',
        buyerType: 'hotel',
        businessType: 'Hotel & Commercial Kitchen',
        shopName: 'Grand Palace Luxury Dining',
        businessName: 'Grand Palace Luxury Dining',
        address: 'Grand Palace Luxury Dining, Bypass Road, Madurai - 625016',
        gstin: '33AAAAA0000A1Z5',
        photo: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=300&auto=format&fit=crop&q=80',
        photoPreview: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=300&auto=format&fit=crop&q=80'
      };

      try {
        localStorage.setItem('buyer_current_profile', JSON.stringify(demoPayload));
      } catch {
        // ignore storage error
      }

      if (onLoginSuccess) {
        onLoginSuccess(demoPayload);
      } else {
        navigate(ROUTES.BUYER_DASHBOARD);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 400);
  };

  // Forgot password submission
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotInput.trim()) return;
    setForgotLoading(true);
    setTimeout(() => {
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
                  src="/logo.jpg" 
                  alt="Naam Uzhavar Logo" 
                  className="buyer-brand-logo-img"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=100&auto=format&fit=crop&q=80';
                  }}
                />
              </div>
              <div className="buyer-brand-name-group">
                <span className="buyer-brand-title">{t('brandName')}</span>
                <span className="buyer-brand-subtitle">{t('brandSub')}</span>
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
                <CheckCircle2 size={16} color="#4ade80" />
                <span>{t('footerGuarantee1')}</span>
              </div>
              <div className="buyer-visual-footer-item">
                <CheckCircle2 size={16} color="#4ade80" />
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
              <span>{t('backLink')}</span>
            </Button>

            {/* Language Switcher */}
            <Button 
              type="button" 
              variant="ghost"
              size="sm"
              className="buyer-lang-btn" 
              onClick={toggleLang}
              leftIcon={<Globe size={15} color="#15803d" />}
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
                src="/logo.jpg" 
                alt="Naam Uzhavar" 
                className="buyer-mobile-logo"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=100&auto=format&fit=crop&q=80';
                }}
              />
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#14532d', lineHeight: 1.2 }}>
                  {t('brandName')}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#526359' }}>
                  {t('brandSub')}
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
                variant="outline"
                size="md"
                fullWidth
                style={{ marginTop: 10, borderColor: '#16a34a', color: '#15803d', fontWeight: 700 }}
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
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '12px 14px', color: '#15803d', fontSize: 14, marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
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
