import React, { useState } from 'react';
import { MapPin, Globe, Volume2, VolumeX, Sun, Wifi, WifiOff, ChevronDown, Check } from 'lucide-react';
import { translations } from '../data/translations';
import { speechController } from '../utils/speechHelper';

export default function Header({
  lang,
  setLang,
  selectedDistrict,
  setSelectedDistrict,
  isOffline,
  setIsOffline,
  isHighContrast,
  setIsHighContrast,
  onNavigateHome
}) {
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [isSpeakingHeader, setIsSpeakingHeader] = useState(false);
  const t = translations[lang];

  const currentDistrict = t.districts.find(d => d.id === selectedDistrict) || t.districts[0];

  const handleSpeakHeader = () => {
    const speechText = lang === 'ta'
      ? `நாம் உழவர் செயலி. தற்போதைய சந்தை: ${currentDistrict.name}. இடைத்தரகர் இன்றி விவசாயிகளிடம் நேரடியாக வாங்குங்கள் மற்றும் விற்பனை செய்யுங்கள்.`
      : `Welcome to Naam Uzhavar direct farming platform. Current market: ${currentDistrict.name}. Connect directly between farmers and buyers.`;

    if (isSpeakingHeader) {
      speechController.stop();
      setIsSpeakingHeader(false);
    } else {
      setIsSpeakingHeader(true);
      speechController.speak(speechText, lang, 'header', () => {
        setIsSpeakingHeader(false);
      });
    }
  };

  const toggleLanguage = () => {
    speechController.stop();
    const newLang = lang === 'ta' ? 'en' : 'ta';
    setLang(newLang);
  };

  return (
    <>
      <header className="app-header">
        <div className="header-top-row">
          <div className="brand-wrapper" onClick={onNavigateHome} title="Go to Home">
            <img 
              src="/logo.jpg" 
              alt="Naam Uzhavar Logo" 
              className="brand-logo-img"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=100&auto=format&fit=crop&q=80';
              }}
            />
            <div className="brand-text-block">
              <h1 className="app-title-ta">{t.appTitle}</h1>
              <span className="app-title-en">{lang === 'ta' ? 'Naam Uzhavar' : 'நாம் உழவர்'}</span>
            </div>
          </div>

          <div className="header-actions">
            <button 
              className={`tts-speaker-btn ${isSpeakingHeader ? 'speaking' : ''}`}
              onClick={handleSpeakHeader}
              aria-label={t.listenAudio}
              title={t.listenAudio}
            >
              {isSpeakingHeader ? <VolumeX size={22} /> : <Volume2 size={22} />}
            </button>

            <button 
              className="lang-toggle-btn"
              onClick={toggleLanguage}
              aria-label="Switch Language"
              title="Switch Language"
            >
              <Globe size={18} />
              <span>{lang === 'ta' ? 'English' : 'தமிழ்'}</span>
            </button>
          </div>
        </div>

        <div 
          className="location-selector-row"
          onClick={() => setShowDistrictModal(true)}
          role="button"
          tabIndex={0}
          aria-label="Select Mandi Location"
        >
          <div className="location-info">
            <MapPin size={18} color="#86efac" />
            <span>{currentDistrict.name}</span>
          </div>
          <span className="location-change-tag">
            {lang === 'ta' ? 'மாற்ற ▾' : 'Change ▾'}
          </span>
        </div>
      </header>

      {showDistrictModal && (
        <div className="modal-backdrop" onClick={() => setShowDistrictModal(false)}>
          <div className="voice-modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#14532d', display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={22} color="#16a34a" />
                {lang === 'ta' ? 'உங்கள் சந்தை / மாவட்டத்தை தேர்வு செய்க' : 'Select Your Mandi Market'}
              </h3>
              <button 
                onClick={() => setShowDistrictModal(false)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 36, height: 36, minHeight: 36, cursor: 'pointer', fontWeight: 'bold' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8, maxHeight: '360px', overflowY: 'auto' }}>
              {t.districts.map((dist) => {
                const isSelected = dist.id === selectedDistrict;
                return (
                  <button
                    key={dist.id}
                    onClick={() => {
                      setSelectedDistrict(dist.id);
                      setShowDistrictModal(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: 14,
                      border: isSelected ? '2px solid #16a34a' : '1.5px solid #e2e8f0',
                      background: isSelected ? '#f0fdf4' : '#ffffff',
                      color: isSelected ? '#14532d' : '#1e293b',
                      fontSize: 16,
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span>{dist.name}</span>
                    {isSelected && <Check size={20} color="#16a34a" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
