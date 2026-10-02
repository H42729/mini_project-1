import React, { useState } from 'react';
import { ArrowLeft, Globe, Sparkles, ShieldCheck, Phone, CheckCircle2, X } from 'lucide-react';
import './RoleSelectScreen.css';

export default function RoleSelectScreen({
  lang,
  setLang,
  onBack,
  onSelectFarmer,
  onSelectBuyer,
  onSelectDriver
}) {
  const [activeModal, setActiveModal] = useState(null); // 'farmer' | 'driver'
  const [farmerPhone, setFarmerPhone] = useState('');
  const [driverVehicle, setDriverVehicle] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [modalSuccessMsg, setModalSuccessMsg] = useState('');

  const toggleLanguage = () => {
    setLang(lang === 'ta' ? 'en' : 'ta');
  };

  const handleFarmerSubmit = (e) => {
    e.preventDefault();
    setModalSuccessMsg(
      lang === 'ta'
        ? 'விவசாயி சரிபார்ப்பு OTP உங்கள் எண்ணிற்கு அனுப்பப்பட்டது!'
        : 'Farmer verification OTP sent to your mobile number!'
    );
    setTimeout(() => {
      setModalSuccessMsg('');
      setActiveModal(null);
    }, 2000);
  };

  const handleDriverSubmit = (e) => {
    e.preventDefault();
    setModalSuccessMsg(
      lang === 'ta'
        ? 'ஓட்டுநர் கூட்டுப் பதிவு வெற்றிகரமாக பெறப்பட்டது!'
        : 'Driver partner registration received successfully!'
    );
    setTimeout(() => {
      setModalSuccessMsg('');
      setActiveModal(null);
    }, 2000);
  };

  return (
    <div className="role-select-root">
      {/* Top Header */}
      <header className="role-select-topbar">
        <div className="role-select-brand" onClick={onBack}>
          <img src="/logo.jpg" alt="Naam Uzhavar" className="role-select-logo-img" />
          <div className="role-select-brand-text">
            <span className="role-select-brand-name">
              {lang === 'ta' ? 'நாம் உழவர்' : 'Naam Uzhavar'}
            </span>
            <span className="role-select-brand-sub">
              {lang === 'ta' ? 'நேரடி வேளாண் தளம்' : 'Direct Agricultural Portal'}
            </span>
          </div>
        </div>

        <div className="role-select-topbar-actions">
          <button
            type="button"
            className="role-select-lang-btn"
            onClick={toggleLanguage}
            aria-label="Toggle Language"
          >
            <Globe size={16} />
            <span>{lang === 'ta' ? 'English' : 'தமிழ்'}</span>
          </button>

          <button
            type="button"
            className="role-select-back-btn"
            onClick={onBack}
            aria-label="Back to Home"
          >
            <ArrowLeft size={16} />
            <span>{lang === 'ta' ? 'முகப்பு' : 'Home'}</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="role-select-container">
        {/* Header Heading matching user's image */}
        <div className="role-select-header-box">
          <div className="role-select-badge">
            <Sparkles size={14} />
            <span>
              {lang === 'ta'
                ? 'இடைத்தரகர் இல்லாத நேரடி வேளாண் தளம்'
                : 'Zero Middlemen Direct Platform'}
            </span>
          </div>

          <h1 className="role-select-title">
            {lang === 'ta'
              ? 'நீங்கள் யார்? — உங்கள் பிரிவை தேர்வு செய்யுங்கள்:'
              : 'WHO ARE YOU? — SELECT YOUR ROLE:'}
          </h1>

          <p className="role-select-sub">
            {lang === 'ta'
              ? 'உங்கள் கணக்கில் உள்நுழைய அல்லது புதிய கணக்கு தொடங்க உங்கள் பிரிவை தேர்ந்தெடுக்கவும்.'
              : 'Choose your portal below to log in or register with verified credentials.'}
          </p>
        </div>

        {/* Three Role Login Cards (Matching the user screenshot) */}
        <div className="role-select-cards-grid">
          {/* Card 1: Farmer */}
          <div
            className="role-select-card farmer-theme"
            onClick={() => setActiveModal('farmer')}
            role="button"
            tabIndex={0}
          >
            <div className="role-card-top-row">
              <div className="role-card-icon-bubble">🌾</div>
              <span className="role-card-tag">
                {lang === 'ta' ? 'விவசாயி பிரிவு' : 'For Farmers'}
              </span>
            </div>

            <h2 className="role-card-heading">
              {lang === 'ta' ? 'நான் ஒரு விவசாயி' : 'I am a Farmer'}
            </h2>
            <span className="role-card-action-sub">
              {lang === 'ta' ? 'பயிர்களை விற்க ➔' : 'Sell My Produce ➔'}
            </span>

            <p className="role-card-desc">
              {lang === 'ta'
                ? 'உங்கள் விளைபொருட்களை இடைத்தரகர் இல்லாமல் நியாயமான விலையில் விற்று உடனடி நேரடி வங்கி கட்டணம் பெறுங்கள்.'
                : 'Sell your produce directly, no middlemen. Set your own fair prices and receive instant direct payments.'}
            </p>

            <button
              type="button"
              className="role-card-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                setActiveModal('farmer');
              }}
            >
              <span>{lang === 'ta' ? 'விவசாயியாக தொடர ➔' : 'Start Selling Now ➔'}</span>
            </button>
          </div>

          {/* Card 2: Buyer */}
          <div
            className="role-select-card buyer-theme"
            onClick={onSelectBuyer}
            role="button"
            tabIndex={0}
          >
            <div className="role-card-top-row">
              <div className="role-card-icon-bubble">🧺</div>
              <span className="role-card-tag">
                {lang === 'ta' ? 'வாங்குவோர் பிரிவு' : 'For Buyers'}
              </span>
            </div>

            <h2 className="role-card-heading">
              {lang === 'ta' ? 'நான் ஒரு வாங்குபவர்' : 'I am a Buyer'}
            </h2>
            <span className="role-card-action-sub">
              {lang === 'ta' ? 'புதிய உணவு வாங்க ➔' : 'Buy Farm-Fresh ➔'}
            </span>

            <p className="role-card-desc">
              {lang === 'ta'
                ? 'ஹோட்டல், சூப்பர் மார்க்கெட், வணிக நிறுவனங்களுக்கு தினசரி புதிய விளைபொருட்களை மொத்த விலையில் நேரடியாக பெறுங்கள்.'
                : 'Buy fresh harvest produce directly from local farms at wholesale rates with guaranteed farm-gate freshness.'}
            </p>

            <button
              type="button"
              className="role-card-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                onSelectBuyer();
              }}
            >
              <span>{lang === 'ta' ? 'வாங்குபவராக உள்நுழைக ➔' : 'Start Buying Fresh ➔'}</span>
            </button>
          </div>

          {/* Card 3: Driver */}
          <div
            className="role-select-card driver-theme"
            onClick={() => setActiveModal('driver')}
            role="button"
            tabIndex={0}
          >
            <div className="role-card-top-row">
              <div className="role-card-icon-bubble">🚚</div>
              <span className="role-card-tag">
                {lang === 'ta' ? 'ஓட்டுநர் பிரிவு' : 'For Drivers'}
              </span>
            </div>

            <h2 className="role-card-heading">
              {lang === 'ta' ? 'நான் ஒரு ஓட்டுநர்' : 'I am a Driver'}
            </h2>
            <span className="role-card-action-sub">
              {lang === 'ta' ? 'டெலிவரி செய்து சம்பாதிக்க ➔' : 'Deliver & Earn ➔'}
            </span>

            <p className="role-card-desc">
              {lang === 'ta'
                ? 'சரக்கு வாகனங்கள் மூலம் உள்ளூர் பண்ணைகளிலிருந்து விளைபொருட்களை ஏற்றி தினசரி உத்தரவாத வருமானம் பெறுங்கள்.'
                : 'Earn reliable daily income delivering produce from village farms to town markets and customer doorsteps.'}
            </p>

            <button
              type="button"
              className="role-card-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                setActiveModal('driver');
              }}
            >
              <span>{lang === 'ta' ? 'ஓட்டுநராக தொடர ➔' : 'Start Delivering ➔'}</span>
            </button>
          </div>
        </div>

        {/* Footer Support Info */}
        <div className="role-select-footer-note">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Phone size={15} color="#86efac" />
            <span>{lang === 'ta' ? 'உதவி எண்:' : 'Kisan Supply Helpline:'} <strong>1800-180-1551</strong></span>
          </span>
          <span>•</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <ShieldCheck size={15} color="#86efac" />
            <span>{lang === 'ta' ? '100% சரிபார்க்கப்பட்ட டிஜிட்டல் தளம்' : 'Verified Direct Agricultural Network'}</span>
          </span>
        </div>
      </main>

      {/* Internal Modals for Farmer and Driver */}
      {activeModal && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setActiveModal(null)}
              aria-label="Close Modal"
            >
              <X size={22} />
            </button>

            {modalSuccessMsg ? (
              <div style={{ textAlign: 'center', padding: '24px 10px' }}>
                <CheckCircle2 size={54} color="#16a34a" style={{ margin: '0 auto 14px auto' }} />
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#14532d', marginBottom: 8 }}>
                  {lang === 'ta' ? 'வெற்றிகரமாக பதிவு செய்யப்பட்டது!' : 'Success!'}
                </h3>
                <p style={{ color: '#475569', fontSize: 14 }}>{modalSuccessMsg}</p>
              </div>
            ) : activeModal === 'farmer' ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 44, marginBottom: 10 }}>🌾</div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#15803d', margin: '0 0 6px 0' }}>
                  {lang === 'ta' ? 'விவசாயி உள்நுழைவு / பதிவு' : 'Farmer Portal Login'}
                </h3>
                <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 18px 0', lineHeight: 1.4 }}>
                  {lang === 'ta'
                    ? 'விளைபொருட்களை நேரடியாக விற்க உங்கள் 10-இலக்க மொபைல் எண்ணை உள்ளிடவும்.'
                    : 'Enter your 10-digit mobile number to access direct farm trading.'}
                </p>

                <form onSubmit={handleFarmerSubmit}>
                  <div style={{ textAlign: 'left', marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                      {lang === 'ta' ? 'அலைபேசி எண்' : 'Mobile Number'}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="98421 54321"
                      value={farmerPhone}
                      onChange={(e) => setFarmerPhone(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: 12,
                        border: '2px solid #cbd5e1',
                        fontSize: 16,
                        boxSizing: 'border-box',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="role-card-action-btn"
                    style={{ background: '#16a34a' }}
                  >
                    <span>{lang === 'ta' ? 'OTP பெறுக & உள்நுழைக ➔' : 'Get OTP & Sign In ➔'}</span>
                  </button>
                </form>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 44, marginBottom: 10 }}>🚚</div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#c2410c', margin: '0 0 6px 0' }}>
                  {lang === 'ta' ? 'ஓட்டுநர் கூட்டாண்மை உள்நுழைவு' : 'Driver Partner Portal'}
                </h3>
                <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 18px 0', lineHeight: 1.4 }}>
                  {lang === 'ta'
                    ? 'உள்ளூர் விளைபொருட்கள் டெலிவரி செய்து தினசரி உத்தரவாத வருமானம் பெறுங்கள்.'
                    : 'Deliver produce between village farms and city buyers for reliable daily income.'}
                </p>

                <form onSubmit={handleDriverSubmit}>
                  <div style={{ textAlign: 'left', marginBottom: 12 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                      {lang === 'ta' ? 'வாகன வகை (Vehicle Type)' : 'Vehicle Type'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={lang === 'ta' ? 'எ.கா: Tata Ace / Pickup' : 'e.g. Tata Ace / Bolero Pickup'}
                      value={driverVehicle}
                      onChange={(e) => setDriverVehicle(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: 12,
                        border: '2px solid #cbd5e1',
                        fontSize: 15,
                        boxSizing: 'border-box',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ textAlign: 'left', marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                      {lang === 'ta' ? 'அலைபேசி எண்' : 'Mobile Number'}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="97860 12345"
                      value={driverPhone}
                      onChange={(e) => setDriverPhone(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: 12,
                        border: '2px solid #cbd5e1',
                        fontSize: 16,
                        boxSizing: 'border-box',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="role-card-action-btn"
                    style={{ background: '#ea580c' }}
                  >
                    <span>{lang === 'ta' ? 'ஓட்டுநராக இணைய ➔' : 'Register as Driver Partner ➔'}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
