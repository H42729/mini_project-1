import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  Camera,
  User,
  Mail,
  Building2,
  ShoppingCart,
  Store,
  Landmark,
  Building,
  MapPin,
  FileText,
  Check,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  ChevronDown,
  Globe,
  ShieldCheck
} from 'lucide-react';
import './BuyerRegisterScreen.css';

/**
 * BuyerRegisterScreen Component
 * 
 * High-end, minimal agricultural registration interface for commercial produce buyers:
 * - Hotels & Restaurants
 * - Supermarkets
 * - Small Retailers
 * - Mahals / Function Halls
 * 
 * Conforms to Taste-Skill principles:
 * 1. Two-column desktop (centered visual storytelling pane / spacious form pane)
 * 2. Responsive mobile-first layout (collapses seamlessly to single-column)
 * 3. Clean 8-field order without cluttered OTP verification:
 *    Section 1: 1. Photo -> 2. Name -> 3. Phone (+91) -> 4. Email -> 5. Buyer Type
 *    Section 2: 6. Shop Name -> 7. Address -> 8. GSTIN Number
 * 4. Form completion: Confirmation checkbox + full-width deep green CTA + Sign in link
 */
export default function BuyerRegisterScreen({
  onBack,
  onNavigateToLogin,
  onRegisterSuccess,
  defaultLang = 'en'
}) {
  const [lang, setLang] = useState(defaultLang);

  // Form State Values
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoName, setPhotoName] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [buyerType, setBuyerType] = useState('');
  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [gstin, setGstin] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Dropdown & Drag States
  const [buyerTypeOpen, setBuyerTypeOpen] = useState(false);
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Validation & Submit States
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState('idle'); // 'idle' | 'loading' | 'success'

  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setBuyerTypeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Bilingual strings (English primary, Tamil toggle)
  const strings = {
    en: {
      brandName: "Naam Uzhavar",
      brandSub: "Commercial Procurement Hub",
      headlineLead: "Buy fresh.",
      headlineMid: "Buy smarter.",
      headlineEnd: "Buy directly from the supply hub.",
      visualDesc: "Create your buyer account to discover available farm produce, place orders, and track deliveries.",
      badgeProcurement: "B2B Procurement Network",
      categoryHotels: "Hotels",
      categorySupermarkets: "Supermarkets",
      categoryRetailers: "Small Retailers",
      categoryMahals: "Function Halls",
      footerGuarantee1: "Direct farm-gate morning harvest",
      footerGuarantee2: "Digital GST tax invoice",

      backLink: "Back to Home",
      mobileBrandTitle: "Naam Uzhavar Buyer Hub",
      badgeAccount: "Commercial Buyer Onboarding",
      title: "Create buyer account",
      subtitle: "Register your business to start purchasing fresh farm produce.",

      // Section 1
      section1Title: "Personal Details",
      photoLabel: "Profile / Business Photo",
      photoUploadText: "Upload your photo",
      photoUploadFormat: "JPG or PNG • Max 5 MB",
      photoChange: "Change",
      photoRemove: "Remove",
      photoDragPrompt: "Drop your photo here",

      nameLabel: "Full Name",
      namePlaceholder: "Enter your full name",

      phoneLabel: "Phone Number",
      phonePlaceholder: "Enter your 10-digit mobile number",

      emailLabel: "Email Address",
      emailPlaceholder: "Enter your email address",

      buyerTypeLabel: "Buyer Type",
      buyerTypePlaceholder: "Select your buyer type",
      hotelOption: "Hotel",
      supermarketOption: "Supermarket",
      smallRetailerOption: "Small Retailer",
      mahalOption: "Mahal (Function Hall)",

      // Section 2
      section2Title: "Business Details",
      section2Desc: "Tell us about the business where the produce will be received.",

      shopNameLabel: "Shop / Business Name",
      shopNamePlaceholder: "Enter your shop or business name",
      shopNameHelper: "Use the registered business name.",

      addressLabel: "Business Address",
      addressPlaceholder: "Enter your complete business address (Street, Area, City, PIN)",

      gstinLabel: "GSTIN Number",
      gstinPlaceholder: "Enter your 15-digit GSTIN",
      gstinHelper: "GSTIN is required for business verification.",

      // Form Completion
      confirmLabel: "I confirm that the information provided is correct.",
      submitNormal: "Create Buyer Account",
      submitLoading: "Creating account...",
      submitSuccess: "Account created ✓",

      alreadyHaveAccount: "Already have an account?",
      signInLink: "Sign in",

      successTitle: "Buyer Account Registered!",
      successDesc: "Your commercial account is ready. You can now log in to place wholesale farm orders.",
      successLoginBtn: "Proceed to Sign In",

      footerProtected: "Institutional B2B Procurement • Verified Farm Supply • GST Invoicing"
    },
    ta: {
      brandName: "நாம் உழவர்",
      brandSub: "வணிக கொள்முதல் மையம்",
      headlineLead: "புதிய உணவு வாங்குங்கள்.",
      headlineMid: "புத்திசாலித்தனமாக வாங்குங்கள்.",
      headlineEnd: "விவசாய மையத்திலிருந்து நேரடியாக வாங்குங்கள்.",
      visualDesc: "புதிய பண்ணை விளைபொருட்களை கண்டறிய, மொத்த ஆர்டர்களை பதிவு செய்ய உங்கள் வணிக கணக்கை தொடங்குங்கள்.",
      badgeProcurement: "வணிக கொள்முதல் தளம்",
      categoryHotels: "ஹோட்டல்கள்",
      categorySupermarkets: "சூப்பர் மார்க்கெட்",
      categoryRetailers: "சில்லறை கடைகள்",
      categoryMahals: "திருமண மண்டபங்கள்",
      footerGuarantee1: "நேரடி பண்ணை அறுவடை",
      footerGuarantee2: "முறையான ஜிஎஸ்டி ரசீது",

      backLink: "முகப்பிற்கு செல்ல",
      mobileBrandTitle: "நாம் உழவர் வாங்குவோர் தளம்",
      badgeAccount: "வாங்குவோர் புதிய பதிவு",
      title: "புதிய வாங்குபவர் பதிவு",
      subtitle: "புதிய விளைபொருட்களை வாங்க உங்கள் வணிகக் கணக்கை பதிவு செய்யுங்கள்.",

      // Section 1
      section1Title: "தனிநபர் விவரங்கள் (Personal Details)",
      photoLabel: "சுயவிவரம் / நிறுவன புகைப்படம்",
      photoUploadText: "புகைப்படத்தை பதிவேற்றவும்",
      photoUploadFormat: "JPG அல்லது PNG • அதிகபட்சம் 5 MB",
      photoChange: "மாற்று",
      photoRemove: "நீக்கு",
      photoDragPrompt: "புகைப்படத்தை இங்கு இழுத்துவிடவும்",

      nameLabel: "முழு பெயர் (Full Name)",
      namePlaceholder: "உங்கள் முழு பெயரை உள்ளிடவும்",

      phoneLabel: "அலைபேசி எண் (Phone Number)",
      phonePlaceholder: "உங்கள் 10 இலக்க அலைபேசி எண்",

      emailLabel: "மின்னஞ்சல் முகவரி (Email Address)",
      emailPlaceholder: "உங்கள் மின்னஞ்சலை உள்ளிடவும்",

      buyerTypeLabel: "வாங்குபவர் பிரிவு (Buyer Type)",
      buyerTypePlaceholder: "உங்கள் வணிக பிரிவை தேர்வு செய்யவும்",
      hotelOption: "ஹோட்டல் (Hotel)",
      supermarketOption: "சூப்பர் மார்க்கெட் (Supermarket)",
      smallRetailerOption: "சில்லறை கடை (Small Retailer)",
      mahalOption: "மண்டபம் / மஹால் (Mahal)",

      // Section 2
      section2Title: "வணிக விவரங்கள் (Business Details)",
      section2Desc: "விளைபொருட்கள் வந்து சேரவேண்டிய வணிக நிறுவனத்தின் விவரங்களை குறிப்பிடவும்.",

      shopNameLabel: "கடை / வணிக பெயர் (Shop / Business Name)",
      shopNamePlaceholder: "உங்கள் கடை அல்லது நிறுவனத்தின் பெயர்",
      shopNameHelper: "பதிவு செய்யப்பட்ட வணிகப் பெயரை பயன்படுத்தவும்.",

      addressLabel: "நிறுவன முகவரி (Business Address)",
      addressPlaceholder: "முழு வணிக முகவரியை உள்ளிடவும் (தெரு, பகுதி, நகரம், அஞ்சல் குறியீடு)",

      gstinLabel: "ஜிஎஸ்டி எண் (GSTIN Number)",
      gstinPlaceholder: "உங்கள் 15 இலக்க ஜிஎஸ்டி எண்",
      gstinHelper: "வணிக சரிபார்ப்பிற்கு ஜிஎஸ்டி எண் அவசியம்.",

      // Form Completion
      confirmLabel: "நான் அளித்த விவரங்கள் அனைத்தும் சரியானவை என உறுதி செய்கிறேன்.",
      submitNormal: "வணிக கணக்கு தொடங்குக",
      submitLoading: "கணக்கு உருவாக்கப்படுகிறது...",
      submitSuccess: "கணக்கு உருவாக்கப்பட்டது ✓",

      alreadyHaveAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
      signInLink: "உள்நுழைக",

      successTitle: "வணிக கணக்கு உருவாக்கப்பட்டது!",
      successDesc: "உங்கள் வாங்குவோர் கணக்கு தயாராக உள்ளது. இப்போது உள்நுழைந்து விளைபொருட்களை ஆர்டர் செய்யலாம்.",
      successLoginBtn: "உள்நுழைவிற்கு செல்ல",

      footerProtected: "நம்பகமான B2B கொள்முதல் • நேரடி பண்ணை விநியோகம்"
    }
  };

  const t = strings[lang] || strings.en;

  // Buyer Type Options with Professional Outline Icons
  const buyerTypeOptions = [
    { id: 'hotel', label: t.hotelOption, icon: Building2, desc: 'Hotels & Restaurants' },
    { id: 'supermarket', label: t.supermarketOption, icon: ShoppingCart, desc: 'Supermarkets & Grocery Stores' },
    { id: 'retailer', label: t.smallRetailerOption, icon: Store, desc: 'Local Retail Produce Stores' },
    { id: 'mahal', label: t.mahalOption, icon: Landmark, desc: 'Function Halls & Catering Mahals' }
  ];

  // Helper: Find selected buyer type object
  const selectedTypeObj = buyerTypeOptions.find(opt => opt.id === buyerType);

  // Real-time Field Validation Logic
  const validateField = (field, value) => {
    switch (field) {
      case 'photo':
        if (!photoPreview) {
          return lang === 'en' ? 'Please upload your profile or business photo.' : 'புகைப்படத்தை பதிவேற்றவும்.';
        }
        return '';

      case 'name':
        if (!value || !value.trim()) {
          return lang === 'en' ? 'Please enter your name.' : 'தயவுசெய்து உங்கள் பெயரை உள்ளிடவும்.';
        }
        if (value.trim().length < 2) {
          return lang === 'en' ? 'Please enter a valid full name.' : 'சரியான பெயரை உள்ளிடவும்.';
        }
        return '';

      case 'phone':
        if (!value || !value.trim()) {
          return lang === 'en' ? 'Please enter your phone number.' : 'அலைபேசி எண்ணை உள்ளிடவும்.';
        }
        const cleanPhone = value.replace(/\D/g, '');
        if (cleanPhone.length !== 10) {
          return lang === 'en' ? 'Please enter a valid 10-digit phone number.' : '10 இலக்க அலைபேசி எண்ணை உள்ளிடவும்.';
        }
        return '';

      case 'email':
        if (!value || !value.trim()) {
          return lang === 'en' ? 'Please enter your email address.' : 'மின்னஞ்சலை உள்ளிடவும்.';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
          return lang === 'en' ? 'Please enter a valid email address.' : 'சரியான மின்னஞ்சலை உள்ளிடவும்.';
        }
        return '';

      case 'buyerType':
        if (!value) {
          return lang === 'en' ? 'Please select your buyer type.' : 'வாங்குபவர் பிரிவை தேர்வு செய்யவும்.';
        }
        return '';

      case 'shopName':
        if (!value || !value.trim()) {
          return lang === 'en' ? 'Please enter your business name.' : 'கடை அல்லது நிறுவன பெயரை உள்ளிடவும்.';
        }
        return '';

      case 'address':
        if (!value || !value.trim()) {
          return lang === 'en' ? 'Please enter your business address.' : 'முழு வணிக முகவரியை உள்ளிடவும்.';
        }
        if (value.trim().length < 8) {
          return lang === 'en' ? 'Please enter a complete business address.' : 'முழுமையான முகவரியை உள்ளிடவும்.';
        }
        return '';

      case 'gstin':
        if (!value || !value.trim()) {
          return lang === 'en' ? 'Please enter your 15-character GSTIN.' : '15 இலக்க ஜிஎஸ்டி எண்ணை உள்ளிடவும்.';
        }
        const cleanGstin = value.trim().toUpperCase();
        if (cleanGstin.length !== 15 || !/^[0-9A-Z]{15}$/.test(cleanGstin)) {
          return lang === 'en' ? 'Please enter a valid 15-character GSTIN.' : 'சரியான 15 இலக்க ஜிஎஸ்டி எண்ணை உள்ளிடவும்.';
        }
        return '';

      case 'confirm':
        if (!isConfirmed) {
          return lang === 'en' ? 'Please confirm that the information provided is correct.' : 'விவரங்கள் சரியானவை என உறுதிசெய்யவும்.';
        }
        return '';

      default:
        return '';
    }
  };

  // Handle Photo File Selection
  const handlePhotoSelect = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, photo: lang === 'en' ? 'Please upload an image file (JPG or PNG).' : 'JPG அல்லது PNG படத்தை பதிவேற்றவும்.' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, photo: lang === 'en' ? 'Photo size exceeds 5 MB limit.' : 'புகைப்படம் 5MB அளவுக்குள் இருக்க வேண்டும்.' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target.result);
      setPhotoName(file.name);
      setErrors(prev => ({ ...prev, photo: '' }));
      setTouched(prev => ({ ...prev, photo: true }));
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingPhoto(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingPhoto(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingPhoto(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoSelect(e.dataTransfer.files[0]);
    }
  };

  const removePhoto = (e) => {
    e.stopPropagation();
    setPhotoPreview(null);
    setPhotoName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setTouched(prev => ({ ...prev, photo: true }));
  };

  // Main Form Submission Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields touched
    const allTouched = {
      photo: true,
      name: true,
      phone: true,
      email: true,
      buyerType: true,
      shopName: true,
      address: true,
      gstin: true,
      confirm: true
    };
    setTouched(allTouched);

    // Validate all fields
    const newErrors = {
      photo: validateField('photo', photoPreview),
      name: validateField('name', name),
      phone: validateField('phone', phone),
      email: validateField('email', email),
      buyerType: validateField('buyerType', buyerType),
      shopName: validateField('shopName', shopName),
      address: validateField('address', address),
      gstin: validateField('gstin', gstin),
      confirm: validateField('confirm', isConfirmed)
    };

    setErrors(newErrors);

    // Check if any error exists
    const hasError = Object.values(newErrors).some(err => Boolean(err));
    if (hasError) {
      const firstErrorEl = document.querySelector('.buyer-field-error, .has-error');
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Submit Process
    setSubmitStatus('loading');
    setTimeout(() => {
      setSubmitStatus('success');
      const registeredData = {
        name,
        fullName: name,
        phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
        email,
        buyerType,
        shopName,
        businessName: shopName,
        address,
        gstin,
        photo: photoPreview || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=300&auto=format&fit=crop&q=80',
        photoPreview: photoPreview || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=300&auto=format&fit=crop&q=80'
      };

      try {
        localStorage.setItem('buyer_registered_profile', JSON.stringify(registeredData));
        localStorage.setItem('buyer_current_profile', JSON.stringify(registeredData));
      } catch (err) {
        console.warn('Storage save error:', err);
      }

      if (onRegisterSuccess) {
        onRegisterSuccess(registeredData);
      }
    }, 1000);
  };

  return (
    <div className="buyer-reg-page">
      <div className="buyer-reg-container">
        {/* ==================================================================
            LEFT SIDE: CINEMATIC VISUAL STORYTELLING (Centered Alignment)
            ================================================================== */}
        <aside className="buyer-reg-visual-pane" aria-label="Visual Brand Story">
          <div className="buyer-reg-visual-scrim" />

          <div className="buyer-reg-visual-content">
            {/* Top Brand Lockup (Centered) */}
            <div className="buyer-reg-brand-lockup">
              <img
                src="/logo.jpg"
                alt="Naam Uzhavar Official Crest"
                className="buyer-reg-brand-logo-img"
              />
              <div className="buyer-reg-brand-name-group">
                <span className="buyer-reg-brand-title">{t.brandName}</span>
                <span className="buyer-reg-brand-subtitle">{t.brandSub}</span>
              </div>
            </div>

            {/* Central Visual Narrative (Centered) */}
            <div className="buyer-reg-visual-narrative">
              <div className="buyer-reg-procurement-badge">
                <ShieldCheck size={14} />
                <span>{t.badgeProcurement}</span>
              </div>

              <h2 className="buyer-reg-visual-headline">
                <span>{t.headlineLead}</span>
                <span>{t.headlineMid}</span>
                <span className="highlight-word">{t.headlineEnd}</span>
              </h2>

              <p className="buyer-reg-visual-description">
                {t.visualDesc}
              </p>

              {/* Verified Commercial Buyer Categories */}
              <div className="buyer-reg-category-chips">
                <span className="buyer-reg-category-chip">🏨 {t.categoryHotels}</span>
                <span className="buyer-reg-category-chip">🛒 {t.categorySupermarkets}</span>
                <span className="buyer-reg-category-chip">🏪 {t.categoryRetailers}</span>
                <span className="buyer-reg-category-chip">🏛 {t.categoryMahals}</span>
              </div>
            </div>

            {/* Bottom Visual Guarantee (Centered) */}
            <div className="buyer-reg-visual-footer">
              <div className="buyer-reg-visual-footer-item">
                <CheckCircle2 size={15} color="#86efac" />
                <span>{t.footerGuarantee1}</span>
              </div>
              <div className="buyer-reg-visual-footer-item">
                <CheckCircle2 size={15} color="#86efac" />
                <span>{t.footerGuarantee2}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ==================================================================
            RIGHT SIDE: REGISTRATION FORM CONTENT PANE (Fully Responsive)
            ================================================================== */}
        <main className="buyer-reg-form-pane">
          {/* Top Utility Bar */}
          <div className="buyer-reg-top-bar">
            {onBack ? (
              <button
                type="button"
                className="buyer-reg-back-link"
                onClick={onBack}
                aria-label={t.backLink}
              >
                <ArrowLeft size={16} />
                <span>{t.backLink}</span>
              </button>
            ) : <div />}

            <button
              type="button"
              className="buyer-reg-lang-btn"
              onClick={() => setLang(prev => (prev === 'en' ? 'ta' : 'en'))}
              aria-label="Toggle language between English and Tamil"
            >
              <Globe size={15} />
              <span>{lang === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>
          </div>

          {/* Form Card Container */}
          <div className="buyer-reg-form-inner">
            {/* Mobile-only Top Brand Header */}
            <div className="buyer-reg-mobile-header">
              <img
                src="/logo.jpg"
                alt="Naam Uzhavar Logo"
                className="buyer-reg-mobile-logo"
              />
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--buyer-text-main)' }}>
                  {t.brandName}
                </div>
                <div style={{ fontSize: 12, color: 'var(--buyer-text-muted)', fontWeight: 600 }}>
                  {t.mobileBrandTitle}
                </div>
              </div>
            </div>

            {/* Screen Header */}
            <div className="buyer-reg-header">
              <div className="buyer-reg-badge">
                <Building2 size={13} />
                <span>{t.badgeAccount}</span>
              </div>
              <h1 className="buyer-reg-title">{t.title}</h1>
              <p className="buyer-reg-subtitle">{t.subtitle}</p>
            </div>

            {submitStatus === 'success' ? (
              /* Success Celebration State with Photo & Details Preview */
              <div className="buyer-reg-success-box">
                <div className="buyer-reg-success-icon">
                  <Check size={28} />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#15803d', marginBottom: 8 }}>
                  {t.successTitle}
                </h2>
                <p style={{ fontSize: 14.5, color: '#334155', lineHeight: 1.6, marginBottom: 16 }}>
                  {t.successDesc}
                </p>

                {/* Profile Snapshot with Uploaded Photo */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '12px 16px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  marginBottom: 20,
                  textAlign: 'left',
                  width: '100%',
                  boxSizing: 'border-box'
                }}>
                  {photoPreview ? (
                    <img 
                      src={photoPreview} 
                      alt="Uploaded Business Avatar" 
                      style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover', border: '2px solid #15803d' }}
                    />
                  ) : (
                    <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Building2 size={24} />
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {shopName || name}
                    </div>
                    <div style={{ fontSize: 13, color: '#475569' }}>
                      👤 {name} • 📞 {phone}
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>
                      ✉️ {email}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="buyer-reg-submit-btn"
                  onClick={() => {
                    window.location.hash = '#buyer-dashboard';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{ marginBottom: 10 }}
                >
                  <span>{lang === 'en' ? 'Go to Buyer Dashboard ➔' : 'வாங்குவோர் தளத்திற்கு செல்ல ➔'}</span>
                  <span className="buyer-btn-icon-pill">
                    <ArrowRight size={14} />
                  </span>
                </button>

                <button
                  type="button"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#0f4a30',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: '8px 14px'
                  }}
                  onClick={onNavigateToLogin}
                >
                  {t.successLoginBtn}
                </button>
              </div>
            ) : (
              /* Registration Form */
              <form className="buyer-reg-form" onSubmit={handleSubmit} noValidate>
                {/* --------------------------------------------------------
                    SECTION 1: PERSONAL DETAILS
                    -------------------------------------------------------- */}
                <div className="buyer-section-block">
                  <div className="buyer-section-header">
                    <h3 className="buyer-section-heading">
                      <User size={17} color="var(--buyer-primary)" />
                      <span>{t.section1Title}</span>
                    </h3>
                  </div>

                  {/* 1. PHOTO UPLOAD (Mandatory Field #1) */}
                  <div className="buyer-field-group">
                    <label className="buyer-input-label" htmlFor="buyer-photo-file-input">
                      <span>{t.photoLabel}<span className="required-star">*</span></span>
                    </label>

                    <input
                      id="buyer-photo-file-input"
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handlePhotoSelect(e.target.files[0]);
                        }
                      }}
                    />

                    <div
                      className={`buyer-photo-dropzone ${isDraggingPhoto ? 'is-dragging' : ''} ${touched.photo && errors.photo ? 'has-error' : ''}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          fileInputRef.current && fileInputRef.current.click();
                        }
                      }}
                      aria-label="Upload profile or business photo"
                    >
                      <div className="buyer-photo-preview-circle">
                        {photoPreview ? (
                          <img
                            src={photoPreview}
                            alt="Buyer Profile Preview"
                            className="buyer-photo-preview-img"
                          />
                        ) : (
                          <Camera size={26} color="var(--buyer-accent-text)" />
                        )}
                      </div>

                      <div className="buyer-photo-prompt-text">
                        <div className="buyer-photo-prompt-title">
                          {photoPreview ? (photoName || t.photoLabel) : (isDraggingPhoto ? t.photoDragPrompt : t.photoUploadText)}
                        </div>
                        <div className="buyer-photo-prompt-sub">
                          {t.photoUploadFormat}
                        </div>
                      </div>

                      {photoPreview ? (
                        <div className="buyer-photo-actions" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            className="buyer-photo-btn-change"
                            onClick={() => fileInputRef.current && fileInputRef.current.click()}
                          >
                            {t.photoChange}
                          </button>
                          <button
                            type="button"
                            className="buyer-photo-btn-remove"
                            onClick={removePhoto}
                            aria-label="Remove uploaded photo"
                          >
                            <X size={13} style={{ display: 'inline', marginRight: 2 }} />
                            {t.photoRemove}
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="buyer-photo-btn-change"
                          style={{ pointerEvents: 'none' }}
                        >
                          <Upload size={14} style={{ display: 'inline', marginRight: 4 }} />
                          {t.photoUploadText}
                        </button>
                      )}
                    </div>

                    {touched.photo && errors.photo && (
                      <div className="buyer-field-error" role="alert">
                        <AlertCircle size={14} />
                        <span>{errors.photo}</span>
                      </div>
                    )}
                  </div>

                  {/* 2-COLUMN ROW ON DESKTOP: NAME & PHONE */}
                  <div className="buyer-fields-row">
                    {/* 2. NAME (Mandatory Field #2) */}
                    <div className="buyer-field-group">
                      <label className="buyer-input-label" htmlFor="buyer-name-input">
                        <span>{t.nameLabel}<span className="required-star">*</span></span>
                      </label>
                      <div
                        className={`buyer-input-wrapper ${focusedField === 'name' ? 'is-focused' : ''} ${touched.name && errors.name ? 'has-error' : ''}`}
                      >
                        <span className="buyer-input-icon">
                          <User size={18} />
                        </span>
                        <input
                          id="buyer-name-input"
                          type="text"
                          className="buyer-text-input"
                          placeholder={t.namePlaceholder}
                          value={name}
                          autoComplete="name"
                          onChange={(e) => {
                            setName(e.target.value);
                            if (touched.name) {
                              setErrors(prev => ({ ...prev, name: validateField('name', e.target.value) }));
                            }
                          }}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => {
                            setFocusedField(null);
                            setTouched(prev => ({ ...prev, name: true }));
                            setErrors(prev => ({ ...prev, name: validateField('name', name) }));
                          }}
                        />
                      </div>
                      {touched.name && errors.name && (
                        <div className="buyer-field-error" role="alert">
                          <AlertCircle size={14} />
                          <span>{errors.name}</span>
                        </div>
                      )}
                    </div>

                    {/* 3. PHONE NUMBER (Mandatory Field #3 with clean +91 prefix - No OTP) */}
                    <div className="buyer-field-group">
                      <label className="buyer-input-label" htmlFor="buyer-phone-input">
                        <span>{t.phoneLabel}<span className="required-star">*</span></span>
                      </label>
                      <div
                        className={`buyer-input-wrapper ${focusedField === 'phone' ? 'is-focused' : ''} ${touched.phone && errors.phone ? 'has-error' : ''}`}
                      >
                        <div className="buyer-phone-combo">
                          <span className="buyer-country-prefix">+91</span>
                          <input
                            id="buyer-phone-input"
                            type="tel"
                            className="buyer-phone-input"
                            placeholder={t.phonePlaceholder}
                            value={phone}
                            maxLength={10}
                            autoComplete="tel"
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                              setPhone(val);
                              if (touched.phone) {
                                setErrors(prev => ({ ...prev, phone: validateField('phone', val) }));
                              }
                            }}
                            onFocus={() => setFocusedField('phone')}
                            onBlur={() => {
                              setFocusedField(null);
                              setTouched(prev => ({ ...prev, phone: true }));
                              setErrors(prev => ({ ...prev, phone: validateField('phone', phone) }));
                            }}
                          />
                        </div>
                      </div>
                      {touched.phone && errors.phone && (
                        <div className="buyer-field-error" role="alert">
                          <AlertCircle size={14} />
                          <span>{errors.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 2-COLUMN ROW ON DESKTOP: EMAIL & BUYER TYPE */}
                  <div className="buyer-fields-row">
                    {/* 4. EMAIL ADDRESS (Mandatory Field #4) */}
                    <div className="buyer-field-group">
                      <label className="buyer-input-label" htmlFor="buyer-email-input">
                        <span>{t.emailLabel}<span className="required-star">*</span></span>
                      </label>
                      <div
                        className={`buyer-input-wrapper ${focusedField === 'email' ? 'is-focused' : ''} ${touched.email && errors.email ? 'has-error' : ''}`}
                      >
                        <span className="buyer-input-icon">
                          <Mail size={18} />
                        </span>
                        <input
                          id="buyer-email-input"
                          type="email"
                          className="buyer-text-input"
                          placeholder={t.emailPlaceholder}
                          value={email}
                          autoComplete="email"
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (touched.email) {
                              setErrors(prev => ({ ...prev, email: validateField('email', e.target.value) }));
                            }
                          }}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => {
                            setFocusedField(null);
                            setTouched(prev => ({ ...prev, email: true }));
                            setErrors(prev => ({ ...prev, email: validateField('email', email) }));
                          }}
                        />
                      </div>
                      {touched.email && errors.email && (
                        <div className="buyer-field-error" role="alert">
                          <AlertCircle size={14} />
                          <span>{errors.email}</span>
                        </div>
                      )}
                    </div>

                    {/* 5. BUYER TYPE (Mandatory Field #5 with outline icons) */}
                    <div className="buyer-field-group" ref={dropdownRef}>
                      <label className="buyer-input-label" id="buyer-type-label">
                        <span>{t.buyerTypeLabel}<span className="required-star">*</span></span>
                      </label>
                      <div className="buyer-select-wrapper">
                        <button
                          type="button"
                          className={`buyer-select-button ${buyerTypeOpen ? 'is-open' : ''} ${touched.buyerType && errors.buyerType ? 'has-error' : ''}`}
                          onClick={() => setBuyerTypeOpen(prev => !prev)}
                          aria-haspopup="listbox"
                          aria-expanded={buyerTypeOpen}
                          aria-labelledby="buyer-type-label"
                        >
                          <div className="buyer-select-selection">
                            {selectedTypeObj ? (
                              <>
                                <span className="buyer-select-icon-box">
                                  <selectedTypeObj.icon size={16} />
                                </span>
                                <span style={{ fontWeight: 600 }}>{selectedTypeObj.label}</span>
                              </>
                            ) : (
                              <span style={{ color: 'var(--buyer-text-dim)' }}>
                                {t.buyerTypePlaceholder}
                              </span>
                            )}
                          </div>
                          <ChevronDown
                            size={16}
                            color="var(--buyer-text-muted)"
                            style={{
                              transform: buyerTypeOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.16s ease'
                            }}
                          />
                        </button>

                        {buyerTypeOpen && (
                          <div className="buyer-select-dropdown" role="listbox">
                            {buyerTypeOptions.map((opt) => {
                              const IconComponent = opt.icon;
                              const isSelected = buyerType === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  className={`buyer-select-option ${isSelected ? 'is-selected' : ''}`}
                                  role="option"
                                  aria-selected={isSelected}
                                  onClick={() => {
                                    setBuyerType(opt.id);
                                    setBuyerTypeOpen(false);
                                    setTouched(prev => ({ ...prev, buyerType: true }));
                                    setErrors(prev => ({ ...prev, buyerType: '' }));
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span className="buyer-select-icon-box">
                                      <IconComponent size={15} />
                                    </span>
                                    <div>
                                      <div style={{ fontWeight: 700, fontSize: 13.5 }}>{opt.label}</div>
                                      <div style={{ fontSize: 11.5, color: 'var(--buyer-text-muted)' }}>{opt.desc}</div>
                                    </div>
                                  </div>
                                  {isSelected && <Check size={16} color="var(--buyer-accent-text)" />}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      {touched.buyerType && errors.buyerType && (
                        <div className="buyer-field-error" role="alert">
                          <AlertCircle size={14} />
                          <span>{errors.buyerType}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* --------------------------------------------------------
                    SECTION 2: BUSINESS DETAILS
                    -------------------------------------------------------- */}
                <div className="buyer-section-block">
                  <div className="buyer-section-header">
                    <h3 className="buyer-section-heading">
                      <Building size={17} color="var(--buyer-primary)" />
                      <span>{t.section2Title}</span>
                    </h3>
                    <p className="buyer-section-subtext">{t.section2Desc}</p>
                  </div>

                  {/* 6. SHOP / BUSINESS NAME (Mandatory Field #6) */}
                  <div className="buyer-field-group">
                    <label className="buyer-input-label" htmlFor="buyer-shopname-input">
                      <span>{t.shopNameLabel}<span className="required-star">*</span></span>
                    </label>
                    <div
                      className={`buyer-input-wrapper ${focusedField === 'shopName' ? 'is-focused' : ''} ${touched.shopName && errors.shopName ? 'has-error' : ''}`}
                    >
                      <span className="buyer-input-icon">
                        <Store size={18} />
                      </span>
                      <input
                        id="buyer-shopname-input"
                        type="text"
                        className="buyer-text-input"
                        placeholder={t.shopNamePlaceholder}
                        value={shopName}
                        autoComplete="organization"
                        onChange={(e) => {
                          setShopName(e.target.value);
                          if (touched.shopName) {
                            setErrors(prev => ({ ...prev, shopName: validateField('shopName', e.target.value) }));
                          }
                        }}
                        onFocus={() => setFocusedField('shopName')}
                        onBlur={() => {
                          setFocusedField(null);
                          setTouched(prev => ({ ...prev, shopName: true }));
                          setErrors(prev => ({ ...prev, shopName: validateField('shopName', shopName) }));
                        }}
                      />
                    </div>
                    <div className="buyer-input-helper">{t.shopNameHelper}</div>
                    {touched.shopName && errors.shopName && (
                      <div className="buyer-field-error" role="alert">
                        <AlertCircle size={14} />
                        <span>{errors.shopName}</span>
                      </div>
                    )}
                  </div>

                  {/* 7. BUSINESS ADDRESS (Mandatory Field #7 - Multiline Textarea) */}
                  <div className="buyer-field-group">
                    <label className="buyer-input-label" htmlFor="buyer-address-input">
                      <span>{t.addressLabel}<span className="required-star">*</span></span>
                    </label>
                    <div
                      className={`buyer-textarea-wrapper ${focusedField === 'address' ? 'is-focused' : ''} ${touched.address && errors.address ? 'has-error' : ''}`}
                    >
                      <span className="buyer-textarea-icon">
                        <MapPin size={18} />
                      </span>
                      <textarea
                        id="buyer-address-input"
                        rows={3}
                        className="buyer-textarea-input"
                        placeholder={t.addressPlaceholder}
                        value={address}
                        autoComplete="street-address"
                        onChange={(e) => {
                          setAddress(e.target.value);
                          if (touched.address) {
                            setErrors(prev => ({ ...prev, address: validateField('address', e.target.value) }));
                          }
                        }}
                        onFocus={() => setFocusedField('address')}
                        onBlur={() => {
                          setFocusedField(null);
                          setTouched(prev => ({ ...prev, address: true }));
                          setErrors(prev => ({ ...prev, address: validateField('address', address) }));
                        }}
                      />
                    </div>
                    {touched.address && errors.address && (
                      <div className="buyer-field-error" role="alert">
                        <AlertCircle size={14} />
                        <span>{errors.address}</span>
                      </div>
                    )}
                  </div>

                  {/* 8. GSTIN NUMBER (Mandatory Field #8) */}
                  <div className="buyer-field-group">
                    <label className="buyer-input-label" htmlFor="buyer-gstin-input">
                      <span>{t.gstinLabel}<span className="required-star">*</span></span>
                    </label>
                    <div
                      className={`buyer-input-wrapper ${focusedField === 'gstin' ? 'is-focused' : ''} ${touched.gstin && errors.gstin ? 'has-error' : ''}`}
                    >
                      <span className="buyer-input-icon">
                        <FileText size={18} />
                      </span>
                      <input
                        id="buyer-gstin-input"
                        type="text"
                        className="buyer-text-input"
                        placeholder={t.gstinPlaceholder}
                        maxLength={15}
                        style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}
                        value={gstin}
                        onChange={(e) => {
                          const upper = e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, '').slice(0, 15);
                          setGstin(upper);
                          if (touched.gstin) {
                            setErrors(prev => ({ ...prev, gstin: validateField('gstin', upper) }));
                          }
                        }}
                        onFocus={() => setFocusedField('gstin')}
                        onBlur={() => {
                          setFocusedField(null);
                          setTouched(prev => ({ ...prev, gstin: true }));
                          setErrors(prev => ({ ...prev, gstin: validateField('gstin', gstin) }));
                        }}
                      />
                    </div>
                    <div className="buyer-input-helper">{t.gstinHelper}</div>
                    {touched.gstin && errors.gstin && (
                      <div className="buyer-field-error" role="alert">
                        <AlertCircle size={14} />
                        <span>{errors.gstin}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* --------------------------------------------------------
                    FORM COMPLETION AREA
                    -------------------------------------------------------- */}
                {/* Confirmation Checkbox */}
                <div className="buyer-field-group">
                  <label
                    className="buyer-confirm-row"
                    htmlFor="buyer-confirm-checkbox"
                  >
                    <input
                      id="buyer-confirm-checkbox"
                      type="checkbox"
                      className="buyer-confirm-checkbox"
                      checked={isConfirmed}
                      onChange={(e) => {
                        setIsConfirmed(e.target.checked);
                        if (touched.confirm) {
                          setErrors(prev => ({ ...prev, confirm: e.target.checked ? '' : validateField('confirm', e.target.checked) }));
                        }
                      }}
                    />
                    <span className="buyer-confirm-text">
                      {t.confirmLabel}
                    </span>
                  </label>
                  {touched.confirm && errors.confirm && (
                    <div className="buyer-field-error" role="alert">
                      <AlertCircle size={14} />
                      <span>{errors.confirm}</span>
                    </div>
                  )}
                </div>

                {/* Primary CTA Submit Button */}
                <button
                  type="submit"
                  className="buyer-reg-submit-btn"
                  disabled={submitStatus === 'loading'}
                  aria-busy={submitStatus === 'loading'}
                >
                  {submitStatus === 'loading' ? (
                    <>
                      <Loader2 size={18} className="buyer-reg-spinner" />
                      <span>{t.submitLoading}</span>
                    </>
                  ) : (
                    <>
                      <span>{t.submitNormal}</span>
                      <span className="buyer-btn-icon-pill">
                        <ArrowRight size={14} />
                      </span>
                    </>
                  )}
                </button>

                {/* Login Link */}
                <div className="buyer-reg-login-row">
                  <span>{t.alreadyHaveAccount}</span>
                  <button
                    type="button"
                    className="buyer-reg-login-link"
                    onClick={onNavigateToLogin}
                  >
                    {t.signInLink}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Form Pane Footer Note */}
          <footer className="buyer-reg-footer">
            <p>{t.footerProtected}</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
