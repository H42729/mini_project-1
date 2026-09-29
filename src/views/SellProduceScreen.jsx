import React, { useState } from 'react';
import { ArrowLeft, Check, Camera, Volume2, Sparkles, Plus, Minus, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { speechController } from '../utils/speechHelper';

export default function SellProduceScreen({ lang, onBack }) {
  const [step, setStep] = useState(1);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [quantity, setQuantity] = useState(100);
  const [price, setPrice] = useState(35);
  const [unit, setUnit] = useState('kg');
  const [isSuccess, setIsSuccess] = useState(false);

  const crops = [
    { id: 'tomato', nameTa: 'தக்காளி', nameEn: 'Tomato', emoji: '🍅', defaultPrice: 32, unitTa: 'கிலோ', unitEn: 'kg' },
    { id: 'paddy', nameTa: 'நெல்', nameEn: 'Paddy', emoji: '🌾', defaultPrice: 2350, unitTa: 'மூட்டை (75kg)', unitEn: 'Bag' },
    { id: 'onion', nameTa: 'வெங்காயம்', nameEn: 'Shallots', emoji: '🧅', defaultPrice: 65, unitTa: 'கிலோ', unitEn: 'kg' },
    { id: 'coconut', nameTa: 'தேங்காய்', nameEn: 'Coconut', emoji: '🥥', defaultPrice: 28, unitTa: 'எண்', unitEn: 'piece' },
    { id: 'banana', nameTa: 'வாழை', nameEn: 'Banana', emoji: '🍌', defaultPrice: 400, unitTa: 'தார்', unitEn: 'bunch' },
    { id: 'turmeric', nameTa: 'மஞ்சள்', nameEn: 'Turmeric', emoji: '✨', defaultPrice: 14000, unitTa: 'குவிண்டால்', unitEn: 'qtl' },
    { id: 'brinjal', nameTa: 'கத்தரிக்காய்', nameEn: 'Brinjal', emoji: '🍆', defaultPrice: 25, unitTa: 'கிலோ', unitEn: 'kg' },
    { id: 'chilli', nameTa: 'பச்சை மிளகாய்', nameEn: 'Green Chilli', emoji: '🌶️', defaultPrice: 45, unitTa: 'கிலோ', unitEn: 'kg' }
  ];

  const handleSelectCrop = (crop) => {
    setSelectedCrop(crop);
    setPrice(crop.defaultPrice);
    setUnit(lang === 'ta' ? crop.unitTa : crop.unitEn);
    speechController.speak(
      lang === 'ta' ? `${crop.nameTa} தேர்ந்தெடுக்கப்பட்டது. அடுத்த படிக்கு செல்லவும்.` : `${crop.nameEn} selected. Proceed to quantity.`,
      lang,
      'sell-step'
    );
    setStep(2);
  };

  const handleCompletePosting = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    setIsSuccess(true);
    speechController.speak(
      lang === 'ta' ? 'வாழ்த்துகள்! உங்கள் விளைபொருள் வெற்றிகரமாக விற்பனைக்கு பதிவு செய்யப்பட்டது.' : 'Congratulations! Your harvest listing has been posted successfully.',
      lang,
      'success-post'
    );
  };

  const handleSpeakInstructions = () => {
    const text = step === 1
      ? (lang === 'ta' ? 'படி ஒன்று: நீங்கள் விற்க விரும்பும் பயிரின் படத்தை தேர்வு செய்யுங்கள்.' : 'Step 1: Tap the crop you want to sell.')
      : step === 2
      ? (lang === 'ta' ? 'படி இரண்டு: அளவு மற்றும் எதிர்பார்க்கும் விலையை உறுதி செய்யுங்கள்.' : 'Step 2: Confirm quantity and expected rate.')
      : (lang === 'ta' ? 'படி மூன்று: உங்கள் அறுவடை பதிவை உறுதி செய்து வெளியிடவும்.' : 'Step 3: Confirm and publish your harvest.');
    speechController.speak(text, lang, 'sell-instr');
  };

  return (
    <div style={{ padding: '16px 18px 90px 18px', background: '#f7faf8', minHeight: '100%' }}>
      {/* Top Bar */}
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
          {lang === 'ta' ? 'விளைபொருள் விற்பனை' : 'Sell My Produce'}
        </h2>

        <button
          onClick={handleSpeakInstructions}
          style={{
            background: '#dcfce7',
            border: '1.5px solid #86efac',
            borderRadius: '50%',
            width: 44,
            height: 44,
            minHeight: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#15803d'
          }}
          title="Listen instructions"
        >
          <Volume2 size={20} />
        </button>
      </div>

      {/* Progress steps (3 steps) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            style={{
              flex: 1,
              height: 8,
              borderRadius: 4,
              background: step >= s ? '#16a34a' : '#cbd5e1',
              transition: 'background 0.3s'
            }}
          />
        ))}
      </div>

      {/* STEP 1: Select Crop */}
      {step === 1 && (
        <div>
          <div style={{ marginBottom: 14 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
              {lang === 'ta' ? 'விற்க விரும்பும் பயிரை தொடுங்கள்:' : 'Select Crop to Sell:'}
            </h3>
            <p style={{ fontSize: 14, color: '#64748b' }}>
              {lang === 'ta' ? 'படம் உள்ள அட்டையை தேர்வு செய்யவும்' : 'Tap on the crop photo'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {crops.map((c) => (
              <button
                key={c.id}
                onClick={() => handleSelectCrop(c)}
                style={{
                  background: '#ffffff',
                  border: '2px solid #e2e8f0',
                  borderRadius: 16,
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  minHeight: 110,
                  transition: 'transform 0.15s'
                }}
              >
                <span style={{ fontSize: 40 }}>{c.emoji}</span>
                <span style={{ fontSize: 17, fontWeight: 800, color: '#14532d' }}>
                  {lang === 'ta' ? c.nameTa : c.nameEn}
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>
                  ~₹{c.defaultPrice} {lang === 'ta' ? c.unitTa : c.unitEn}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Quantity & Price */}
      {step === 2 && selectedCrop && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f0fdf4', padding: 14, borderRadius: 16, border: '1.5px solid #86efac', marginBottom: 18 }}>
            <span style={{ fontSize: 40 }}>{selectedCrop.emoji}</span>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#14532d' }}>
                {lang === 'ta' ? selectedCrop.nameTa : selectedCrop.nameEn}
              </div>
              <div style={{ fontSize: 13, color: '#15803d', fontWeight: 600 }}>
                {lang === 'ta' ? 'தேர்ந்தெடுக்கப்பட்டது' : 'Selected'}
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div style={{ background: '#ffffff', padding: 16, borderRadius: 16, border: '1.5px solid #e2e8f0', marginBottom: 16 }}>
            <label style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: 8 }}>
              {lang === 'ta' ? 'கையிருப்பு அளவு:' : 'Available Quantity:'}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <button
                onClick={() => setQuantity(Math.max(10, quantity - 50))}
                style={{ width: 50, height: 50, borderRadius: 12, border: '2px solid #cbd5e1', background: '#f8fafc', fontSize: 24, cursor: 'pointer', fontWeight: 'bold' }}
              >
                -
              </button>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#14532d' }}>
                {quantity} <span style={{ fontSize: 16, color: '#64748b' }}>{unit}</span>
              </div>
              <button
                onClick={() => setQuantity(quantity + 50)}
                style={{ width: 50, height: 50, borderRadius: 12, border: '2px solid #cbd5e1', background: '#f8fafc', fontSize: 24, cursor: 'pointer', fontWeight: 'bold' }}
              >
                +
              </button>
            </div>

            {/* Quick Chips */}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              {[100, 250, 500, 1000].map((q) => (
                <button
                  key={q}
                  onClick={() => setQuantity(q)}
                  style={{
                    flex: 1,
                    minHeight: 38,
                    background: quantity === q ? '#16a34a' : '#f1f5f9',
                    color: quantity === q ? '#fff' : '#334155',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  +{q}
                </button>
              ))}
            </div>
          </div>

          {/* Expected Price */}
          <div style={{ background: '#ffffff', padding: 16, borderRadius: 16, border: '1.5px solid #e2e8f0', marginBottom: 20 }}>
            <label style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', display: 'block', marginBottom: 8 }}>
              {lang === 'ta' ? 'எதிர்பார்க்கும் விலை (ரூபாய்):' : 'Expected Rate (₹):'}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <button
                onClick={() => setPrice(Math.max(1, price - 2))}
                style={{ width: 50, height: 50, borderRadius: 12, border: '2px solid #cbd5e1', background: '#f8fafc', fontSize: 24, cursor: 'pointer', fontWeight: 'bold' }}
              >
                -
              </button>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#ea580c' }}>
                ₹{price} <span style={{ fontSize: 15, color: '#64748b' }}>/{unit}</span>
              </div>
              <button
                onClick={() => setPrice(price + 2)}
                style={{ width: 50, height: 50, borderRadius: 12, border: '2px solid #cbd5e1', background: '#f8fafc', fontSize: 24, cursor: 'pointer', fontWeight: 'bold' }}
              >
                +
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setStep(1)}
              style={{ flex: 1, minHeight: 48, background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}
            >
              {lang === 'ta' ? 'முந்தைய படி' : 'Back'}
            </button>
            <button
              onClick={() => setStep(3)}
              style={{ flex: 2, minHeight: 48, background: '#16a34a', color: '#ffffff', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: 'pointer' }}
            >
              {lang === 'ta' ? 'அடுத்த படி ➔' : 'Next Step ➔'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Confirm & Photo */}
      {step === 3 && selectedCrop && !isSuccess && (
        <div>
          <div style={{ background: '#ffffff', borderRadius: 20, padding: 18, border: '2px solid #86efac', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <span style={{ fontSize: 44 }}>{selectedCrop.emoji}</span>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#14532d' }}>
                  {lang === 'ta' ? selectedCrop.nameTa : selectedCrop.nameEn}
                </h3>
                <div style={{ fontSize: 14, color: '#64748b', fontWeight: 600 }}>
                  {quantity} {unit} • ₹{price}/{unit}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, marginBottom: 6 }}>
                <span style={{ color: '#64748b' }}>{lang === 'ta' ? 'மொத்த மதிப்பு:' : 'Total Est. Value:'}</span>
                <span style={{ fontWeight: 800, color: '#14532d' }}>₹{(quantity * price).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#16a34a', fontWeight: 700 }}>
                <span>{lang === 'ta' ? 'இடைத்தரகர் கமிஷன்:' : 'Brokerage Commission:'}</span>
                <span>₹0 (இலவசம் / Free)</span>
              </div>
            </div>

            {/* Farm Photo Add Box */}
            <div
              style={{
                marginTop: 16,
                border: '2px dashed #86efac',
                borderRadius: 14,
                padding: 16,
                textAlign: 'center',
                background: '#f0fdf4',
                cursor: 'pointer'
              }}
            >
              <Camera size={32} color="#16a34a" style={{ margin: '0 auto 6px auto' }} />
              <div style={{ fontSize: 15, fontWeight: 700, color: '#14532d' }}>
                {lang === 'ta' ? 'பண்ணை புகைப்படம் சேர்க்க (விரும்பினால்)' : 'Add Farm Photo (Optional)'}
              </div>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                {lang === 'ta' ? 'கேமரா தட்டவும்' : 'Tap camera'}
              </div>
            </div>
          </div>

          <button
            onClick={handleCompletePosting}
            style={{
              width: '100%',
              minHeight: 52,
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 16,
              fontSize: 18,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              boxShadow: '0 6px 16px rgba(22, 163, 74, 0.35)'
            }}
          >
            <Sparkles size={20} />
            <span>{lang === 'ta' ? 'நேரடியாக விற்பனைக்கு பதிவிடு' : 'Publish My Listing Now'}</span>
          </button>
        </div>
      )}

      {/* Success View */}
      {isSuccess && (
        <div style={{ textAlign: 'center', padding: '30px 10px' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
            <CheckCircle size={54} />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#14532d', marginBottom: 8 }}>
            {lang === 'ta' ? 'வெற்றிகரமாக வெளியிடப்பட்டது!' : 'Listing Published!'}
          </h2>
          <p style={{ fontSize: 15, color: '#475569', marginBottom: 24, lineHeight: 1.4 }}>
            {lang === 'ta'
              ? 'உங்கள் விளைபொருள் தகவல் மதுரை மற்றும் அருகிலுள்ள நுகர்வோருக்கு உடனே தெரியப்படுத்தப்பட்டது. வாங்குவோர் உங்களை நேரடியாக அழைப்பார்கள்.'
              : 'Your produce is now visible to verified buyers in your area. Buyers will call you directly with no commission.'}
          </p>
          <button
            onClick={onBack}
            style={{
              minHeight: 48,
              padding: '8px 24px',
              background: '#16a34a',
              color: '#ffffff',
              border: 'none',
              borderRadius: 14,
              fontSize: 16,
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {lang === 'ta' ? 'முகப்புக்கு செல்க' : 'Go to Home'}
          </button>
        </div>
      )}
    </div>
  );
}
