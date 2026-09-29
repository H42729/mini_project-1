import React, { useState } from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Volume2, VolumeX, ChevronRight } from 'lucide-react';
import { mockMarketPrices } from '../data/mockData';
import { translations } from '../data/translations';
import { speechController } from '../utils/speechHelper';

export default function MarketTicker({ lang, onNavigateToPrices }) {
  const [isSpeakingPrices, setIsSpeakingPrices] = useState(false);
  const t = translations[lang];
  const prices = mockMarketPrices;

  const handleSpeakPrices = () => {
    const text = lang === 'ta'
      ? `இன்றைய முக்கிய மண்டி விலைகள்: நெல் ஒரு மூட்டை 2,350 ரூபாய், நாட்டு தக்காளி ஒரு கிலோ 34 ரூபாய், சின்ன வெங்காயம் ஒரு கிலோ 68 ரூபாய், பொள்ளாச்சி தேங்காய் ஒரு எண் 28 ரூபாய்.`
      : `Today's key market prices: Paddy 2,350 rupees per bag, country tomato 34 rupees per kg, shallots 68 rupees per kg, Pollachi coconut 28 rupees each.`;

    if (isSpeakingPrices) {
      speechController.stop();
      setIsSpeakingPrices(false);
    } else {
      setIsSpeakingPrices(true);
      speechController.speak(text, lang, 'ticker-audio', () => {
        setIsSpeakingPrices(false);
      });
    }
  };

  return (
    <section className="ticker-section" aria-label="Today's Market Prices">
      <div className="ticker-header-padding">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h2 className="section-title" style={{ fontSize: 18 }}>
            <TrendingUp size={20} color="#15803d" />
            {t.marketTickerTitle}
          </h2>
          <button
            className={`card-audio-pill ${isSpeakingPrices ? 'speaking' : ''}`}
            onClick={handleSpeakPrices}
            style={{ width: 34, height: 34, minHeight: 34, minWidth: 34 }}
            title={lang === 'ta' ? 'விலைகளை கேட்க' : 'Listen to rates'}
            aria-label="Listen to market rates"
          >
            {isSpeakingPrices ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>

        <button
          onClick={onNavigateToPrices}
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
          <span>{t.viewAllPrices}</span>
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="ticker-scroll-track">
        {prices.map((item) => (
          <div
            key={item.id}
            className="ticker-item-card"
            onClick={onNavigateToPrices}
            role="button"
            tabIndex={0}
          >
            <div>
              <div className="ticker-crop-info">
                <div className="crop-emoji-box">
                  {item.emoji}
                </div>
                <div>
                  <div className="ticker-crop-name-ta">
                    {lang === 'ta' ? item.nameTa : item.nameEn}
                  </div>
                  <div className="ticker-crop-name-en" style={{ fontSize: 11 }}>
                    {lang === 'ta' ? item.mandiTa : item.mandiEn}
                  </div>
                </div>
              </div>
            </div>

            <div className="ticker-price-row">
              <div>
                <span className="ticker-price-num">{item.price}</span>
                <span className="ticker-price-unit">{lang === 'ta' ? item.unitTa : item.unitEn}</span>
              </div>

              <span className={`ticker-change-badge ${item.isUp ? 'positive' : 'negative'}`}>
                {item.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
