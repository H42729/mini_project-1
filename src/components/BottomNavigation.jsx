import React from 'react';
import { Home, PlusCircle, ShoppingBag, BarChart3, User, Sprout } from 'lucide-react';
import { translations } from '../data/translations';

export default function BottomNavigation({ currentTab, setCurrentTab, lang }) {
  const t = translations[lang];

  const navItems = [
    {
      id: 'home',
      labelTa: t.navHome,
      labelEn: t.navHome,
      icon: <Home size={22} strokeWidth={currentTab === 'home' ? 2.5 : 2} />
    },
    {
      id: 'prices',
      labelTa: t.navPrices,
      labelEn: t.navPrices,
      icon: <BarChart3 size={22} strokeWidth={currentTab === 'prices' ? 2.5 : 2} />
    },
    {
      id: 'sell',
      labelTa: t.navSell,
      labelEn: t.navSell,
      isSpecial: true,
      icon: <Sprout size={24} strokeWidth={2.5} />
    },
    {
      id: 'buy',
      labelTa: t.navBuy,
      labelEn: t.navBuy,
      icon: <ShoppingBag size={22} strokeWidth={currentTab === 'buy' ? 2.5 : 2} />
    },
    {
      id: 'profile',
      labelTa: t.navProfile,
      labelEn: t.navProfile,
      icon: <User size={22} strokeWidth={currentTab === 'profile' ? 2.5 : 2} />
    }
  ];

  return (
    <nav className="bottom-nav-bar" aria-label="Bottom Navigation">
      {navItems.map((item) => {
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            className={`nav-tab-btn ${item.isSpecial ? 'nav-tab-sell' : ''} ${isActive ? 'active' : ''}`}
            onClick={() => setCurrentTab(item.id)}
            aria-label={lang === 'ta' ? item.labelTa : item.labelEn}
            aria-selected={isActive}
          >
            <div className="nav-icon-container">
              {item.icon}
            </div>
            <span className="nav-tab-label">
              {lang === 'ta' ? item.labelTa : item.labelEn}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
