import React from 'react';
import { ArrowLeft, User, QrCode, ShieldCheck, Sun, Wifi, Globe, Phone, FileText, CheckCircle2 } from 'lucide-react';
import { translations } from '../data/translations';

export default function ProfileScreen({
  lang,
  setLang,
  isHighContrast,
  setIsHighContrast,
  isOffline,
  setIsOffline,
  onBack
}) {
  const t = translations[lang];

  return (
    <div style={{ padding: '16px 18px 90px 18px', background: '#f7faf8', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <button
          onClick={onBack}
          style={{
            background: '#ffffff',
            border: '1.5px solid #cbd5e1',
            borderRadius: '50%',
            width: 44,
            height: 44,
            minHeight: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          aria-label="Back"
        >
          <ArrowLeft size={22} color="#14532d" />
        </button>

        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#14532d' }}>
          {lang === 'ta' ? 'விவசாயி சுயவிவரம்' : 'Farmer Profile'}
        </h2>

        <div style={{ width: 44 }} />
      </div>

      {/* Digital Uzhavar ID Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #14532d 0%, #15803d 50%, #166534 100%)',
          borderRadius: 22,
          padding: 18,
          color: '#ffffff',
          boxShadow: '0 8px 24px rgba(20, 83, 45, 0.3)',
          marginBottom: 20,
          position: 'relative',
          border: '2px solid #86efac'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/logo.jpg" alt="" style={{ width: 34, height: 34, borderRadius: '50%', border: '1.5px solid #fff' }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#86efac' }}>தமிழ்நாடு வேளாண் துறை</div>
              <div style={{ fontSize: 11, color: '#bbf7d0' }}>Uzhavar Smart ID</div>
            </div>
          </div>
          <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>
            {lang === 'ta' ? 'சரிபார்க்கப்பட்டது' : 'Verified'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <img
            src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80"
            alt="Farmer"
            style={{ width: 62, height: 62, borderRadius: 14, objectFit: 'cover', border: '2px solid #86efac' }}
          />
          <div>
            <div style={{ fontSize: 19, fontWeight: 800 }}>
              {lang === 'ta' ? 'உழவர் ஆர். முனியாண்டி' : 'Farmer R. Muniyandi'}
            </div>
            <div style={{ fontSize: 13, color: '#bbf7d0', fontWeight: 600 }}>
              {lang === 'ta' ? 'அலங்காநல்லூர், மதுரை மாவட்டம்' : 'Alanganallur, Madurai District'}
            </div>
            <div style={{ fontSize: 12, color: '#e2f1e7', marginTop: 2, fontFamily: 'monospace' }}>
              ID: TN-UZH-2024-9182
            </div>
          </div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 12, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <div>
            <div style={{ color: '#86efac', fontSize: 11 }}>{lang === 'ta' ? 'நிலப்பரப்பு' : 'Land Size'}</div>
            <div style={{ fontWeight: 800 }}>2.5 ஏக்கர் (Acres)</div>
          </div>
          <div>
            <div style={{ color: '#86efac', fontSize: 11 }}>{lang === 'ta' ? 'முக்கிய பயிர்கள்' : 'Crops'}</div>
            <div style={{ fontWeight: 800 }}>நெல், தக்காளி</div>
          </div>
          <div>
            <div style={{ color: '#86efac', fontSize: 11 }}>{lang === 'ta' ? 'வங்கி இணைப்பு' : 'Aadhaar Seeded'}</div>
            <div style={{ fontWeight: 800, color: '#86efac' }}>இணைக்கப்பட்டது ✓</div>
          </div>
        </div>
      </div>

      {/* Accessibility & Field Mode Settings */}
      <div style={{ background: '#ffffff', borderRadius: 18, border: '1.5px solid #e2e8f0', padding: 16, marginBottom: 18 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>
          {lang === 'ta' ? 'பயன்பாட்டு அமைப்புகள்' : 'App Settings & Accessibility'}
        </h3>

        {/* Outdoor Sunlight Mode Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Sun size={20} color="#ea580c" />
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>
                {lang === 'ta' ? 'சூரிய ஒளி தெளிவு முறை' : 'Outdoor Sun High Contrast'}
              </div>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                {lang === 'ta' ? 'வயல்வெளியில் அதிக வெளிச்சத்தில் தெளிவாக பார்க்க' : 'Extra contrast for bright field sunlight'}
              </div>
            </div>
          </div>
          <input
            type="checkbox"
            checked={isHighContrast}
            onChange={(e) => setIsHighContrast(e.target.checked)}
            style={{ width: 24, height: 24, accentColor: '#16a34a', cursor: 'pointer' }}
          />
        </div>

        {/* Offline Mode Banner Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Wifi size={20} color="#0284c7" />
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>
                {lang === 'ta' ? 'ஆஃப்லைன் முறை சோதனை' : 'Test Offline Mode'}
              </div>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                {lang === 'ta' ? 'நெட்வொர்க் இல்லாதபோது சேமிக்கப்பட்ட தரவு காட்சி' : 'Show cached data banner when network drops'}
              </div>
            </div>
          </div>
          <input
            type="checkbox"
            checked={isOffline}
            onChange={(e) => setIsOffline(e.target.checked)}
            style={{ width: 24, height: 24, accentColor: '#16a34a', cursor: 'pointer' }}
          />
        </div>

        {/* Language Switch */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Globe size={20} color="#16a34a" />
            <div style={{ fontSize: 15, fontWeight: 700 }}>
              {lang === 'ta' ? 'மொழி / Language' : 'Language / மொழி'}
            </div>
          </div>
          <button
            onClick={() => setLang(lang === 'ta' ? 'en' : 'ta')}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              background: '#f0fdf4',
              color: '#15803d',
              border: '1.5px solid #86efac',
              fontWeight: 800,
              fontSize: 14,
              cursor: 'pointer'
            }}
          >
            {lang === 'ta' ? 'English' : 'தமிழ்'}
          </button>
        </div>
      </div>

      {/* Emergency Helpline Box */}
      <div style={{ background: '#fefce8', border: '1.5px solid #fde047', borderRadius: 18, padding: 16 }}>
        <h4 style={{ fontSize: 15, fontWeight: 800, color: '#854d0e', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Phone size={18} color="#b45309" />
          {lang === 'ta' ? 'விவசாயி உதவி எண்கள்' : 'Agricultural Helplines'}
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
            <span>{lang === 'ta' ? 'கிசான் கால் சென்டர்:' : 'Kisan Call Centre:'}</span>
            <strong style={{ color: '#15803d' }}>1800-180-1551 (இலவசம்)</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
            <span>{lang === 'ta' ? 'உழவர் அலுவலர் (மதுரை):' : 'Agri Officer (Madurai):'}</span>
            <strong style={{ color: '#15803d' }}>0452-253-0000</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
