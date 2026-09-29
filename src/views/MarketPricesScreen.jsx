import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, ArrowUpRight, ArrowDownRight, Volume2, VolumeX, MapPin, Filter } from 'lucide-react';
import { mockMarketPrices } from '../data/mockData';
import { speechController } from '../utils/speechHelper';

export default function MarketPricesScreen({ lang, onBack }) {
  const [selectedMandi, setSelectedMandi] = useState('all');
  const [isSpeakingAll, setIsSpeakingAll] = useState(false);

  const mandis = [
    { id: 'all', nameTa: 'அனைத்து மண்டிகள்', nameEn: 'All Mandis' },
    { id: 'madurai', nameTa: 'மதுரை', nameEn: 'Madurai' },
    { id: 'thanjavur', nameTa: 'தஞ்சாவூர்', nameEn: 'Thanjavur' },
    { id: 'coimbatore', nameTa: 'கோவை', nameEn: 'Coimbatore' },
    { id: 'trichy', nameTa: 'திருச்சி', nameEn: 'Trichy' },
    { id: 'erode', nameTa: 'ஈரோடு', nameEn: 'Erode' },
    { id: 'pollachi', nameTa: 'பொள்ளாச்சி', nameEn: 'Pollachi' }
  ];

  const handleSpeakAllPrices = () => {
    const speech = lang === 'ta'
      ? `தமிழக இன்றைய மண்டி நிலவரம்: நெல் 2,350 ரூபாய். நாட்டு தக்காளி 34 ரூபாய். சின்ன வெங்காயம் 68 ரூபாய். பொள்ளாச்சி தேங்காய் 28 ரூபாய். விரலி மஞ்சள் 14,250 ரூபாய்.`
      : `Today's Tamil Nadu Mandi rates: Paddy 2,350 per bag. Country tomato 34 per kg. Small onion 68 per kg. Pollachi coconut 28 per piece. Erode turmeric 14,250 per quintal.`;

    if (isSpeakingAll) {
      speechController.stop();
      setIsSpeakingAll(false);
    } else {
      setIsSpeakingAll(true);
      speechController.speak(speech, lang, 'all-prices', () => {
        setIsSpeakingAll(false);
      });
    }
  };

  return (
    <div style={{ padding: '16px 18px 90px 18px', background: '#f7faf8', minHeight: '100%' }}>
      {/* Top Header */}
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

        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#14532d', display: 'flex', alignItems: 'center', gap: 6 }}>
          <TrendingUp size={22} color="#16a34a" />
          {lang === 'ta' ? 'சந்தை விலை நிலவரம்' : 'Live Mandi Prices'}
        </h2>

        <button
          className={`card-audio-pill ${isSpeakingAll ? 'speaking' : ''}`}
          onClick={handleSpeakAllPrices}
          style={{ width: 44, height: 44, minHeight: 44, minWidth: 44, borderRadius: '50%', background: '#dcfce7', color: '#15803d', border: '1.5px solid #86efac' }}
          title={lang === 'ta' ? 'முழு விலையை கேட்க' : 'Listen to all prices'}
        >
          {isSpeakingAll ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      {/* Mandi Horizontal Pills */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, scrollbarWidth: 'none' }}>
        {mandis.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelectedMandi(m.id)}
            style={{
              minHeight: 40,
              padding: '6px 14px',
              borderRadius: 20,
              border: selectedMandi === m.id ? '2px solid #16a34a' : '1.5px solid #cbd5e1',
              background: selectedMandi === m.id ? '#15803d' : '#ffffff',
              color: selectedMandi === m.id ? '#ffffff' : '#334155',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {lang === 'ta' ? m.nameTa : m.nameEn}
          </button>
        ))}
      </div>

      {/* Info notice */}
      <div style={{ background: '#fefce8', border: '1.5px solid #fef08a', borderRadius: 12, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#854d0e', fontWeight: 600 }}>
        {lang === 'ta'
          ? '🔔 உழவர் சந்தை & ஒழுங்குமுறை விற்பனைக்கூட அதிகாரப்பூர்வ தினசரி விலை பட்டியல் (காலை 06:00 மணி நிலவரம்)'
          : '🔔 Official daily rates from regulated markets & Uzhavar Sandhais (Updated 06:00 AM)'}
      </div>

      {/* Full Price Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {mockMarketPrices.map((item) => (
          <div
            key={item.id}
            style={{
              background: '#ffffff',
              borderRadius: 16,
              padding: '14px 16px',
              border: '1.5px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, border: '1px solid #bbf7d0' }}>
                {item.emoji}
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#0f172a' }}>
                  {lang === 'ta' ? item.nameTa : item.nameEn}
                </div>
                <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>
                  <MapPin size={12} style={{ display: 'inline', marginRight: 2 }} />
                  {lang === 'ta' ? item.mandiTa : item.mandiEn}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#15803d' }}>
                {item.price}
                <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
                  {lang === 'ta' ? item.unitTa : item.unitEn}
                </span>
              </div>
              <span className={`ticker-change-badge ${item.isUp ? 'positive' : 'negative'}`} style={{ marginTop: 2 }}>
                {item.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
