import React, { useState } from 'react';
import { ArrowLeft, Search, Filter, Phone, MessageCircle, MapPin, Tag } from 'lucide-react';
import { mockNearbyListings } from '../data/mockData';

export default function BuyMarketplaceScreen({ lang, onBack }) {
  const [search, setSearch] = useState('');
  const [cropType, setCropType] = useState('all');

  const filtered = mockNearbyListings.filter((it) => {
    const matchesType = cropType === 'all' || it.cropType === cropType;
    const matchesSearch = it.titleTa.toLowerCase().includes(search.toLowerCase()) ||
                          it.titleEn.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div style={{ padding: '16px 18px 90px 18px', background: '#f7faf8', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
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
          {lang === 'ta' ? 'புதிய விளைபொருள் அங்காடி' : 'Direct Produce Market'}
        </h2>

        <div style={{ width: 44 }} />
      </div>

      {/* Search Input */}
      <div style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: 14, border: '2px solid #bbf7d0', padding: '4px 14px', marginBottom: 14 }}>
        <Search size={20} color="#15803d" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={lang === 'ta' ? 'காய்கறி, பழங்கள் தேடுங்கள்...' : 'Search farm produce...'}
          style={{ border: 'none', outline: 'none', padding: '10px', fontSize: 15, width: '100%', minHeight: 44 }}
        />
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10, scrollbarWidth: 'none' }}>
        {[
          { id: 'all', ta: 'அனைத்தும்', en: 'All' },
          { id: 'veg', ta: 'காய்கறிகள்', en: 'Vegetables' },
          { id: 'grains', ta: 'தானியங்கள்', en: 'Grains' },
          { id: 'fruits', ta: 'பழங்கள்', en: 'Fruits' }
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => setCropType(c.id)}
            style={{
              minHeight: 40,
              padding: '6px 16px',
              borderRadius: 20,
              border: cropType === c.id ? '2px solid #16a34a' : '1.5px solid #cbd5e1',
              background: cropType === c.id ? '#15803d' : '#ffffff',
              color: cropType === c.id ? '#ffffff' : '#334155',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {lang === 'ta' ? c.ta : c.en}
          </button>
        ))}
      </div>

      {/* Produce Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.map((item) => (
          <div key={item.id} className="farmer-listing-card">
            <div className="listing-farmer-header">
              <div className="farmer-meta">
                <img src={item.farmerAvatar} alt="" className="farmer-avatar" />
                <div>
                  <div className="farmer-name">{lang === 'ta' ? item.farmerNameTa : item.farmerNameEn}</div>
                  <div className="farmer-location-dist">
                    <MapPin size={12} style={{ display: 'inline', marginRight: 3 }} />
                    {lang === 'ta' ? item.locationTa : item.locationEn} • {item.distance}
                  </div>
                </div>
              </div>
            </div>

            <div className="listing-content-grid">
              <div className="produce-img-box">
                <img src={item.image} alt="" className="produce-img" />
                <span className="direct-tag">{lang === 'ta' ? 'நேரடி அறுவடை' : 'Direct Harvest'}</span>
              </div>
              <div className="produce-details">
                <div>
                  <h3 className="produce-title">{lang === 'ta' ? item.titleTa : item.titleEn}</h3>
                  <div className="produce-qty">{lang === 'ta' ? item.quantityTa : item.quantityEn}</div>
                </div>
                <div className="produce-price-row">
                  <span className="produce-price">
                    {item.pricePerUnit}
                    <span style={{ fontSize: 13, color: '#475569' }}>{lang === 'ta' ? item.unitTa : item.unitEn}</span>
                  </span>
                  <span className="produce-market-strike">{item.marketPrice}</span>
                </div>
              </div>
            </div>

            <div className="listing-actions-row">
              <a
                href={`tel:${item.phone}`}
                className="action-btn-call"
                style={{ textDecoration: 'none' }}
              >
                <Phone size={18} />
                <span>{lang === 'ta' ? 'அழைக்க' : 'Call'}</span>
              </a>
              <button
                className="action-btn-chat"
                onClick={() => {
                  const msg = lang === 'ta' ? `வணக்கம், ${item.titleTa} வாங்க விரும்புகிறேன்.` : `Hello, I want to purchase ${item.titleEn}.`;
                  window.open(`https://wa.me/91${item.phone}?text=${encodeURIComponent(msg)}`, '_blank');
                }}
              >
                <MessageCircle size={18} />
                <span>{lang === 'ta' ? 'வாட்ஸ்அப்' : 'WhatsApp'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
