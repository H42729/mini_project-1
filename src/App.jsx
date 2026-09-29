import React, { useState } from 'react';
import { 
  Globe, 
  ArrowRight, 
  Sprout, 
  ShoppingBasket, 
  Truck, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MapPin, 
  Menu, 
  X, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Sparkles,
  UserCheck
} from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState('ta'); // Tamil default, toggleable to English
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'farmer' | 'buyer' | 'driver' | 'login' | 'signup'
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Content dictionary
  const content = {
    ta: {
      appName: "நாம் உழவர்",
      appSubtitle: "விவசாயிகள் • நுகர்வோர் • ஓட்டுநர்கள்",
      tagline: "விவசாயிகள், வாங்குவோர், ஓட்டுநர்களை நேரடியாக இணைக்கும் தளம்",
      heroSubtitle: "கிராமத்து வயல்வெளியில் இருந்து புதிய விளைபொருட்களை இடைத்தரகர் இல்லாமல் உங்கள் இல்லத்திற்கே கொண்டு சேர்க்கும் நேரடி விவசாய தளம்.",
      whoAreYou: "நீங்கள் யார்? — உங்கள் பிரிவை தேர்வு செய்யுங்கள்:",
      farmerBtn: "நான் ஒரு விவசாயி",
      farmerBtnSub: "பயிர்களை விற்க",
      buyerBtn: "நான் ஒரு வாங்குபவர்",
      buyerBtnSub: "புதிய உணவு வாங்க",
      driverBtn: "நான் ஒரு ஓட்டுநர்",
      driverBtnSub: "டெலிவரி செய்து சம்பாதிக்க",

      navHome: "முகப்பு",
      navAbout: "எங்களைப் பற்றி",
      navHowItWorks: "செயல்முறை",
      navContact: "தொடர்புக்கு",
      btnLogin: "உள்நுழைக",
      btnSignUp: "பதிவு செய்க",

      roleSectionTitle: "ஒவ்வொருவருக்கும் எளிய சேவைகள்",
      roleSectionSub: "இடைத்தரகர் இல்லாத வெளிப்படையான வேளாண் வர்த்தகம்",

      farmerCardTitle: "விவசாயிகளுக்கு",
      farmerCardDesc: "உங்கள் விளைபொருட்களை இடைத்தரகர் இல்லாமல் நேரடியாக விற்று, நீங்களே விலை நிர்ணயித்து முழு லாபம் பெறுங்கள்.",
      farmerCardBtn: "விற்பனை செய்ய தொடங்க ➔",

      buyerCardTitle: "வாங்குவோருக்கு",
      buyerCardDesc: "பண்ணையிலிருந்து நேரடியாக பறிக்கப்பட்ட புதிய காய்கறி, பழங்களை நியாயமான மொத்த விலையில் வீட்டிற்கே பெறுங்கள்.",
      buyerCardBtn: "புதிய உணவு வாங்க தொடங்க ➔",

      driverCardTitle: "ஓட்டுநர்களுக்கு",
      driverCardDesc: "விவசாயிகளிடம் இருந்து விளைபொருட்களை நுகர்வோருக்கு கொண்டு சேர்த்து தினசரி நம்பகமான வருமானம் ஈட்டுங்கள்.",
      driverCardBtn: "வருமானம் ஈட்ட தொடங்க ➔",

      howItWorksTitle: "எப்படி செயல்படுகிறது?",
      howItWorksSub: "வயல் முதல் வீடு வரை எளிய 3 படிகளில் நேரடி இணைப்பு",

      step1Title: "1. விவசாயி பதிவு செய்கிறார்",
      step1Desc: "விவசாயி தனது அறுவடை அளவு மற்றும் எதிர்பார்க்கும் நியாயமான விலையை செயலியில் எளிதாக பதிவிடுகிறார்.",

      step2Title: "2. வாங்குபவர் ஆர்டர் செய்கிறார்",
      step2Desc: "வாங்குவோர் இடைத்தரகர் கமிஷன் இல்லாமல் நேரடியாக புதிய விளைபொருட்களை தேர்வு செய்து ஆர்டர் செய்கிறார்கள்.",

      step3Title: "3. ஓட்டுநர் டெலிவரி செய்கிறார்",
      step3Desc: "அருகிலுள்ள சரிபார்க்கப்பட்ட ஓட்டுநர் விளைபொருளை பண்ணையிலிருந்து நேரடியாக பெற்று விரைவாக டெலிவரி செய்கிறார்.",

      stat1Num: "500+",
      stat1Label: "பதிவு செய்த விவசாயிகள்",
      stat1Sub: "நேரடி விற்பனையாளர்கள்",

      stat2Num: "1,000+",
      stat2Label: "மகிழ்ச்சியான வாங்குபவர்கள்",
      stat2Sub: "புதிய உணவு நுகர்வோர்",

      stat3Num: "200+",
      stat3Label: "நம்பகமான ஓட்டுநர்கள்",
      stat3Sub: "உள்ளூர் போக்குவரத்து",

      stat4Num: "0%",
      stat4Label: "இடைத்தரகர் கமிஷன்",
      stat4Sub: "முழு லாபமும் உழவருக்கே",

      aboutTitle: "எங்கள் நோக்கம்",
      aboutText: "நாம் உழவர் தளம் தமிழ்நாட்டின் கிராமப்புற சிறு விவசாயிகளையும், நகர்ப்புற வாங்குபவர்களையும், உள்ளூர் சரக்கு வாகன ஓட்டுநர்களையும் ஒரே குடையின் கீழ் இணைக்கிறது. இடைத்தரகர்களை அகற்றி உழவருக்கு நியாயமான விலையும், மக்களுக்கு புதிய ஆரோக்கியமான உணவும், ஓட்டுநருக்கு நிலையான வேலையும் வழங்குவதே எங்கள் இலக்கு.",

      contactTitle: "தொடர்பு விவரங்கள்",
      helplineLabel: "விவசாயி இலவச உதவி எண்: 1800-180-1551",
      emailLabel: "மின்னஞ்சல்: support@naamuzhavar.org",
      addressLabel: "மதுரை & தஞ்சாவூர், தமிழ்நாடு",

      copyright: "© 2026 நாம் உழவர் (Naam Uzhavar). அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை. தமிழ்நாட்டு விவசாயிகளுக்காக உருவாக்கப்பட்டது.",
      switchLangText: "English",
      listenPage: "பக்கத்தை கேட்க",
      stopAudio: "ஆடியோ நிறுத்த"
    },

    en: {
      appName: "Naam Uzhavar",
      appSubtitle: "Farmers • Buyers • Drivers",
      tagline: "Connecting Farmers, Buyers, and Drivers — Directly",
      heroSubtitle: "Fresh farm produce straight from village fields to your doorstep, delivered reliably by local drivers without middlemen.",
      whoAreYou: "WHO ARE YOU? — SELECT YOUR ROLE:",
      farmerBtn: "I am a Farmer",
      farmerBtnSub: "Sell My Produce",
      buyerBtn: "I am a Buyer",
      buyerBtnSub: "Buy Farm-Fresh",
      driverBtn: "I am a Driver",
      driverBtnSub: "Deliver & Earn",

      navHome: "Home",
      navAbout: "About Us",
      navHowItWorks: "How It Works",
      navContact: "Contact",
      btnLogin: "Login",
      btnSignUp: "Sign Up",

      roleSectionTitle: "Tailored for Everyone",
      roleSectionSub: "Transparent agricultural marketplace with zero middlemen",

      farmerCardTitle: "For Farmers",
      farmerCardDesc: "Sell your produce directly, no middlemen. Set your own fair prices and receive instant direct payments.",
      farmerCardBtn: "Start Selling Now ➔",

      buyerCardTitle: "For Buyers",
      buyerCardDesc: "Buy fresh harvest produce directly from local farms at wholesale rates with guaranteed farm-gate freshness.",
      buyerCardBtn: "Start Buying Fresh ➔",

      driverCardTitle: "For Drivers",
      driverCardDesc: "Earn reliable daily income delivering produce from village farms to town markets and customer doorsteps.",
      driverCardBtn: "Start Delivering ➔",

      howItWorksTitle: "How It Works",
      howItWorksSub: "Connecting field, home, and delivery in 3 simple steps",

      step1Title: "1. Farmer lists produce",
      step1Desc: "Farmers set their available harvest quantity and fair price directly on the platform in seconds.",

      step2Title: "2. Buyer orders",
      step2Desc: "Buyers order farm-fresh produce at transparent rates without paying any middleman commission.",

      step3Title: "3. Driver delivers",
      step3Desc: "Nearby verified drivers pick up the produce straight from the farm gate and deliver it promptly.",

      stat1Num: "500+",
      stat1Label: "Registered Farmers",
      stat1Sub: "Direct sellers",

      stat2Num: "1,000+",
      stat2Label: "Happy Buyers",
      stat2Sub: "Direct consumers",

      stat3Num: "200+",
      stat3Label: "Verified Drivers",
      stat3Sub: "Local transport fleet",

      stat4Num: "0%",
      stat4Label: "Middlemen Brokerage",
      stat4Sub: "100% value to growers",

      aboutTitle: "Our Mission",
      aboutText: "Naam Uzhavar brings together smallholder farmers, conscious consumers, and local goods transport drivers on a unified transparent platform. By eliminating exploitative middlemen, we ensure fair returns for farmers, wholesome produce for consumers, and steady livelihoods for drivers.",

      contactTitle: "Contact Info",
      helplineLabel: "Kisan Toll-Free Helpline: 1800-180-1551",
      emailLabel: "Email: support@naamuzhavar.org",
      addressLabel: "Madurai & Thanjavur, Tamil Nadu",

      copyright: "© 2026 Naam Uzhavar. All rights reserved. Dedicated to Tamil Nadu Agriculture.",
      switchLangText: "தமிழ்",
      listenPage: "Listen to Page",
      stopAudio: "Stop Audio"
    }
  };

  const t = content[lang];

  const toggleLanguage = () => {
    stopSpeaking();
    setLang((prev) => (prev === 'ta' ? 'en' : 'ta'));
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const handleSpeakPage = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    const narration = lang === 'ta'
      ? `நாம் உழவர் இணையதளம். விவசாயிகள், வாங்குவோர் மற்றும் ஓட்டுநர்களை நேரடியாக இணைக்கும் தளம். விவசாயிகள் பயிர்களை நேரடியாக விற்கலாம், நுகர்வோர் புதிய காய்கறி வாங்கலாம், ஓட்டுநர்கள் டெலிவரி செய்து சம்பாதிக்கலாம்.`
      : `Welcome to Naam Uzhavar. Connecting Farmers, Buyers, and Drivers directly. Farmers sell without middlemen, buyers get fresh farm produce, and drivers earn by delivering locally.`;

    const utterance = new SpeechSynthesisUtterance(narration);
    utterance.lang = lang === 'ta' ? 'ta-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const openRoleModal = (role) => {
    setActiveModal(role);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="website-root">
      {/* ====================================================================
          1. HEADER
          ==================================================================== */}
      <header className="site-header">
        <div className="site-container header-inner">
          {/* Logo on Left */}
          <a href="#home" className="brand-link" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img 
              src="/logo.jpg" 
              alt="Naam Uzhavar Logo" 
              className="brand-logo"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=100&auto=format&fit=crop&q=80';
              }}
            />
            <div className="brand-text">
              <span className="brand-title-ta">{t.appName}</span>
              <span className="brand-tagline-sub">{t.appSubtitle}</span>
            </div>
          </a>

          {/* Simple Navigation Menu */}
          <nav className="header-nav">
            <a href="#home" className="nav-link active">{t.navHome}</a>
            <a href="#roles" className="nav-link">{lang === 'ta' ? 'சேவைகள்' : 'Roles'}</a>
            <a href="#how-it-works" className="nav-link">{t.navHowItWorks}</a>
            <a href="#about" className="nav-link">{t.navAbout}</a>
            <a href="#contact" className="nav-link">{t.navContact}</a>
          </nav>

          {/* Language Toggle & Login/Sign Up Buttons on Right */}
          <div className="header-right">
            {/* Audio narration button for accessibility */}
            <button
              onClick={handleSpeakPage}
              className={`btn-tts-speaker ${isSpeaking ? 'speaking' : ''}`}
              title={isSpeaking ? t.stopAudio : t.listenPage}
              aria-label="Text to speech"
            >
              {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            {/* Language Toggle */}
            <button 
              className="lang-toggle-button"
              onClick={toggleLanguage}
              aria-label="Toggle language between Tamil and English"
            >
              <Globe size={18} />
              <span>{t.switchLangText}</span>
            </button>

            {/* Auth Buttons */}
            <div className="auth-buttons-group">
              <button className="btn-login" onClick={() => openRoleModal('login')}>
                {t.btnLogin}
              </button>
              <button className="btn-signup" onClick={() => openRoleModal('signup')}>
                {t.btnSignUp}
              </button>
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button 
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu-drawer">
            <a href="#home" className="nav-link" onClick={() => setMobileMenuOpen(false)}>{t.navHome}</a>
            <a href="#roles" className="nav-link" onClick={() => setMobileMenuOpen(false)}>{lang === 'ta' ? 'சேவைகள்' : 'Roles'}</a>
            <a href="#how-it-works" className="nav-link" onClick={() => setMobileMenuOpen(false)}>{t.navHowItWorks}</a>
            <a href="#about" className="nav-link" onClick={() => setMobileMenuOpen(false)}>{t.navAbout}</a>
            <a href="#contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>{t.navContact}</a>
            <div className="mobile-auth-row">
              <button className="btn-login" onClick={() => { setMobileMenuOpen(false); openRoleModal('login'); }}>
                {t.btnLogin}
              </button>
              <button className="btn-signup" onClick={() => { setMobileMenuOpen(false); openRoleModal('signup'); }}>
                {t.btnSignUp}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ====================================================================
          2. HERO SECTION
          ==================================================================== */}
      <section id="home" className="hero-section">
        <div className="hero-content">
          <div className="hero-badge-strip">
            <Sparkles size={16} color="#fde047" />
            <span>{lang === 'ta' ? 'இடைத்தரகர் இல்லாத நேரடி வேளாண் தளம்' : 'Direct Agricultural Ecosystem Without Middlemen'}</span>
          </div>

          <h1 className="hero-tagline">
            {lang === 'ta' ? (
              <>
                Connecting Farmers, Buyers, and Drivers — Directly
                <span className="hero-tagline-tamil">விவசாயிகள், வாங்குவோர், ஓட்டுநர்களை நேரடியாக இணைக்கும் தளம்</span>
              </>
            ) : (
              <>
                Connecting Farmers, Buyers, and Drivers — Directly
                <span className="hero-tagline-tamil" style={{ fontSize: 24, opacity: 0.9 }}>
                  விவசாயிகள், நுகர்வோர் மற்றும் ஓட்டுநர்கள்
                </span>
              </>
            )}
          </h1>

          <p className="hero-description">
            {t.heroSubtitle}
          </p>

          <div className="hero-cta-instruction">
            {t.whoAreYou}
          </div>

          {/* Three Large Buttons Side by Side */}
          <div className="hero-role-buttons">
            {/* Button 1: Farmer */}
            <button 
              className="role-button role-button-farmer"
              onClick={() => openRoleModal('farmer')}
              aria-label={t.farmerBtn}
            >
              <span className="role-button-icon">🌾</span>
              <div className="role-button-text-group">
                <span className="role-button-label-main">{t.farmerBtn}</span>
                <span className="role-button-label-sub">{t.farmerBtnSub} ➔</span>
              </div>
            </button>

            {/* Button 2: Buyer */}
            <button 
              className="role-button role-button-buyer"
              onClick={() => openRoleModal('buyer')}
              aria-label={t.buyerBtn}
            >
              <span className="role-button-icon">🧺</span>
              <div className="role-button-text-group">
                <span className="role-button-label-main">{t.buyerBtn}</span>
                <span className="role-button-label-sub">{t.buyerBtnSub} ➔</span>
              </div>
            </button>

            {/* Button 3: Driver */}
            <button 
              className="role-button role-button-driver"
              onClick={() => openRoleModal('driver')}
              aria-label={t.driverBtn}
            >
              <span className="role-button-icon">🚚</span>
              <div className="role-button-text-group">
                <span className="role-button-label-main">{t.driverBtn}</span>
                <span className="role-button-label-sub">{t.driverBtnSub} ➔</span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. ROLE-BASED QUICK INFO CARDS
          ==================================================================== */}
      <section id="roles" className="section-roles">
        <div className="site-container">
          <div className="section-title-center">
            <h2 className="section-heading">{t.roleSectionTitle}</h2>
            <p className="section-subheading">{t.roleSectionSub}</p>
          </div>

          <div className="roles-grid">
            {/* Farmer Card */}
            <article className="role-card farmer-card">
              <div>
                <div className="card-icon-circle">
                  🌱
                </div>
                <div className="role-card-badge">
                  {lang === 'ta' ? 'விவசாயிகளுக்கு' : 'For Farmers'}
                </div>
                <h3 className="role-card-title">
                  {t.farmerCardTitle}
                </h3>
                <p className="role-card-description">
                  {t.farmerCardDesc}
                </p>
              </div>
              <button 
                className="role-card-btn"
                onClick={() => openRoleModal('farmer')}
              >
                <span>{t.farmerCardBtn}</span>
              </button>
            </article>

            {/* Buyer Card */}
            <article className="role-card buyer-card">
              <div>
                <div className="card-icon-circle">
                  🛒
                </div>
                <div className="role-card-badge">
                  {lang === 'ta' ? 'வாங்குவோருக்கு' : 'For Buyers'}
                </div>
                <h3 className="role-card-title">
                  {t.buyerCardTitle}
                </h3>
                <p className="role-card-description">
                  {t.buyerCardDesc}
                </p>
              </div>
              <button 
                className="role-card-btn"
                onClick={() => openRoleModal('buyer')}
              >
                <span>{t.buyerCardBtn}</span>
              </button>
            </article>

            {/* Driver Card */}
            <article className="role-card driver-card">
              <div>
                <div className="card-icon-circle">
                  🚚
                </div>
                <div className="role-card-badge">
                  {lang === 'ta' ? 'ஓட்டுநர்களுக்கு' : 'For Drivers'}
                </div>
                <h3 className="role-card-title">
                  {t.driverCardTitle}
                </h3>
                <p className="role-card-description">
                  {t.driverCardDesc}
                </p>
              </div>
              <button 
                className="role-card-btn"
                onClick={() => openRoleModal('driver')}
              >
                <span>{t.driverCardBtn}</span>
              </button>
            </article>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. HOW IT WORKS SECTION (Simple 3-Step Visual)
          ==================================================================== */}
      <section id="how-it-works" className="section-how-it-works">
        <div className="site-container">
          <div className="section-title-center">
            <h2 className="section-heading">{t.howItWorksTitle}</h2>
            <p className="section-subheading">{t.howItWorksSub}</p>
          </div>

          <div className="how-it-works-grid">
            {/* Step 1 */}
            <div className="how-step-card step-1">
              <div className="step-number-badge">1</div>
              <div className="step-illustration-icon">🌾</div>
              <h3 className="step-title">{t.step1Title}</h3>
              <p className="step-desc">{t.step1Desc}</p>
            </div>

            {/* Step 2 */}
            <div className="how-step-card step-2">
              <div className="step-number-badge">2</div>
              <div className="step-illustration-icon">📦</div>
              <h3 className="step-title">{t.step2Title}</h3>
              <p className="step-desc">{t.step2Desc}</p>
            </div>

            {/* Step 3 */}
            <div className="how-step-card step-3">
              <div className="step-number-badge">3</div>
              <div className="step-illustration-icon">🚚</div>
              <h3 className="step-title">{t.step3Title}</h3>
              <p className="step-desc">{t.step3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. TRUST / STATS SECTION
          ==================================================================== */}
      <section className="section-stats">
        <div className="site-container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{t.stat1Num}</div>
              <div className="stat-label-ta">{t.stat1Label}</div>
              <div className="stat-label-en">{t.stat1Sub}</div>
            </div>

            <div className="stat-item">
              <div className="stat-number">{t.stat2Num}</div>
              <div className="stat-label-ta">{t.stat2Label}</div>
              <div className="stat-label-en">{t.stat2Sub}</div>
            </div>

            <div className="stat-item">
              <div className="stat-number">{t.stat3Num}</div>
              <div className="stat-label-ta">{t.stat3Label}</div>
              <div className="stat-label-en">{t.stat3Sub}</div>
            </div>

            <div className="stat-item">
              <div className="stat-number">{t.stat4Num}</div>
              <div className="stat-label-ta">{t.stat4Label}</div>
              <div className="stat-label-en">{t.stat4Sub}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          ABOUT US SECTION (Lightweight)
          ==================================================================== */}
      <section id="about" style={{ padding: '70px 20px', background: '#fafcfb', borderBottom: '1px solid #e2e8f0' }}>
        <div className="site-container" style={{ maxWidth: 880, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#dcfce7', color: '#15803d', padding: '6px 14px', borderRadius: 20, fontSize: 14, fontWeight: 800, marginBottom: 16 }}>
            <ShieldCheck size={18} />
            <span>{lang === 'ta' ? 'வெளிப்படையான சமூக வேளாண்மை' : 'Transparent Rural Agriculture'}</span>
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#14532d', marginBottom: 16 }}>
            {t.aboutTitle}
          </h2>
          <p style={{ fontSize: 18, color: '#334155', lineHeight: 1.7 }}>
            {t.aboutText}
          </p>
        </div>
      </section>

      {/* ====================================================================
          6. FOOTER
          ==================================================================== */}
      <footer id="contact" className="site-footer">
        <div className="site-container">
          <div className="footer-grid">
            {/* Column 1: Brand & Description */}
            <div className="footer-brand-block">
              <div className="footer-logo-row">
                <img 
                  src="/logo.jpg" 
                  alt="Logo" 
                  className="footer-logo-img"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=100&auto=format&fit=crop&q=80';
                  }}
                />
                <span className="footer-title">{t.appName}</span>
              </div>
              <p className="footer-desc">
                {lang === 'ta'
                  ? 'விவசாயிகள், நுகர்வோர் மற்றும் ஓட்டுநர்களை நேரடியாக இணைக்கும் தமிழகத்தின் முன்னணி டிஜிட்டல் உழவர் தளம்.'
                  : 'Direct digital agricultural marketplace connecting farmers, buyers, and delivery drivers across Tamil Nadu.'}
              </p>
              {/* Language toggle repeated in footer */}
              <div>
                <button
                  className="lang-toggle-button"
                  onClick={toggleLanguage}
                  style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', borderColor: '#86efac' }}
                >
                  <Globe size={18} />
                  <span>{t.switchLangText}</span>
                </button>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="footer-col-heading">{lang === 'ta' ? 'விரைவு இணைப்புகள்' : 'Quick Navigation'}</h4>
              <ul className="footer-links-list">
                <li className="footer-link-item"><a href="#home">{t.navHome}</a></li>
                <li className="footer-link-item"><a href="#roles">{lang === 'ta' ? 'சேவைகள்' : 'Roles'}</a></li>
                <li className="footer-link-item"><a href="#how-it-works">{t.navHowItWorks}</a></li>
                <li className="footer-link-item"><a href="#about">{t.navAbout}</a></li>
                <li className="footer-link-item"><a href="#contact">{t.navContact}</a></li>
              </ul>
            </div>

            {/* Column 3: Contact Info */}
            <div>
              <h4 className="footer-col-heading">{t.contactTitle}</h4>
              <ul className="footer-contact-list">
                <li className="footer-contact-item">
                  <Phone size={18} color="#86efac" style={{ flexShrink: 0, marginTop: 4 }} />
                  <span>{t.helplineLabel}</span>
                </li>
                <li className="footer-contact-item">
                  <Mail size={18} color="#86efac" style={{ flexShrink: 0, marginTop: 4 }} />
                  <span>{t.emailLabel}</span>
                </li>
                <li className="footer-contact-item">
                  <MapPin size={18} color="#86efac" style={{ flexShrink: 0, marginTop: 4 }} />
                  <span>{t.addressLabel}</span>
                </li>
              </ul>

              {/* Social Links */}
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 10 }}>
                  {lang === 'ta' ? 'எங்களை பின்தொடரவும்:' : 'Follow Us:'}
                </div>
                <div className="social-links-row">
                  <a href="#contact" className="social-icon-btn" title="WhatsApp" aria-label="WhatsApp">💬</a>
                  <a href="#contact" className="social-icon-btn" title="YouTube" aria-label="YouTube">▶️</a>
                  <a href="#contact" className="social-icon-btn" title="Facebook" aria-label="Facebook">f</a>
                  <a href="#contact" className="social-icon-btn" title="Twitter" aria-label="Twitter">𝕏</a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom Row */}
          <div className="footer-bottom-row">
            <div>{t.copyright}</div>
            <div style={{ display: 'flex', gap: 16 }}>
              <a href="#home" style={{ color: '#94a3b8', textDecoration: 'none' }}>{lang === 'ta' ? 'தனியுரிமை கொள்கை' : 'Privacy Policy'}</a>
              <span style={{ color: '#475569' }}>•</span>
              <a href="#home" style={{ color: '#94a3b8', textDecoration: 'none' }}>{lang === 'ta' ? 'விதிமுறைகள்' : 'Terms of Service'}</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ====================================================================
          INTERACTIVE MOCK MODAL (Role Welcome / Login / Sign Up)
          ==================================================================== */}
      {activeModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal} aria-label="Close">
              ✕
            </button>

            {/* Farmer Role Modal */}
            {activeModal === 'farmer' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 50, marginBottom: 12 }}>🌾</div>
                <h3 style={{ fontSize: 24, fontWeight: 800, color: '#14532d', marginBottom: 8 }}>
                  {lang === 'ta' ? 'வணக்கம் உழவரே! (விவசாயி பிரிவு)' : 'Welcome, Farmer!'}
                </h3>
                <p style={{ fontSize: 16, color: '#475569', marginBottom: 20, lineHeight: 1.5 }}>
                  {lang === 'ta'
                    ? 'உங்கள் விளைபொருட்களை இடைத்தரகர் இல்லாமல் நேரடியாக நுகர்வோருக்கு விற்க உங்கள் தொலைபேசி எண்ணை உள்ளிடவும்.'
                    : 'List your crops, set your own wholesale prices, and connect directly with verified buyers across Tamil Nadu.'}
                </p>
                <div style={{ background: '#f0fdf4', padding: 14, borderRadius: 14, border: '1.5px solid #86efac', marginBottom: 20, textAlign: 'left', fontSize: 14 }}>
                  <div style={{ fontWeight: 800, color: '#15803d', marginBottom: 4 }}>✓ 0% இடைத்தரகர் கட்டணம் (Zero Commission)</div>
                  <div style={{ fontWeight: 800, color: '#15803d', marginBottom: 4 }}>✓ நேரடி வங்கி வரவு (Instant Direct Pay)</div>
                  <div style={{ fontWeight: 800, color: '#15803d' }}>✓ ஓட்டுநர் மூலம் பண்ணை வாயில் எடுத்துச்செல்லுதல்</div>
                </div>
                <input
                  type="tel"
                  placeholder={lang === 'ta' ? 'உங்கள் அலைபேசி எண் (Mobile Number)' : 'Enter 10-digit mobile number'}
                  style={{ width: '100%', minHeight: 48, padding: '10px 14px', borderRadius: 12, border: '2px solid #cbd5e1', fontSize: 16, marginBottom: 14, outline: 'none' }}
                />
                <button
                  onClick={() => { alert(lang === 'ta' ? 'விவசாயி பதிவு கோரிக்கை பெறப்பட்டது!' : 'Farmer registration initiated!'); closeModal(); }}
                  className="role-card-btn"
                  style={{ background: '#16a34a', color: '#fff' }}
                >
                  {lang === 'ta' ? 'விவசாயியாக தொடர ➔' : 'Continue as Farmer ➔'}
                </button>
              </div>
            )}

            {/* Buyer Role Modal */}
            {activeModal === 'buyer' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 50, marginBottom: 12 }}>🧺</div>
                <h3 style={{ fontSize: 24, fontWeight: 800, color: '#b45309', marginBottom: 8 }}>
                  {lang === 'ta' ? 'புதிய விளைபொருள் அங்காடி (வாங்குவோர்)' : 'Welcome, Buyer!'}
                </h3>
                <p style={{ fontSize: 16, color: '#475569', marginBottom: 20, lineHeight: 1.5 }}>
                  {lang === 'ta'
                    ? 'விவசாயிகளிடம் இருந்து நேரடியாக பறிக்கப்பட்ட புதிய காய்கறி, பழங்களை மலிவான விலையில் பெற பதிவு செய்யுங்கள்.'
                    : 'Purchase tree-fresh vegetables, paddy, and fruits straight from local farms with doorstep delivery.'}
                </p>
                <input
                  type="tel"
                  placeholder={lang === 'ta' ? 'உங்கள் அலைபேசி எண் (Mobile Number)' : 'Enter 10-digit mobile number'}
                  style={{ width: '100%', minHeight: 48, padding: '10px 14px', borderRadius: 12, border: '2px solid #cbd5e1', fontSize: 16, marginBottom: 14, outline: 'none' }}
                />
                <button
                  onClick={() => { alert(lang === 'ta' ? 'வாங்குவோர் உள்நுழைவு தொடங்கியது!' : 'Buyer portal login started!'); closeModal(); }}
                  className="role-card-btn"
                  style={{ background: '#f59e0b', color: '#451a03' }}
                >
                  {lang === 'ta' ? 'பண்ணை உணவு வாங்க தொடர ➔' : 'Start Shopping Fresh ➔'}
                </button>
              </div>
            )}

            {/* Driver Role Modal */}
            {activeModal === 'driver' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 50, marginBottom: 12 }}>🚚</div>
                <h3 style={{ fontSize: 24, fontWeight: 800, color: '#c2410c', marginBottom: 8 }}>
                  {lang === 'ta' ? 'வணக்கம் ஓட்டுநரே! (டெலிவரி பிரிவு)' : 'Welcome, Delivery Driver!'}
                </h3>
                <p style={{ fontSize: 16, color: '#475569', marginBottom: 20, lineHeight: 1.5 }}>
                  {lang === 'ta'
                    ? 'உங்கள் சரக்கு வாகனம் மூலம் பண்ணையிலிருந்து விளைபொருட்களை டெலிவரி செய்து தினசரி உத்தரவாத வருமானம் பெறுங்கள்.'
                    : 'Earn predictable daily income transporting produce from village farms to town markets.'}
                </p>
                <input
                  type="tel"
                  placeholder={lang === 'ta' ? 'வாகன எண் & அலைபேசி எண்' : 'Vehicle type & Mobile number'}
                  style={{ width: '100%', minHeight: 48, padding: '10px 14px', borderRadius: 12, border: '2px solid #cbd5e1', fontSize: 16, marginBottom: 14, outline: 'none' }}
                />
                <button
                  onClick={() => { alert(lang === 'ta' ? 'ஓட்டுநர் விண்ணப்பம் பதிவு செய்யப்பட்டது!' : 'Driver partner onboarded!'); closeModal(); }}
                  className="role-card-btn"
                  style={{ background: '#ea580c', color: '#fff' }}
                >
                  {lang === 'ta' ? 'ஓட்டுநராக இணைய ➔' : 'Join as Driver Partner ➔'}
                </button>
              </div>
            )}

            {/* Login / Sign Up Modal */}
            {(activeModal === 'login' || activeModal === 'signup') && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 44, marginBottom: 10 }}>🔐</div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#14532d', marginBottom: 8 }}>
                  {activeModal === 'login' 
                    ? (lang === 'ta' ? 'நாம் உழவர் உள்நுழைவு' : 'Login to Naam Uzhavar')
                    : (lang === 'ta' ? 'புதிய பயனர் பதிவு' : 'Sign Up for Naam Uzhavar')}
                </h3>
                <p style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>
                  {lang === 'ta' ? 'OTP பெற உங்கள் அலைபேசி எண்ணை உள்ளிடவும்' : 'Enter your mobile number to receive OTP'}
                </p>
                <input
                  type="tel"
                  placeholder="+91 98421 XXXXX"
                  style={{ width: '100%', minHeight: 48, padding: '10px 14px', borderRadius: 12, border: '2px solid #cbd5e1', fontSize: 16, marginBottom: 14, textAlign: 'center', fontWeight: 'bold' }}
                />
                <button
                  onClick={() => { alert(lang === 'ta' ? 'OTP அனுப்பப்பட்டது!' : 'Demo OTP sent to your phone!'); closeModal(); }}
                  className="role-card-btn"
                  style={{ background: '#16a34a', color: '#fff' }}
                >
                  {lang === 'ta' ? 'OTP பெறுக' : 'Send OTP'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
