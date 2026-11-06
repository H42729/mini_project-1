// What this file does: Multi-role unified login screen with role switch tabs at the top (Farmer Login, Buyer Login, Driver Login) and complete login details for each role.

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Phone,
  Mail,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  MapPin,
  X
} from 'lucide-react';
import { useT } from '../hooks/useT';
import { ROUTES } from '../routes';
import Button from '../components/Button';
import { api, setToken, DEMO_FARMER_JWT, DEMO_BUYER_JWT } from '../utils/api';
import { INITIAL_FARMER_PROFILE } from '../data/farmerMockData';
import './RoleSelectPage.css';

export default function RoleSelectPage({
  onBack,
  onSelectFarmer,
  onSelectBuyer,
  onSelectDriver
}) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, lang, toggleLang } = useT('roleSelect');

  // Initial role from URL query param (e.g. ?role=buyer), defaults to 'farmer' (first as requested)
  const initialRole = searchParams.get('role') || 'farmer';
  const [activeRole, setActiveRole] = useState(
    ['farmer', 'buyer', 'driver'].includes(initialRole) ? initialRole : 'farmer'
  );

  // Switch handler
  const handleRoleSwitch = (role) => {
    setActiveRole(role);
    setSearchParams({ role });
    setAuthError('');
    setAuthSuccess('');
  };

  // Keep activeRole synchronized with URL query param (?role=buyer / ?role=farmer / ?role=driver)
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam && ['farmer', 'buyer', 'driver'].includes(roleParam)) {
      setActiveRole(roleParam);
    }
  }, [searchParams]);

  // Check if user just registered as a farmer and redirect has a pending email
  useEffect(() => {
    if (activeRole === 'farmer') {
      try {
        const pendingEmail = localStorage.getItem('farmer_registration_pending_email');
        if (pendingEmail) {
          setFarmerMobile(pendingEmail);
          setAuthSuccess(
            lang === 'ta'
              ? 'உழவர் பதிவு வெற்றிகரமானது! உங்கள் கடவுச்சொல்லை உள்ளிட்டு உள்நுழையவும்.'
              : 'Farmer account registered successfully! Please enter your password to sign in.'
          );
          localStorage.removeItem('farmer_registration_pending_email');
        }
      } catch {}
    }
  }, [activeRole, lang]);

  // Sticky scroll detection: accurately tracks when switcher docks underneath topbar
  const switcherRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      // Subtle topbar elevation when user scrolls past 8px
      const scrolled = window.scrollY > 8;
      setIsScrolled(scrolled);

      // Docking check: activates only when switcher actually reaches topbar bottom edge
      if (switcherRef.current) {
        const topbarEl = document.querySelector('.role-select-topbar');
        const topbarHeight = topbarEl ? topbarEl.getBoundingClientRect().height : 60;
        const rect = switcherRef.current.getBoundingClientRect();
        setIsSticky(rect.top <= topbarHeight + 10);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Common notification feedback
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ---------------------------------------------------------------------------
  // 1. Farmer Login State
  // ---------------------------------------------------------------------------
  const [farmerMobile, setFarmerMobile] = useState('');
  const [farmerPin, setFarmerPin] = useState('');
  const [showFarmerPin, setShowFarmerPin] = useState(false);
  const [farmerRemember, setFarmerRemember] = useState(true);

  const handleFarmerSubmit = async (e) => {
    if (e) e.preventDefault();
    setAuthError('');

    const trimmedMobile = farmerMobile.trim();
    const trimmedPin = farmerPin.trim();

    if (!trimmedMobile) {
      setAuthError(
        lang === 'ta'
          ? 'அலைபேசி எண் அல்லது மின்னஞ்சலை உள்ளிடவும்'
          : 'Please enter your registered mobile number or Email ID.'
      );
      return;
    }
    if (!trimmedPin) {
      setAuthError(
        lang === 'ta'
          ? 'கடவுச்சொல் அல்லது பின்னை உள்ளிடவும்'
          : 'Please enter your password or security PIN.'
      );
      return;
    }

    setIsSubmitting(true);

    const completeFarmerLogin = (farmerData, successName, specificToken) => {
      const activeToken =
        specificToken ||
        (farmerData.name && farmerData.name.toLowerCase() !== 'ramesh kumar'
          ? `farmer_token_${farmerData.farmerId || 'registered'}`
          : DEMO_FARMER_JWT);
      setToken(activeToken, 'farmer');
      const profileToStore = {
        ...farmerData,
        role: 'farmer',
        isVerified: true
      };
      try {
        localStorage.removeItem('buyer_current_profile');
        localStorage.setItem('farmer_current_profile', JSON.stringify(profileToStore));
        sessionStorage.removeItem('farmer_explicit_signout');
      } catch (err) {
        console.warn('Could not store farmer profile:', err);
      }

      setIsSubmitting(false);
      setAuthSuccess(
        lang === 'ta'
          ? `${successName || profileToStore.name || 'விவசாயி'} சரிபார்க்கப்பட்டது! உழவர் தளத்திற்கு செல்கிறது...`
          : `Farmer ${successName || profileToStore.name || ''} verified! Connecting to Farmer Direct Portal...`
      );

      setTimeout(() => {
        if (onSelectFarmer) {
          onSelectFarmer();
        } else {
          navigate(ROUTES.FARMER_DASHBOARD);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 700);
    };

    try {
      // Connect to backend farmer login API
      const res = await api.post('/auth/farmer/login', {
        identifier: trimmedMobile,
        phone: trimmedMobile,
        email: trimmedMobile,
        password: trimmedPin
      });

      const farmerData = res?.farmer || {
        farmerId: 'FMR-TN-2026-01',
        name: 'Ramesh Kumar',
        email: trimmedMobile.includes('@') ? trimmedMobile : 'ramesh.kumar@naamuzhavar.com',
        phone: trimmedMobile,
        avatar: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=300&auto=format&fit=crop&q=80',
        rating: 4.92,
        totalHarvests: 54,
        isVerified: true,
        role: 'farmer'
      };

      completeFarmerLogin(farmerData, farmerData.name, res?.token);
    } catch (err) {
      console.warn('Backend farmer login notice, checking registered credentials:', err.message);

      // Check offline registered farmer accounts from localStorage
      const registeredRaw = localStorage.getItem('farmer_registered_profile');
      const registeredListRaw = localStorage.getItem('registered_farmers_list');
      const allRegistered = [];
      if (registeredRaw) {
        try { allRegistered.push(JSON.parse(registeredRaw)); } catch {}
      }
      if (registeredListRaw) {
        try { allRegistered.push(...JSON.parse(registeredListRaw)); } catch {}
      }

      const cleanDigits = trimmedMobile.replace(/\D/g, '');
      const matchedFarmer = allRegistered.find((rf) => {
        if (!rf) return false;
        const emailMatches = rf.email && rf.email.toLowerCase() === trimmedMobile.toLowerCase();
        const rfDigits = (rf.phone || '').replace(/\D/g, '');
        const phoneMatches = cleanDigits.length >= 10 && rfDigits.length >= 10 && (cleanDigits.endsWith(rfDigits.slice(-10)) || rfDigits.endsWith(cleanDigits.slice(-10)));
        return emailMatches || phoneMatches;
      });

      if (matchedFarmer) {
        if (matchedFarmer.password && matchedFarmer.password !== trimmedPin) {
          setIsSubmitting(false);
          setAuthError(
            lang === 'ta'
              ? 'தவறான கடவுச்சொல். மீண்டும் முயற்சிக்கவும்.'
              : 'Invalid password. Please check your credentials.'
          );
          return;
        }

        completeFarmerLogin(matchedFarmer, matchedFarmer.name);
        return;
      }

      // Check offline demo credentials strictly if backend is unreachable
      const isDemoFarmerAccount =
        trimmedMobile.toLowerCase() === 'farmer@naamuzhavar.com' ||
        trimmedMobile.toLowerCase() === 'ramesh.kumar@naamuzhavar.com' ||
        (cleanDigits.length >= 10 && cleanDigits.endsWith('78190'));
      const isDemoFarmerPin = trimmedPin === '4821' || trimmedPin === 'farmer1234';

      if (isDemoFarmerAccount && isDemoFarmerPin) {
        handleQuickDemoFarmer();
        return;
      }

      setIsSubmitting(false);
      setAuthError(
        err.message ||
        (lang === 'ta'
          ? 'அலைபேசி எண்/மின்னஞ்சல் அல்லது கடவுச்சொல் தவறானது. மீண்டும் முயற்சிக்கவும்.'
          : 'Invalid mobile/email or password. Please verify your credentials.')
      );
    }
  };

  const handleQuickDemoFarmer = () => {
    setFarmerMobile('+91 94432 78190');
    setFarmerPin('4821');
    setAuthError('');
    setIsSubmitting(true);

    setToken(DEMO_FARMER_JWT);

    const farmerData = {
      ...INITIAL_FARMER_PROFILE,
      farmerId: 'FMR-TN-2026-01',
      name: 'Ramesh Kumar',
      email: 'ramesh.kumar@naamuzhavar.com',
      phone: '+91 94432 78190',
      avatar: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=300&auto=format&fit=crop&q=80',
      rating: 4.92,
      totalHarvests: 54,
      isVerified: true,
      role: 'farmer'
    };

    try {
      localStorage.removeItem('buyer_current_profile');
      localStorage.setItem('farmer_current_profile', JSON.stringify(farmerData));
      sessionStorage.removeItem('farmer_explicit_signout');
    } catch (err) {
      console.warn('Could not store farmer profile:', err);
    }

    setIsSubmitting(false);
    setAuthSuccess(
      lang === 'ta'
        ? 'ரமேஷ் குமார் (பொள்ளாச்சி மையம்) - விவசாயி சரிபார்க்கப்பட்டது!'
        : 'Farmer Ramesh Kumar (Pollachi Hub) verified!'
    );

    setTimeout(() => {
      if (onSelectFarmer) {
        onSelectFarmer();
      } else {
        navigate(ROUTES.FARMER_DASHBOARD);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 700);
  };

  // ---------------------------------------------------------------------------
  // 2. Buyer Login State
  // ---------------------------------------------------------------------------
  const [buyerIdentifier, setBuyerIdentifier] = useState('');
  const [buyerPassword, setBuyerPassword] = useState('');
  const [showBuyerPassword, setShowBuyerPassword] = useState(false);
  const [buyerRemember, setBuyerRemember] = useState(true);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotInput, setForgotInput] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // When redirected after completing registration: pre-fill identifier and show success notice
  useEffect(() => {
    if (searchParams.get('registered') === '1') {
      try {
        const stored = localStorage.getItem('buyer_registered_profile');
        if (stored) {
          const profile = JSON.parse(stored);
          if (profile.email || profile.phone) {
            setBuyerIdentifier(profile.email || profile.phone);
          }
        }
      } catch (e) {
        console.warn('Could not read registered profile:', e);
      }
      setAuthSuccess(
        lang === 'ta'
          ? 'வணிகக் கணக்கு வெற்றிகரமாக பதிவு செய்யப்பட்டது! உங்கள் கடவுச்சொல் மூலம் உள்நுழையவும்.'
          : 'Registration completed successfully! Please log in with your credentials.'
      );
    }
  }, [searchParams, lang]);

  const handleBuyerSubmit = async (e) => {
    if (e) e.preventDefault();
    setAuthError('');

    const trimmedId = buyerIdentifier.trim();
    if (!trimmedId) {
      setAuthError(lang === 'ta' ? 'மின்னஞ்சல் அல்லது அலைபேசி எண்ணை உள்ளிடவும்' : 'Please enter your email or phone number.');
      return;
    }
    if (!buyerPassword.trim()) {
      setAuthError(lang === 'ta' ? 'கடவுச்சொல்லை உள்ளிடவும்' : 'Please enter your account password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/auth/login', {
        identifier: trimmedId,
        email: trimmedId,
        password: buyerPassword
      });

      if (res && res.token) {
        setToken(res.token);
      }

      if (res && res.buyer) {
        let contactPersonName = res.buyer.contactPerson;
        if (!contactPersonName || contactPersonName === res.buyer.businessName) {
          contactPersonName = res.buyer.name || 'Vimal Kumar';
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
          localStorage.removeItem('farmer_current_profile');
          localStorage.setItem('buyer_current_profile', JSON.stringify(buyerData));
          localStorage.setItem('buyer_registered_profile', JSON.stringify(buyerData));
        } catch {
          // ignore
        }
      }

      try {
        sessionStorage.removeItem('buyer_explicit_signout');
      } catch {
        // ignore
      }

      setIsSubmitting(false);
      setAuthSuccess(t('loginSuccessToast') || 'Signed in successfully! Redirecting...');

      setTimeout(() => {
        if (onSelectBuyer) {
          onSelectBuyer();
        } else {
          navigate(ROUTES.BUYER_DASHBOARD);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 700);
    } catch (err) {
      console.warn('Backend buyer login error:', err.message);

      // Check offline demo credentials strictly if backend is unreachable
      const cleanDigits = trimmedId.replace(/\D/g, '');
      const isDemoBuyerAccount =
        trimmedId.toLowerCase() === 'demo@naamuzhavar.com' ||
        trimmedId.toLowerCase() === 'hotel.saravana@gmail.com' ||
        (cleanDigits.length >= 10 && cleanDigits.endsWith('23456'));
      const isDemoBuyerPass = buyerPassword === 'demo1234' || buyerPassword === 'saravana123';

      if (isDemoBuyerAccount && isDemoBuyerPass) {
        handleQuickDemoBuyer();
        return;
      }

      // Check if user matches a locally registered offline buyer profile
      try {
        const stored = localStorage.getItem('buyer_registered_profile');
        if (stored) {
          const registered = JSON.parse(stored);
          const matchEmail = registered.email && registered.email.toLowerCase() === trimmedId.toLowerCase();
          const matchPhone = registered.phone && registered.phone.replace(/\D/g, '').endsWith(cleanDigits);
          if ((matchEmail || matchPhone) && buyerPassword.length >= 6) {
            localStorage.setItem('buyer_current_profile', JSON.stringify(registered));
            setToken(DEMO_BUYER_JWT);
            setIsSubmitting(false);
            setAuthSuccess(t('loginSuccessToast') || 'Signed in successfully! Redirecting...');
            setTimeout(() => {
              if (onSelectBuyer) onSelectBuyer();
              else {
                navigate(ROUTES.BUYER_DASHBOARD);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }, 700);
            return;
          }
        }
      } catch {}

      setIsSubmitting(false);
      setAuthError(
        err.message ||
        (lang === 'ta'
          ? 'மின்னஞ்சல் அல்லது கடவுச்சொல் தவறானது. மீண்டும் முயற்சிக்கவும்.'
          : 'Invalid email/phone or password. Please verify your credentials.')
      );
    }
  };

  const handleQuickDemoBuyer = (customIdentifier) => {
    const isEmail = typeof customIdentifier === 'string' && customIdentifier.includes('@');
    const defaultEmail = isEmail ? customIdentifier : 'demo@naamuzhavar.com';
    const defaultPhone = (!isEmail && typeof customIdentifier === 'string' && customIdentifier.length >= 10)
      ? customIdentifier
      : '+91 98401 23456';

    setBuyerIdentifier(defaultEmail);
    setBuyerPassword('demo1234');
    setAuthError('');
    setIsSubmitting(true);

    try {
      localStorage.removeItem('farmer_current_profile');
      sessionStorage.removeItem('buyer_explicit_signout');
    } catch {
      // ignore
    }

    const demoData = {
      name: 'Mr. S. Rajesh',
      fullName: 'Mr. S. Rajesh (Procurement Head)',
      contactPerson: 'Mr. S. Rajesh (Procurement Head)',
      shopName: 'Grand Palace Luxury Dining',
      businessName: 'Grand Palace Luxury Dining',
      phone: defaultPhone,
      email: defaultEmail,
      buyerType: 'hotel',
      role: 'buyer',
      address: 'Grand Palace Luxury Dining, Bypass Road, Madurai - 625016',
      gstin: '33AAAAA0000A1Z5'
    };

    setToken(DEMO_BUYER_JWT);
    try {
      localStorage.setItem('buyer_current_profile', JSON.stringify(demoData));
      localStorage.setItem('buyer_registered_profile', JSON.stringify(demoData));
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setAuthSuccess(
        lang === 'ta'
          ? 'கிராண்ட் பேலஸ் ஹோட்டல் கணக்கில் வெற்றிகரமாக உள்நுழைந்தது!'
          : 'Signed in as Grand Palace Luxury Dining (Procurement Head)!'
      );
      setTimeout(() => {
        if (onSelectBuyer) {
          onSelectBuyer();
        } else {
          navigate(ROUTES.BUYER_DASHBOARD);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 700);
    }, 600);
  };

  // ---------------------------------------------------------------------------
  // 3. Driver Login State
  // ---------------------------------------------------------------------------
  const [driverId, setDriverId] = useState('');
  const [driverPin, setDriverPin] = useState('');
  const [driverHub, setDriverHub] = useState('Dindigul Central Hub');
  const [showDriverPin, setShowDriverPin] = useState(false);
  const [driverRemember, setDriverRemember] = useState(true);

  const completeDriverLogin = (driverData) => {
    try {
      localStorage.setItem('driver_current_profile', JSON.stringify(driverData));
      sessionStorage.removeItem('driver_explicit_signout');
    } catch (err) {
      console.warn('Could not store driver profile:', err);
    }
    setToken('driver_token_kumar_m', 'driver');
    setIsSubmitting(false);
    setAuthSuccess(
      lang === 'ta'
        ? `${driverData.name || 'ஓட்டுநர்'} முனையம் சரிபார்க்கப்பட்டது! பயண வழிகளுக்கு செல்கிறது...`
        : `Driver ${driverData.name || ''} verified! Connecting to EV Dispatch Terminal...`
    );
    setTimeout(() => {
      if (onSelectDriver) {
        onSelectDriver();
      } else {
        navigate(ROUTES.DRIVER_DASHBOARD);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 700);
  };

  const handleDriverSubmit = (e) => {
    if (e) e.preventDefault();
    setAuthError('');

    const trimmedDriver = driverId.trim();
    if (!trimmedDriver) {
      setAuthError(lang === 'ta' ? 'ஓட்டுநர் அலைபேசி அல்லது வாகன எண்ணை உள்ளிடவும்' : 'Please enter your driver mobile or vehicle number.');
      return;
    }
    if (!driverPin.trim()) {
      setAuthError(lang === 'ta' ? '4-இலக்க பாதுகாப்பு பின்னை உள்ளிடவும்' : 'Please enter your 4-digit dispatch PIN.');
      return;
    }

    setIsSubmitting(true);
    const driverData = {
      driverId: 'DRV-TN-2026-08',
      name: 'Kumar M.',
      phone: trimmedDriver.includes('@') ? '+91 94432 11098' : trimmedDriver,
      email: trimmedDriver.includes('@') ? trimmedDriver : 'kumar.logistics@naamuzhavar.com',
      avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=300&auto=format&fit=crop&q=80',
      assignedHub: driverHub || 'Dindigul Central Hub',
      vehicle: {
        model: 'Tata Ace EV Cargo',
        vehicleNumber: 'TN 57 AB 1234',
        type: 'Zero-Emission EV Light Commercial Vehicle (LCV)',
        batteryCapacityKwh: 21.3,
        currentBatteryPct: 82,
        estimatedRangeKm: 68,
        maxPayloadKg: 600,
        healthPct: 98,
        chargingStatus: 'DISCHARGING'
      },
      role: 'driver'
    };
    completeDriverLogin(driverData);
  };

  const handleQuickDemoDriver = () => {
    setDriverId('+91 94432 11098');
    setDriverPin('4892');
    setDriverHub('Dindigul Central Hub');
    setAuthError('');
    setIsSubmitting(true);
    const driverData = {
      driverId: 'DRV-TN-2026-08',
      name: 'Kumar M.',
      phone: '+91 94432 11098',
      email: 'kumar.logistics@naamuzhavar.com',
      avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=300&auto=format&fit=crop&q=80',
      assignedHub: 'Dindigul Central Hub',
      vehicle: {
        model: 'Tata Ace EV Cargo',
        vehicleNumber: 'TN 57 AB 1234',
        type: 'Zero-Emission EV Light Commercial Vehicle (LCV)',
        batteryCapacityKwh: 21.3,
        currentBatteryPct: 82,
        estimatedRangeKm: 68,
        maxPayloadKg: 600,
        healthPct: 98,
        chargingStatus: 'DISCHARGING'
      },
      role: 'driver'
    };
    completeDriverLogin(driverData);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(ROUTES.HOME);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="role-select-root">
      {/* ====================================================================
          TOP NAVIGATION BAR
          ==================================================================== */}
      <header className={`role-select-topbar ${isScrolled ? 'is-scrolled' : ''}`}>
        <div
          className="role-select-brand"
          onClick={handleBack}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleBack();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Back to home"
          title="Go to Home page"
          style={{ cursor: 'pointer' }}
        >
          <img src="/logo.png" alt="Naam Uzhavar" className="role-select-logo-img" />
          <div className="role-select-brand-text">
            <span className="role-select-brand-name">{t('common.appName')}</span>
            <span className="role-select-brand-sub">{t('common.appSubtitle')}</span>
          </div>
        </div>

        <div className="role-select-topbar-actions">
          <button
            type="button"
            className="role-select-lang-btn"
            onClick={toggleLang}
            aria-label="Toggle Language"
            title="Toggle English / தமிழ்"
          >
            <span>{t('common.switchLangText')}</span>
          </button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="role-select-back-btn"
            onClick={handleBack}
            leftIcon={<ArrowLeft size={16} />}
            aria-label="Back to Home"
          >
            <span className="role-back-home-text">{t('common.navHome')}</span>
          </Button>
        </div>
      </header>

      {/* ====================================================================
          MAIN LOGIN WORKSPACE
          ==================================================================== */}
      <main className="role-select-container">
        {/* Header Heading */}
        <div className="role-select-header-box">
          <h1 className="role-select-title">
            {lang === 'ta' ? 'ஒருங்கிணைந்த உள்நுழைவு தளம்' : 'Direct Agricultural Portal Login'}
          </h1>

          <p className="role-select-sub">
            {lang === 'ta'
              ? 'உங்கள் பிரிவை மேலே தேர்வு செய்து (விவசாயி / வாங்குபவர் / ஓட்டுநர்) எளிதாக உள்நுழையவும்.'
              : 'Choose your portal switch option above to sign in with verified credentials.'}
          </p>
        </div>

        {/* ====================================================================
            THE SWITCH OPTION IN ABOVE (Farmer Login -> Buyer Login -> Driver Login)
            ==================================================================== */}
        <div ref={switcherRef} className={`role-switch-container ${isSticky ? 'is-sticky' : ''}`}>
          <span className="role-switch-label">
            <span className="role-switch-dot" aria-hidden="true" />
            <span>{t('switchOptionLabel') || 'Select Login Role:'}</span>
          </span>
          <div className="role-switch-pill" role="tablist" aria-label="Role Login Switcher">
            {/* 1. Farmer Login (First) */}
            <button
              type="button"
              role="tab"
              id="switch-tab-farmer"
              aria-selected={activeRole === 'farmer'}
              className={`role-switch-btn ${activeRole === 'farmer' ? 'active farmer-active' : ''}`}
              onClick={() => handleRoleSwitch('farmer')}
            >
              <span className="role-switch-icon">🌾</span>
              <span className="role-switch-title">{t('switchFarmer') || 'Farmer Login'}</span>
            </button>

            {/* 2. Buyer Login (Second) */}
            <button
              type="button"
              role="tab"
              id="switch-tab-buyer"
              aria-selected={activeRole === 'buyer'}
              className={`role-switch-btn ${activeRole === 'buyer' ? 'active buyer-active' : ''}`}
              onClick={() => handleRoleSwitch('buyer')}
            >
              <span className="role-switch-icon">🧺</span>
              <span className="role-switch-title">{t('switchBuyer') || 'Buyer Login'}</span>
            </button>

            {/* 3. Driver Login (Third) */}
            <button
              type="button"
              role="tab"
              id="switch-tab-driver"
              aria-selected={activeRole === 'driver'}
              className={`role-switch-btn ${activeRole === 'driver' ? 'active driver-active' : ''}`}
              onClick={() => handleRoleSwitch('driver')}
            >
              <span className="role-switch-icon">🚚</span>
              <span className="role-switch-title">{t('switchDriver') || 'Driver Login'}</span>
            </button>
          </div>
        </div>

        {/* ====================================================================
            LOGIN DETAILS WORKSPACE CONTAINER (Replaces static cards)
            ==================================================================== */}
        <div className="role-login-details-card animate-fade-in" key={activeRole}>
          {/* Feedback messages */}
          {authError && (
            <div className="role-login-feedback error animate-shake" role="alert">
              <AlertCircle size={18} className="flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccess && (
            <div className="role-login-feedback success animate-fade-in" role="status">
              <CheckCircle2 size={18} className="flex-shrink-0" />
              <span>{authSuccess}</span>
            </div>
          )}

          {/* ------------------------------------------------------------------
              ROLE 1: FARMER LOGIN DETAILS
              ------------------------------------------------------------------ */}
          {activeRole === 'farmer' && (
            <form onSubmit={handleFarmerSubmit} className="role-login-form">
              <div className="role-login-header-block">
                <div className="role-avatar-circle farmer">🌾</div>
                <div className="role-login-heading-wrap">
                  <h2 className="role-login-heading">{t('farmerPortalTitle') || 'Farmer Login'}</h2>
                </div>
              </div>

              {/* Mobile Number or Email ID */}
              <div className="role-field-group">
                <label htmlFor="farmer-mobile-input" className="role-input-label">
                  <Phone size={14} />
                  <span>{t('farmerMobileLabel') || 'Mobile Number or Email ID'}</span>
                </label>
                <div className="role-input-wrap">
                  <input
                    id="farmer-mobile-input"
                    type="text"
                    value={farmerMobile}
                    onChange={(e) => {
                      setFarmerMobile(e.target.value);
                      if (authError) setAuthError('');
                    }}
                    placeholder={t('farmerMobilePlaceholder') || 'e.g. 98421 78210 or farmer@naamuzhavar.com'}
                    className="role-text-input"
                    disabled={isSubmitting}
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* 4-Digit Security PIN or Password */}
              <div className="role-field-group">
                <label htmlFor="farmer-pin-input" className="role-input-label">
                  <KeyRound size={14} />
                  <span>{t('farmerPinLabel') || 'Security PIN / Password'}</span>
                </label>
                <div className="role-input-wrap">
                  <input
                    id="farmer-pin-input"
                    type={showFarmerPin ? 'text' : 'password'}
                    value={farmerPin}
                    onChange={(e) => {
                      setFarmerPin(e.target.value);
                      if (authError) setAuthError('');
                    }}
                    placeholder="Enter 4-digit PIN (e.g. 4821)"
                    className="role-text-input"
                    disabled={isSubmitting}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="role-password-toggle-btn"
                    onClick={() => setShowFarmerPin(!showFarmerPin)}
                    aria-label={showFarmerPin ? 'Hide PIN' : 'Show PIN'}
                    tabIndex={-1}
                  >
                    {showFarmerPin ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember & Assistance */}
              <div className="role-auxiliary-row">
                <label className="role-checkbox-label">
                  <input
                    type="checkbox"
                    checked={farmerRemember}
                    onChange={(e) => setFarmerRemember(e.target.checked)}
                    className="role-checkbox"
                  />
                  <span>{t('rememberMe') || 'Remember my credentials'}</span>
                </label>
                <span className="role-auxiliary-link" onClick={() => setAuthError(lang === 'ta' ? 'உதவிக்கு எங்களை அழைக்கவும்: 1800-425-1555' : 'For login help, call toll-free: 1800-425-1555')}>
                  {lang === 'ta' ? 'உதவி தேவையா? OTP பெறுக' : 'OTP Login Assistance'}
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="role-primary-btn farmer"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span>{lang === 'ta' ? 'சரிபார்க்கிறது...' : 'Verifying...'}</span>
                ) : (
                  <span>{t('farmerBtn') || 'Sign In to Farmer Portal ➔'}</span>
                )}
              </button>

              {/* Instant 1-Click Quick Demo Sign In */}
              <button
                type="button"
                className="role-demo-btn farmer"
                onClick={handleQuickDemoFarmer}
                disabled={isSubmitting}
              >
                <span>{t('farmerDemoBtn') || '⚡ Quick Demo Farmer Sign In (Ravi Kumar - Dindigul Hub)'}</span>
              </button>

              {/* Footer Register Callout */}
              <div className="role-form-footer">
                <span>{t('newFarmerPrompt') || 'New farmer?'}</span>
                <Link to={ROUTES.FARMER_REGISTER} className="role-register-link">
                  {t('registerFarmerLink') || 'Register to sell produce directly ➔'}
                </Link>
              </div>
            </form>
          )}

          {/* ------------------------------------------------------------------
              ROLE 2: BUYER LOGIN DETAILS
              ------------------------------------------------------------------ */}
          {activeRole === 'buyer' && (
            <form onSubmit={handleBuyerSubmit} className="role-login-form">
              <div className="role-login-header-block">
                <div className="role-avatar-circle buyer">🧺</div>
                <div className="role-login-heading-wrap">
                  <h2 className="role-login-heading">{t('buyerHeading') || 'Buyer Login'}</h2>
                </div>
              </div>

              {/* Mobile Number or Email ID */}
              <div className="role-field-group">
                <label htmlFor="buyer-identifier-input" className="role-input-label">
                  <Mail size={14} />
                  <span>{t('buyerEmailLabel') || 'Mobile Number or Email ID'}</span>
                </label>
                <div className="role-input-wrap">
                  <input
                    id="buyer-identifier-input"
                    type="text"
                    value={buyerIdentifier}
                    onChange={(e) => {
                      setBuyerIdentifier(e.target.value);
                      if (authError) setAuthError('');
                    }}
                    placeholder="demo@naamuzhavar.com or +91 98401 23456"
                    className="role-text-input"
                    disabled={isSubmitting}
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="role-field-group">
                <label htmlFor="buyer-password-input" className="role-input-label">
                  <Lock size={14} />
                  <span>{t('buyerPasswordLabel') || 'Account Password'}</span>
                </label>
                <div className="role-input-wrap">
                  <input
                    id="buyer-password-input"
                    type={showBuyerPassword ? 'text' : 'password'}
                    value={buyerPassword}
                    onChange={(e) => {
                      setBuyerPassword(e.target.value);
                      if (authError) setAuthError('');
                    }}
                    placeholder="Enter password (e.g. demo1234)"
                    className="role-text-input"
                    disabled={isSubmitting}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="role-password-toggle-btn"
                    onClick={() => setShowBuyerPassword(!showBuyerPassword)}
                    aria-label={showBuyerPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showBuyerPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="role-auxiliary-row">
                <label className="role-checkbox-label">
                  <input
                    type="checkbox"
                    checked={buyerRemember}
                    onChange={(e) => setBuyerRemember(e.target.checked)}
                    className="role-checkbox"
                  />
                  <span>{t('rememberMe') || 'Remember my credentials'}</span>
                </label>
                <button
                  type="button"
                  className="role-auxiliary-link-btn"
                  onClick={() => setShowForgotModal(true)}
                >
                  {t('forgotPassword') || 'Forgot Password?'}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="role-primary-btn buyer"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span>{lang === 'ta' ? 'உள்நுழைகிறது...' : 'Signing in...'}</span>
                ) : (
                  <span>{t('buyerLoginBtn') || 'Sign In as Commercial Buyer ➔'}</span>
                )}
              </button>

              {/* Instant 1-Click Quick Demo Sign In */}
              <button
                type="button"
                id="buyer-quick-demo-btn"
                className="role-demo-btn buyer"
                onClick={handleQuickDemoBuyer}
                disabled={isSubmitting}
              >
                <span>{t('buyerDemoBtn') || '⚡ Quick Demo Buyer Sign In (Grand Palace Hotel)'}</span>
              </button>

              {/* Footer Register Callout */}
              <div className="role-form-footer">
                <span>{t('newBuyerPrompt') || 'New commercial buyer?'}</span>
                <Link to={ROUTES.BUYER_REGISTER} className="role-register-link">
                  {t('registerBuyerLink') || 'Register your restaurant / kitchen ➔'}
                </Link>
              </div>
            </form>
          )}

          {/* ------------------------------------------------------------------
              ROLE 3: DRIVER LOGIN DETAILS
              ------------------------------------------------------------------ */}
          {activeRole === 'driver' && (
            <form onSubmit={handleDriverSubmit} className="role-login-form">
              <div className="role-login-header-block">
                <div className="role-avatar-circle driver">🚚</div>
                <div className="role-login-heading-wrap">
                  <h2 className="role-login-heading">{t('driverPortalTitle') || 'Driver Login'}</h2>
                </div>
              </div>

              {/* Mobile Number or Email ID */}
              <div className="role-field-group">
                <label htmlFor="driver-id-input" className="role-input-label">
                  <Phone size={14} />
                  <span>{t('driverMobileLabel') || 'Mobile Number or Email ID'}</span>
                </label>
                <div className="role-input-wrap">
                  <input
                    id="driver-id-input"
                    type="text"
                    value={driverId}
                    onChange={(e) => {
                      setDriverId(e.target.value);
                      if (authError) setAuthError('');
                    }}
                    placeholder={t('driverMobilePlaceholder') || 'e.g. 94432 11098 or driver@naamuzhavar.com'}
                    className="role-text-input"
                    disabled={isSubmitting}
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* 4-Digit Security PIN */}
              <div className="role-field-group">
                <label htmlFor="driver-pin-input" className="role-input-label">
                  <KeyRound size={14} />
                  <span>{t('driverPasscodeLabel') || '4-Digit Dispatch PIN'}</span>
                </label>
                <div className="role-input-wrap">
                  <input
                    id="driver-pin-input"
                    type={showDriverPin ? 'text' : 'password'}
                    value={driverPin}
                    onChange={(e) => {
                      setDriverPin(e.target.value);
                      if (authError) setAuthError('');
                    }}
                    placeholder="Enter dispatch PIN (e.g. 4892)"
                    className="role-text-input"
                    disabled={isSubmitting}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="role-password-toggle-btn"
                    onClick={() => setShowDriverPin(!showDriverPin)}
                    aria-label={showDriverPin ? 'Hide PIN' : 'Show PIN'}
                    tabIndex={-1}
                  >
                    {showDriverPin ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Assigned EV Hub Selection */}
              <div className="role-field-group">
                <label htmlFor="driver-hub-select" className="role-input-label">
                  <MapPin size={14} />
                  <span>{t('driverHubSelectLabel') || 'Assigned EV Hub Location'}</span>
                </label>
                <div className="role-input-wrap">
                  <select
                    id="driver-hub-select"
                    value={driverHub}
                    onChange={(e) => setDriverHub(e.target.value)}
                    className="role-text-input role-select-dropdown"
                    disabled={isSubmitting}
                  >
                    <option value="Dindigul Central Hub">Dindigul Central Hub (Central Mandi Bay)</option>
                    <option value="Oddanchatram Hub">Oddanchatram Hub (Market Terminal)</option>
                    <option value="Palani Hub">Palani Hub (Ayakudi Outpost)</option>
                    <option value="Kodaikanal Hub">Kodaikanal Hill Hub (High Altitude)</option>
                  </select>
                </div>
              </div>

              {/* Remember & Support */}
              <div className="role-auxiliary-row">
                <label className="role-checkbox-label">
                  <input
                    type="checkbox"
                    checked={driverRemember}
                    onChange={(e) => setDriverRemember(e.target.checked)}
                    className="role-checkbox"
                  />
                  <span>{t('rememberMe') || 'Remember my credentials'}</span>
                </label>
                <span className="role-auxiliary-link" onClick={handleQuickDemoDriver}>
                  {lang === 'ta' ? 'ஓட்டுநர் உதவி மையம்' : 'Driver Dispatch Help'}
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="role-primary-btn driver"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span>{lang === 'ta' ? 'சரிபார்க்கிறது...' : 'Connecting...'}</span>
                ) : (
                  <span>{t('driverBtn') || 'Sign In to Driver Terminal ➔'}</span>
                )}
              </button>

              {/* Instant 1-Click Quick Demo Sign In */}
              <button
                type="button"
                className="role-demo-btn driver"
                onClick={handleQuickDemoDriver}
                disabled={isSubmitting}
              >
                <span>{t('driverDemoBtn') || '⚡ Quick Demo Driver Sign In (Kumar M. - Tata Ace EV)'}</span>
              </button>

              {/* Footer Register Callout */}
              <div className="role-form-footer">
                <span>{t('newDriverPrompt') || 'New logistics partner?'}</span>
                <Link to={`${ROUTES.COMING_SOON}?role=driver`} className="role-register-link">
                  {t('registerDriverLink') || 'Onboard with EV delivery fleet ➔'}
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* ====================================================================
          FORGOT PASSWORD MODAL (Buyer Support)
          ==================================================================== */}
      {showForgotModal && (
        <div className="role-modal-overlay" onClick={() => setShowForgotModal(false)}>
          <div className="role-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="role-modal-header">
              <h3 className="role-modal-title">{t('forgotPassword') || 'Reset Password'}</h3>
              <button
                type="button"
                className="role-modal-close"
                onClick={() => setShowForgotModal(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="role-modal-body">
              {forgotSent ? (
                <div className="role-modal-success">
                  <CheckCircle2 size={24} className="text-success" />
                  <p>
                    {lang === 'ta'
                      ? 'கடவுச்சொல் மீட்டமைப்பு இணைப்பு உங்கள் மின்னஞ்சல் அல்லது அலைபேசிக்கு அனுப்பப்பட்டது!'
                      : 'Password reset link and temporary security code sent to your registered contact!'}
                  </p>
                </div>
              ) : (
                <>
                  <p className="role-modal-info">
                    {lang === 'ta'
                      ? 'உங்கள் பதிவு செய்யப்பட்ட மின்னஞ்சல் அல்லது அலைபேசி எண்ணை உள்ளிடவும்.'
                      : 'Enter your registered email address or phone number to receive a temporary recovery PIN.'}
                  </p>
                  <input
                    type="text"
                    value={forgotInput}
                    onChange={(e) => setForgotInput(e.target.value)}
                    placeholder="demo@naamuzhavar.com"
                    className="role-text-input"
                    autoFocus
                  />
                  <div className="role-modal-actions">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowForgotModal(false)}
                    >
                      {lang === 'ta' ? 'ரத்து' : 'Cancel'}
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        if (forgotInput.trim()) {
                          setForgotSent(true);
                          setTimeout(() => {
                            setForgotSent(false);
                            setShowForgotModal(false);
                          }, 2500);
                        }
                      }}
                    >
                      {lang === 'ta' ? 'அனுப்புக' : 'Send Recovery Code'}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
