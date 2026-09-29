import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Volume2, VolumeX, ArrowRight, ShieldCheck } from 'lucide-react';
import { mockSchemesCarousel } from '../data/mockData';
import { speechController } from '../utils/speechHelper';

export default function HeroCarousel({ lang, onSelectScheme }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [speakingSchemeId, setSpeakingSchemeId] = useState(null);

  const items = mockSchemesCarousel;

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, items.length]);

  const currentItem = items[currentIndex];

  const handleSpeak = (e, item) => {
    e.stopPropagation();
    const audioText = lang === 'ta' ? item.audioTa : item.audioEn;

    if (speakingSchemeId === item.id) {
      speechController.stop();
      setSpeakingSchemeId(null);
    } else {
      setSpeakingSchemeId(item.id);
      speechController.speak(audioText, lang, `scheme-${item.id}`, () => {
        setSpeakingSchemeId(null);
      });
    }
  };

  const handleNext = () => {
    speechController.stop();
    setSpeakingSchemeId(null);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    speechController.stop();
    setSpeakingSchemeId(null);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <section 
      className="hero-carousel-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Government Schemes & Harvest Offers"
    >
      <div className={`carousel-card ${currentItem.theme}`}>
        <div className="carousel-tag-row">
          <span className="scheme-badge">
            <ShieldCheck size={16} />
            {lang === 'ta' ? currentItem.badgeTa : currentItem.badgeEn}
          </span>
          <button
            className={`card-audio-pill ${speakingSchemeId === currentItem.id ? 'speaking' : ''}`}
            onClick={(e) => handleSpeak(e, currentItem)}
            style={{
              background: speakingSchemeId === currentItem.id ? '#f59e0b' : 'rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.4)'
            }}
            title={lang === 'ta' ? 'திட்ட விவரத்தை கேள்' : 'Listen to scheme details'}
            aria-label="Listen to scheme details"
          >
            {speakingSchemeId === currentItem.id ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>

        <div>
          <h2 className="carousel-title-ta">
            {lang === 'ta' ? currentItem.titleTa : currentItem.titleEn}
          </h2>
          <p className="carousel-desc">
            {lang === 'ta' ? currentItem.descTa : currentItem.descEn}
          </p>
        </div>

        <div className="carousel-bottom-row">
          <button 
            className="carousel-action-btn"
            onClick={() => onSelectScheme(currentItem)}
          >
            <span>{lang === 'ta' ? currentItem.actionTa : currentItem.actionEn}</span>
            <ArrowRight size={18} />
          </button>

          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={handlePrev}
              style={{
                width: 38,
                height: 38,
                minHeight: 38,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Previous"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              style={{
                width: 38,
                height: 38,
                minHeight: 38,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Next"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="carousel-dots">
        {items.map((it, idx) => (
          <button
            key={it.id}
            className={`carousel-dot ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => {
              speechController.stop();
              setSpeakingSchemeId(null);
              setCurrentIndex(idx);
            }}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
