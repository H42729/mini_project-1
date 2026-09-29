import React, { useState } from 'react';
import { Sprout, TrendingUp, ShoppingBasket, Landmark, Volume2, VolumeX } from 'lucide-react';
import { translations } from '../data/translations';
import { speechController } from '../utils/speechHelper';

export default function QuickActionsGrid({ lang, onNavigate }) {
  const [speakingAction, setSpeakingAction] = useState(null);
  const t = translations[lang];

  const actions = [
    {
      id: 'sell',
      titleTa: t.actionSellTitle,
      titleEn: t.actionSellTitle,
      subTa: t.actionSellSub,
      subEn: t.actionSellSub,
      cardClass: 'action-sell',
      icon: <Sprout size={30} strokeWidth={2.5} />,
      audioTa: 'பயிர் விற்பனை. இடைத்தரகர் இன்றி உங்கள் அறுவடை பயிரை நேரடியாக நுகர்வோருக்கு விற்க இங்கே தொடவும்.',
      audioEn: 'Sell My Crop. Sell your fresh harvest produce directly to buyers without middlemen.'
    },
    {
      id: 'prices',
      titleTa: t.actionPricesTitle,
      titleEn: t.actionPricesTitle,
      subTa: t.actionPricesSub,
      subEn: t.actionPricesSub,
      cardClass: 'action-price',
      icon: <TrendingUp size={30} strokeWidth={2.5} />,
      audioTa: 'சந்தை விலை நிலவரம். இன்றைய தமிழக உழவர் சந்தை மற்றும் மண்டி விலைகளை அறிய இங்கே தொடவும்.',
      audioEn: 'Check Mandi Prices. See daily updated wholesale and retail market rates across Tamil Nadu.'
    },
    {
      id: 'buy',
      titleTa: t.actionBuyTitle,
      titleEn: t.actionBuyTitle,
      subTa: t.actionBuySub,
      subEn: t.actionBuySub,
      cardClass: 'action-buy',
      icon: <ShoppingBasket size={30} strokeWidth={2.5} />,
      audioTa: 'புதிய விளைபொருள் வாங்கு. விவசாயிகளிடம் இருந்து நேரடியாக காய்கறி, பழங்கள் மற்றும் நெல் வாங்குங்கள்.',
      audioEn: 'Buy Fresh Produce. Purchase directly from verified local farmers at wholesale rates.'
    },
    {
      id: 'schemes',
      titleTa: t.actionSchemesTitle,
      titleEn: t.actionSchemesTitle,
      subTa: t.actionSchemesSub,
      subEn: t.actionSchemesSub,
      cardClass: 'action-schemes',
      icon: <Landmark size={30} strokeWidth={2.5} />,
      audioTa: 'அரசு நலத்திட்டங்கள். சூரியசக்தி பம்ப் மானியம், பி.எம் கிசான் மற்றும் பயிர் காப்பீடு விவரங்கள் அறிய இங்கே தொடவும்.',
      audioEn: 'Government Schemes. Access subsidies, crop insurance and financial assistance.'
    }
  ];

  const handleSpeakCard = (e, act) => {
    e.stopPropagation();
    const audioText = lang === 'ta' ? act.audioTa : act.audioEn;

    if (speakingAction === act.id) {
      speechController.stop();
      setSpeakingAction(null);
    } else {
      setSpeakingAction(act.id);
      speechController.speak(audioText, lang, `action-${act.id}`, () => {
        setSpeakingAction(null);
      });
    }
  };

  return (
    <section className="section-wrapper" aria-label="Quick Actions">
      <div className="section-header-row">
        <h2 className="section-title">
          {t.quickActionsTitle}
        </h2>
        <span className="section-subtext">
          {lang === 'ta' ? 'பெரிய பொத்தான்களை தொடவும்' : 'Tap to open'}
        </span>
      </div>

      <div className="quick-actions-grid">
        {actions.map((act) => (
          <div
            key={act.id}
            className={`quick-action-card ${act.cardClass}`}
            onClick={() => onNavigate(act.id)}
            role="button"
            tabIndex={0}
            aria-label={`${act.titleTa} - ${act.subTa}`}
          >
            <div className="card-top-icon-bar">
              <div className="card-icon-bubble">
                {act.icon}
              </div>

              <button
                className={`card-audio-pill ${speakingAction === act.id ? 'speaking' : ''}`}
                onClick={(e) => handleSpeakCard(e, act)}
                title={lang === 'ta' ? 'கேட்க தொடவும்' : 'Tap to listen'}
                aria-label={`Listen to ${act.titleTa}`}
              >
                {speakingAction === act.id ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>

            <div>
              <div className="card-title-ta">
                {lang === 'ta' ? act.titleTa : act.titleEn}
              </div>
              <div className="card-title-en">
                {lang === 'ta' ? act.subTa : act.subEn}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
