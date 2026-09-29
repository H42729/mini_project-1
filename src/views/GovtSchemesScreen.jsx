import React, { useState } from 'react';
import { ArrowLeft, Landmark, Phone, Volume2, VolumeX, ShieldCheck, CheckCircle2, ExternalLink } from 'lucide-react';
import { mockGovtSchemes } from '../data/mockData';
import { speechController } from '../utils/speechHelper';

export default function GovtSchemesScreen({ lang, onBack }) {
  const [speakingId, setSpeakingId] = useState(null);
  const [appliedScheme, setAppliedScheme] = useState(null);

  const handleSpeakScheme = (scheme) => {
    const text = lang === 'ta'
      ? `${scheme.titleTa}. பயன்: ${scheme.benefitTa}. தகுதி: ${scheme.eligibilityTa}. இலவச உதவி எண்: 1800-180-1551.`
      : `${scheme.titleEn}. Benefit: ${scheme.benefitEn}. Eligibility: ${scheme.eligibilityEn}. Toll-free helpline 1800-180-1551.`;

    if (speakingId === scheme.id) {
      speechController.stop();
      setSpeakingId(null);
    } else {
      setSpeakingId(scheme.id);
      speechController.speak(text, lang, `scheme-detail-${scheme.id}`, () => {
        setSpeakingId(null);
      });
    }
  };

  const handleApply = (scheme) => {
    setAppliedScheme(scheme);
    setTimeout(() => {
      setAppliedScheme(null);
    }, 3500);
  };

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

        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#14532d', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Landmark size={22} color="#1e3a8a" />
          {lang === 'ta' ? 'அரசு நலத்திட்டங்கள்' : 'Government Schemes'}
        </h2>

        <div style={{ width: 44 }} />
      </div>

      {/* Kisan Call Center Helpline Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
          color: '#ffffff',
          borderRadius: 18,
          padding: '14px 16px',
          marginBottom: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 6px 16px rgba(30, 58, 138, 0.25)'
        }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#93c5fd' }}>
            {lang === 'ta' ? 'உழவர் இலவச உதவி எண்' : 'Kisan Toll-Free Helpline'}
          </div>
          <div style={{ fontSize: 18, fontWeight: 800 }}>1800-180-1551</div>
          <div style={{ fontSize: 12, color: '#e0e7ff' }}>
            {lang === 'ta' ? 'தமிழ் மொழியில் 24 மணி நேரமும் பேசலாம்' : 'Free Tamil support 24/7'}
          </div>
        </div>

        <a
          href="tel:18001801551"
          style={{
            background: '#ffffff',
            color: '#1e3a8a',
            padding: '10px 14px',
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 800,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            minHeight: 44
          }}
        >
          <Phone size={16} />
          <span>{lang === 'ta' ? 'அழைக்க' : 'Call'}</span>
        </a>
      </div>

      {/* Schemes List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {mockGovtSchemes.map((scheme) => (
          <div
            key={scheme.id}
            style={{
              background: '#ffffff',
              borderRadius: 18,
              padding: 16,
              border: '1.5px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#1e3a8a', background: '#eff6ff', padding: '3px 8px', borderRadius: 6 }}>
                  {lang === 'ta' ? scheme.categoryTa : scheme.categoryEn}
                </span>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginTop: 6, lineHeight: 1.25 }}>
                  {lang === 'ta' ? scheme.titleTa : scheme.titleEn}
                </h3>
              </div>

              <button
                className={`card-audio-pill ${speakingId === scheme.id ? 'speaking' : ''}`}
                onClick={() => handleSpeakScheme(scheme)}
                style={{ width: 38, height: 38, minHeight: 38, minWidth: 38, borderRadius: '50%', background: '#f1f5f9' }}
                title="Listen to scheme"
              >
                {speakingId === scheme.id ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>

            {/* Benefit Box */}
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 12px', marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#15803d' }}>
                {lang === 'ta' ? '💰 திட்ட பயன்:' : '💰 Benefit:'}
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#14532d' }}>
                {lang === 'ta' ? scheme.benefitTa : scheme.benefitEn}
              </div>
            </div>

            {/* Eligibility */}
            <div style={{ fontSize: 13, color: '#475569', marginBottom: 14 }}>
              <strong style={{ color: '#0f172a' }}>{lang === 'ta' ? 'தகுதி: ' : 'Eligibility: '}</strong>
              {lang === 'ta' ? scheme.eligibilityTa : scheme.eligibilityEn}
            </div>

            {/* Action Button */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => handleApply(scheme)}
                style={{
                  flex: 1,
                  minHeight: 46,
                  background: '#16a34a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                {lang === 'ta' ? 'உடனே விண்ணப்பிக்க' : 'Apply Online'}
              </button>

              <a
                href={`tel:${scheme.helpline}`}
                style={{
                  minHeight: 46,
                  padding: '0 14px',
                  background: '#f1f5f9',
                  color: '#1e293b',
                  borderRadius: 12,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 14,
                  border: '1px solid #cbd5e1'
                }}
              >
                <Phone size={16} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Applied Feedback */}
      {appliedScheme && (
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
            border: '2px solid #86efac'
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 800, color: '#86efac' }}>
            {lang === 'ta' ? 'விண்ணப்ப பதிவு தொடங்கப்பட்டது!' : 'Application Initiated!'}
          </div>
          <div style={{ fontSize: 13, marginTop: 4 }}>
            {lang === 'ta' ? 'உங்கள் உழவர் ஐடி மூலம் தமிழ்நாடு வேளாண் துறைக்கு அனுப்பப்படுகிறது.' : 'Routing via Tamil Nadu Agri Portal with your Uzhavar ID.'}
          </div>
        </div>
      )}
    </div>
  );
}
