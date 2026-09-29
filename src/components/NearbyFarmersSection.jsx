import React, { useState } from 'react';
import { Phone, MessageCircle, CheckCircle2, MapPin, Tag, ArrowRight } from 'lucide-react';
import { mockNearbyListings } from '../data/mockData';
import { translations } from '../data/translations';

export default function NearbyFarmersSection({ lang, onNavigateToBuy }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [calledFarmer, setCalledFarmer] = useState(null);
  const t = translations[lang];

  const filterTabs = [
    { id: 'all', labelTa: t.filterAll, labelEn: t.filterAll },
    { id: 'veg', labelTa: t.filterVeg, labelEn: t.filterVeg },
    { id: 'grains', labelTa: t.filterGrains, labelEn: t.filterGrains },
    { id: 'fruits', labelTa: t.filterFruits, labelEn: t.filterFruits }
  ];

  const filteredListings = mockNearbyListings.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.cropType === activeFilter;
  });

  const handleCall = (listing) => {
    setCalledFarmer(listing);
    setTimeout(() => {
      setCalledFarmer(null);
    }, 3500);
  };

  const handleChat = (listing) => {
    const message = lang === 'ta'
      ? `வணக்கம் ${listing.farmerNameTa}, நாம் உழவர் செயலியில் உங்கள் ${listing.titleTa} விளம்பரத்தை பார்த்தேன். விலை மற்றும் கிடைக்கும் விவரம் கூறவும்.`
      : `Hello ${listing.farmerNameEn}, I saw your listing for ${listing.titleEn} on Naam Uzhavar. Please let me know availability and delivery options.`;
    
    window.open(`https://wa.me/91${listing.phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section className="section-wrapper" aria-label="Nearby Farmers Produce">
      <div className="section-header-row">
        <div>
          <h2 className="section-title">
            {t.nearbyFarmersTitle}
          </h2>
          <span className="section-subtext">
            {t.nearbyFarmersSubtitle}
          </span>
        </div>

        <button
          onClick={onNavigateToBuy}
          style={{
            background: 'none',
            border: 'none',
            color: '#15803d',
            fontSize: 14,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            minHeight: 40
          }}
        >
          <span>{lang === 'ta' ? 'அனைத்தும்' : 'View All'}</span>
          <ArrowRight size={16} />
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10, scrollbarWidth: 'none' }}>
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            style={{
              minHeight: 44,
              padding: '6px 16px',
              borderRadius: 24,
              border: activeFilter === tab.id ? '2px solid #16a34a' : '1.5px solid #cbd5e1',
              background: activeFilter === tab.id ? '#15803d' : '#ffffff',
              color: activeFilter === tab.id ? '#ffffff' : '#334155',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            {lang === 'ta' ? tab.labelTa : tab.labelEn}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 6 }}>
        {filteredListings.map((item) => (
          <article key={item.id} className="farmer-listing-card">
            <div className="listing-farmer-header">
              <div className="farmer-meta">
                <img
                  src={item.farmerAvatar}
                  alt={item.farmerNameEn}
                  className="farmer-avatar"
                />
                <div>
                  <div className="farmer-name">
                    <span>{lang === 'ta' ? item.farmerNameTa : item.farmerNameEn}</span>
                    <CheckCircle2 className="verified-icon" />
                  </div>
                  <div className="farmer-location-dist">
                    <MapPin size={12} style={{ display: 'inline', marginRight: 3 }} />
                    {lang === 'ta' ? item.locationTa : item.locationEn} • {item.distance}
                  </div>
                </div>
              </div>

              <span style={{ fontSize: 12, fontWeight: 700, color: '#15803d', background: '#dcfce7', padding: '4px 8px', borderRadius: 6 }}>
                {t.directFromFarm}
              </span>
            </div>

            <div className="listing-content-grid">
              <div className="produce-img-box">
                <img
                  src={item.image}
                  alt={item.titleEn}
                  className="produce-img"
                  loading="lazy"
                />
                <span className="direct-tag">
                  {lang === 'ta' ? 'அறுவடை தயார்' : 'Harvest Ready'}
                </span>
              </div>

              <div className="produce-details">
                <div>
                  <h3 className="produce-title">
                    {lang === 'ta' ? item.titleTa : item.titleEn}
                  </h3>
                  <div className="produce-qty">
                    {lang === 'ta' ? item.quantityTa : item.quantityEn}
                  </div>
                </div>

                <div className="produce-price-row">
                  <span className="produce-price">
                    {item.pricePerUnit}
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>
                      {lang === 'ta' ? item.unitTa : item.unitEn}
                    </span>
                  </span>
                  <span className="produce-market-strike">
                    {item.marketPrice}
                  </span>
                </div>

                <div style={{ fontSize: 12, fontWeight: 700, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Tag size={12} />
                  <span>{lang === 'ta' ? item.savingsTa : item.savingsEn}</span>
                </div>
              </div>
            </div>

            <div className="listing-actions-row">
              <button
                className="action-btn-call"
                onClick={() => handleCall(item)}
                aria-label={`Call ${item.farmerNameEn}`}
              >
                <Phone size={18} />
                <span>{t.callFarmer}</span>
              </button>

              <button
                className="action-btn-chat"
                onClick={() => handleChat(item)}
                aria-label={`WhatsApp ${item.farmerNameEn}`}
              >
                <MessageCircle size={18} color="#166534" />
                <span>{t.chatFarmer}</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {calledFarmer && (
        <div 
          style={{
            position: 'fixed',
            bottom: 90,
            left: 20,
            right: 20,
            maxWidth: 390,
            margin: '0 auto',
            background: '#14532d',
            color: '#fff',
            padding: '14px 18px',
            borderRadius: 16,
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            zIndex: 99,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '2px solid #86efac',
            animation: 'slideUp 0.25s ease'
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 800 }}>
              {lang === 'ta' ? 'அழைப்பு தயாராக உள்ளது:' : 'Calling Farmer Directly:'}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#86efac' }}>
              {lang === 'ta' ? calledFarmer.farmerNameTa : calledFarmer.farmerNameEn} (📞 98421-XXXXX)
            </div>
          </div>
          <button
            onClick={() => setCalledFarmer(null)}
            style={{
              background: '#22c55e',
              color: '#052e16',
              border: 'none',
              borderRadius: 8,
              padding: '6px 12px',
              fontSize: 13,
              fontWeight: 800,
              minHeight: 36,
              cursor: 'pointer'
            }}
          >
            {lang === 'ta' ? 'சரி' : 'OK'}
          </button>
        </div>
      )}
    </section>
  );
}
