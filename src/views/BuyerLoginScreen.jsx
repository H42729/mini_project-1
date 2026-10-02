import React, { useState } from 'react';
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
  Loader2, 
  ShieldCheck, 
  Building2, 
  Globe
} from 'lucide-react';
import './BuyerLoginScreen.css';

/**
 * BuyerLoginScreen Component
 * 
 * High-end, minimal agricultural authentication interface for commercial produce buyers
 * (Hotels, Supermarkets, Restaurants, Caterers, Function Halls, and Retailers).
 * 
 * Conforms to design-taste-frontend principles:
 * - Two-column split screen on desktop with authentic farm harvest imagery
 * - Warm off-white canvas with deep agricultural green primary branding
 * - Strict accessibility (WCAG AA compliant contrast, labels above inputs, keyboard nav)
 * - Clear human-friendly error validation
 * - Designed to seamlessly share styling tokens with the upcoming 8-field registration screen
 */
export default function BuyerLoginScreen({ 
  onBack, 
  onNavigateToRegister, 
  onLoginSuccess,
  defaultLang = 'en'
}) {
  const [lang, setLang] = useState(defaultLang);
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

  // Content Dictionary (Bilingual support with English primary)
  const strings = {
    en: {
      brandName: "Naam Uzhavar",
      brandSub: "Commercial Procurement Hub",
      headlineLead: "Fresh produce.",
      headlineMid: "Trusted supply.",
      headlineEnd: "Smarter buying.",
      visualDesc: "Direct farm-gate sourcing for hotels, supermarkets, restaurants, and retail institutions across Tamil Nadu.",
      badgeProcurement: "Institutional Supply Network",
      categoryHotels: "Hotels & Restaurants",
      categorySupermarkets: "Supermarkets",
      categoryRetailers: "Retail Stores",
      categoryCaterers: "Caterers & Kitchens",
      badgeAccount: "Commercial Buyer Account",
      title: "Welcome back",
      subtitle: "Sign in to manage your wholesale produce orders and deliveries.",
      labelIdentifier: "Email or Phone Number",
      placeholderIdentifier: "Enter your email or phone number",
      labelPassword: "Password",
      placeholderPassword: "Enter your password",
      showPassword: "Show password",
      hidePassword: "Hide password",
      rememberMe: "Remember this device",
      forgotPassword: "Forgot password?",
      signInBtn: "Sign In",
      signingIn: "Signing in...",
      newBuyer: "New buyer?",
      createAccount: "Create an account",
      backLink: "Back to Home",
      assuranceTitle: "B2B Procurement Guarantee",
      assuranceDesc: "Verified farm origin, standardized crate grading, and direct morning dispatch with digital GST tax invoice.",
      footerNote: "Protected by 256-bit bank-grade encryption • Naam Uzhavar Supply Hub",
      
      // Error messages (Short, human-friendly)
      errEmptyIdentifier: "Please enter your phone number or email.",
      errInvalidIdentifier: "Please enter a valid email address or 10-digit phone number.",
      errEmptyPassword: "Please enter your password.",
      errInvalidCredentials: "Invalid credentials. Please verify your email/phone and password.",

      // Forgot Modal
      forgotTitle: "Reset Your Password",
      forgotDesc: "Enter the email or phone number associated with your buyer account to receive verification instructions.",
      forgotPlaceholder: "Your email or 10-digit mobile number",
      forgotBtn: "Send Reset Link",
      forgotSuccess: "A password reset link and OTP have been sent to your contact information.",
      close: "Close"
    },
    ta: {
      brandName: "நாம் உழவர்",
      brandSub: "வணிகக் கொள்முதல் தளம்",
      headlineLead: "புதிய விளைபொருட்கள்.",
      headlineMid: "நம்பகமான வழங்கல்.",
      headlineEnd: "சிறந்த கொள்முதல்.",
      visualDesc: "தமிழ்நாட்டின் முன்னணி உணவகங்கள், பல்பொருள் அங்காடிகள் மற்றும் சில்லறை வணிகர்களுக்கான நேரடி பண்ணை வர்த்தக தளம்.",
      badgeProcurement: "மொத்த கொள்முதல் நெட்வொர்க்",
      categoryHotels: "உணவகங்கள் & விடுதிகள்",
      categorySupermarkets: "சூப்பர் மார்க்கெட்டுகள்",
      categoryRetailers: "சில்லறை கடைகள்",
      categoryCaterers: "சமையல் கலைஞர்கள்",
      badgeAccount: "வணிகக் கொள்முதல் தளம்",
      title: "மீண்டும் வருக",
      subtitle: "உங்கள் விளைபொருள் ஆர்டர்கள் மற்றும் டெலிவரிகளை நிர்வகிக்க உள்நுழையவும்.",
      labelIdentifier: "மின்னஞ்சல் அல்லது அலைபேசி எண்",
      placeholderIdentifier: "மின்னஞ்சல் அல்லது 10 இலக்க எண் உள்ளிடவும்",
      labelPassword: "கடவுச்சொல்",
      placeholderPassword: "உங்கள் கடவுச்சொல்லை உள்ளிடவும்",
      showPassword: "கடவுச்சொல்லைக் காட்டு",
      hidePassword: "கடவுச்சொல்லை மறை",
      rememberMe: "இந்த சாதனத்தை நினைவில் கொள்க",
      forgotPassword: "கடவுச்சொல் மறந்துவிட்டதா?",
      signInBtn: "உள்நுழைக",
      signingIn: "உள்நுழைகிறது...",
      newBuyer: "புதிய வாங்குபவரா?",
      createAccount: "புதிய கணக்கை உருவாக்கவும்",
      backLink: "முகப்புக்கு திரும்ப",
      assuranceTitle: "நம்பகமான வர்த்தக உத்தரவாதம்",
      assuranceDesc: "சரிபார்க்கப்பட்ட பண்ணை காய்கறிகள், தரப்படுத்தப்பட்ட பெட்டிகள் மற்றும் ஜிஎஸ்டி பில்லுடன் காலை நேர டெலிவரி.",
      footerNote: "256-பிட் பாதுகாப்புடன் பாதுகாக்கப்பட்டது • நாம் உழவர்",

      // Error messages
      errEmptyIdentifier: "உங்கள் அலைபேசி எண் அல்லது மின்னஞ்சலை உள்ளிடவும்.",
      errInvalidIdentifier: "சரியான மின்னஞ்சல் அல்லது 10 இலக்க அலைபேசி எண்ணை உள்ளிடவும்.",
      errEmptyPassword: "உங்கள் கடவுச்சொல்லை உள்ளிடவும்.",
      errInvalidCredentials: "தவறான விவரங்கள். உங்கள் எண் மற்றும் கடவுச்சொல்லை சரிபார்க்கவும்.",

      // Forgot Modal
      forgotTitle: "கடவுச்சொல்லை மீட்டமைக்கவும்",
      forgotDesc: "உங்கள் பதிவு செய்யப்பட்ட மின்னஞ்சல் அல்லது அலைபேசி எண்ணை உள்ளிடவும்.",
      forgotPlaceholder: "மின்னஞ்சல் அல்லது அலைபேசி எண்",
      forgotBtn: "மீட்டமைப்பு இணைப்பை அனுப்புக",
      forgotSuccess: "மீட்டமைப்பு வழிமுறைகள் உங்கள் அலைபேசி எண்ணிற்கு அனுப்பப்பட்டுள்ளது.",
      close: "மூடுக"
    }
  };

  const t = strings[lang];

  // Language Toggle
  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'ta' : 'en'));
  };

  // Field Validation Logic
  const validateField = (name, value) => {
    const trimmed = value.trim();
    if (name === 'identifier') {
      if (!trimmed) {
        return t.errEmptyIdentifier;
      }
      // Check if it's an email
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
      // Check if it's a valid phone number (digits, min 10 digits)
      const digitsOnly = trimmed.replace(/\D/g, '');
      const isPhone = digitsOnly.length >= 10 && digitsOnly.length <= 13;

      if (!isEmail && !isPhone) {
        return t.errInvalidIdentifier;
      }
      return '';
    }

    if (name === 'password') {
      if (!trimmed) {
        return t.errEmptyPassword;
      }
      if (trimmed.length < 4) {
        return lang === 'en' ? 'Password must be at least 4 characters.' : 'கடவுச்சொல் குறைந்தபட்சம் 4 எழுத்துக்கள் இருக்க வேண்டும்.';
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

    // Simulate reliable authentication request
    setTimeout(() => {
      setIsSubmitting(false);

      // Simulation test check: allow demo credentials or any validly formatted input
      // If someone enters "wrong" or invalid explicitly, demonstrate error state
      if (password.toLowerCase() === 'invalid' || password.toLowerCase() === 'error') {
        setAuthError(t.errInvalidCredentials);
        return;
      }

      setLoginSuccess(true);
      if (onLoginSuccess) {
        let savedProfile = null;
        try {
          const raw = localStorage.getItem('buyer_registered_profile') || localStorage.getItem('buyer_current_profile');
          if (raw) savedProfile = JSON.parse(raw);
        } catch (e) {
          console.warn('Could not read saved profile', e);
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
        } catch (e) {}

        onLoginSuccess(loginPayload);
      }
    }, 900);
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
            1. LEFT VISUAL PANE (42% Width on Desktop)
            ==================================================================== */}
        <section className="buyer-visual-pane" aria-label="Brand Overview">
          <div className="buyer-visual-scrim" />

          <div className="buyer-visual-content">
            {/* Top Brand Lockup */}
            <div className="buyer-brand-lockup">
              <img 
                src="/logo.jpg" 
                alt="Naam Uzhavar Logo" 
                className="buyer-brand-logo-img"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=100&auto=format&fit=crop&q=80';
                }}
              />
              <div className="buyer-brand-name-group">
                <span className="buyer-brand-title">{t.brandName}</span>
                <span className="buyer-brand-subtitle">{t.brandSub}</span>
              </div>
            </div>

            {/* Narrative Editorial Text */}
            <div className="buyer-visual-narrative">
              <div className="buyer-procurement-badge">
                <ShieldCheck size={14} />
                <span>{t.badgeProcurement}</span>
              </div>

              <h2 className="buyer-visual-headline">
                <span>{t.headlineLead}</span>
                <span>{t.headlineMid}</span>
                <span className="highlight-word">{t.headlineEnd}</span>
              </h2>

              <p className="buyer-visual-description">
                {t.visualDesc}
              </p>

              {/* Supported Commercial Buyer Categories */}
              <div className="buyer-category-chips">
                <span className="buyer-category-chip">{t.categoryHotels}</span>
                <span className="buyer-category-chip">{t.categorySupermarkets}</span>
                <span className="buyer-category-chip">{t.categoryRetailers}</span>
                <span className="buyer-category-chip">{t.categoryCaterers}</span>
              </div>
            </div>

            {/* Quiet Footer Note */}
            <div className="buyer-visual-footer">
              <div className="buyer-visual-footer-item">
                <CheckCircle2 size={16} color="#86efac" />
                <span>0% Middleman Brokerage</span>
              </div>
              <div className="buyer-visual-footer-item">
                <Building2 size={16} color="#86efac" />
                <span>Tamil Nadu Mandi Network</span>
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
            {onBack ? (
              <button 
                type="button" 
                className="buyer-back-link" 
                onClick={onBack}
                aria-label={t.backLink}
              >
                <ArrowLeft size={16} />
                <span>{t.backLink}</span>
              </button>
            ) : (
              <div />
            )}

            {/* Language Switcher */}
            <button 
              type="button" 
              className="buyer-lang-btn" 
              onClick={toggleLanguage}
              title="Switch Language / மொழியை மாற்ற"
              aria-label="Toggle language between English and Tamil"
            >
              <Globe size={15} color="#15803d" />
              <span>{lang === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>
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
                  e.target.src = 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=100&auto=format&fit=crop&q=80';
                }}
              />
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#14532d', lineHeight: 1.2 }}>
                  {t.brandName}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#526359' }}>
                  {t.brandSub}
                </div>
              </div>
            </div>

            {/* Form Title & Subtitle */}
            <header className="buyer-form-header">
              <div className="buyer-icon-box">
                <Building2 size={24} strokeWidth={1.9} />
              </div>
              <div className="buyer-account-badge">
                <ShieldCheck size={12} />
                <span>{t.badgeAccount}</span>
              </div>
              <h1 className="buyer-form-title">{t.title}</h1>
              <p className="buyer-form-subtitle">{t.subtitle}</p>
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
                <span>{lang === 'en' ? 'Sign in successful! Connecting to supply hub...' : 'உள்நுழைவு வெற்றிகரமானது! இணைக்கப்படுகிறது...'}</span>
              </div>
            )}

            {/* Login Form */}
            <form className="buyer-login-form" onSubmit={handleSubmit} noValidate>
              {/* Field 1: Email or Phone Number */}
              <div className="buyer-field-group">
                <label htmlFor="buyer-identifier" className="buyer-input-label">
                  <span>{t.labelIdentifier}</span>
                </label>
                <div 
                  className={`buyer-input-wrapper ${touched.identifier && errors.identifier ? 'has-error' : ''}`}
                >
                  <span className="buyer-input-icon">
                    {isInputNumber ? <Phone size={18} /> : <Mail size={18} />}
                  </span>
                  <input
                    id="buyer-identifier"
                    name="identifier"
                    type="text"
                    className="buyer-text-input"
                    value={identifier}
                    onChange={handleIdentifierChange}
                    onBlur={() => handleBlur('identifier')}
                    placeholder={t.placeholderIdentifier}
                    autoComplete="username"
                    aria-required="true"
                    aria-invalid={touched.identifier && !!errors.identifier}
                    aria-describedby={errors.identifier ? "identifier-error" : undefined}
                    disabled={isSubmitting}
                  />
                </div>
                {touched.identifier && errors.identifier && (
                  <div id="identifier-error" className="buyer-field-error" role="alert">
                    <AlertCircle size={14} />
                    <span>{errors.identifier}</span>
                  </div>
                )}
              </div>

              {/* Field 2: Password */}
              <div className="buyer-field-group">
                <label htmlFor="buyer-password" className="buyer-input-label">
                  <span>{t.labelPassword}</span>
                </label>
                <div 
                  className={`buyer-input-wrapper ${touched.password && errors.password ? 'has-error' : ''}`}
                >
                  <span className="buyer-input-icon">
                    <Lock size={18} />
                  </span>
                  <input
                    id="buyer-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="buyer-text-input"
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={() => handleBlur('password')}
                    placeholder={t.placeholderPassword}
                    autoComplete="current-password"
                    aria-required="true"
                    aria-invalid={touched.password && !!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    className="buyer-pw-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? t.hidePassword : t.showPassword}
                    aria-label={showPassword ? t.hidePassword : t.showPassword}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <div id="password-error" className="buyer-field-error" role="alert">
                    <AlertCircle size={14} />
                    <span>{errors.password}</span>
                  </div>
                )}
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
                  <span>{t.rememberMe}</span>
                </label>

                <button
                  type="button"
                  className="buyer-forgot-btn"
                  onClick={() => setShowForgotModal(true)}
                >
                  {t.forgotPassword}
                </button>
              </div>

              {/* Primary Sign In Button */}
              <button
                type="submit"
                className="buyer-submit-btn"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="buyer-spinner" />
                    <span>{t.signingIn}</span>
                  </>
                ) : (
                  <>
                    <span>{t.signInBtn}</span>
                    <span className="buyer-btn-icon-pill">
                      <ArrowRight size={15} />
                    </span>
                  </>
                )}
              </button>

              {/* Secondary Create Account Action */}
              <div className="buyer-signup-row">
                <span>{t.newBuyer}</span>
                <button
                  type="button"
                  className="buyer-signup-link"
                  onClick={() => {
                    if (onNavigateToRegister) {
                      onNavigateToRegister();
                    } else {
                      alert(lang === 'en' 
                        ? 'Buyer registration flow will open here with fields: Photo, Name, Phone, Email, Buyer Type, Shop Name, Address, GSTIN.' 
                        : 'வாங்குவோர் பதிவுப் பக்கம் விரைவில் திறக்கப்படும் (புகைப்படம், பெயர், எண், கடை விவரம், ஜிஎஸ்டி).');
                    }
                  }}
                >
                  {t.createAccount}
                </button>
              </div>
            </form>

            {/* B2B Assurance Card */}
            <div className="buyer-assurance-card">
              <ShieldCheck size={22} className="buyer-assurance-icon" />
              <div>
                <div className="buyer-assurance-title">{t.assuranceTitle}</div>
                <div className="buyer-assurance-desc">{t.assuranceDesc}</div>
              </div>
            </div>
          </div>

          {/* Pane Footer */}
          <footer className="buyer-pane-footer">
            <p>{t.footerNote}</p>
          </footer>
        </section>
      </div>

      {/* ====================================================================
          FORGOT PASSWORD MODAL (Non-disruptive, Lightweight)
          ==================================================================== */}
      {showForgotModal && (
        <div className="buyer-modal-backdrop" onClick={resetForgotModal}>
          <div className="buyer-modal-dialog" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <button 
              type="button" 
              className="buyer-modal-close-btn" 
              onClick={resetForgotModal}
              aria-label={t.close}
            >
              ✕
            </button>

            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#14532d', marginBottom: 8 }}>
              {t.forgotTitle}
            </h3>

            <p style={{ fontSize: 14, color: '#526359', lineHeight: 1.5, marginBottom: 18 }}>
              {t.forgotDesc}
            </p>

            {forgotSent ? (
              <div>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '12px 14px', color: '#15803d', fontSize: 14, marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <CheckCircle2 size={18} />
                  <span>{t.forgotSuccess}</span>
                </div>
                <button
                  type="button"
                  className="buyer-submit-btn"
                  onClick={resetForgotModal}
                >
                  {t.close}
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit}>
                <div className="buyer-field-group" style={{ marginBottom: 16 }}>
                  <label htmlFor="forgot-input" className="buyer-input-label">
                    <span>{t.labelIdentifier}</span>
                  </label>
                  <div className="buyer-input-wrapper">
                    <span className="buyer-input-icon">
                      <Mail size={18} />
                    </span>
                    <input
                      id="forgot-input"
                      type="text"
                      className="buyer-text-input"
                      value={forgotInput}
                      onChange={(e) => setForgotInput(e.target.value)}
                      placeholder={t.forgotPlaceholder}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="buyer-submit-btn"
                  disabled={forgotLoading || !forgotInput.trim()}
                >
                  {forgotLoading ? (
                    <>
                      <Loader2 size={18} className="buyer-spinner" />
                      <span>{lang === 'en' ? 'Sending...' : 'அனுப்பப்படுகிறது...'}</span>
                    </>
                  ) : (
                    <span>{t.forgotBtn}</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
