// What this file does: Role selection portal for choosing between Farmer, Buyer, or Driver flows.

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useT } from '../hooks/useT';
import { ROUTES } from '../routes';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import './RoleSelectPage.css';

export default function RoleSelectPage({
  onBack,
  onSelectFarmer,
  onSelectBuyer,
  onSelectDriver
}) {
  const navigate = useNavigate();
  const { t, toggleLang } = useT('roleSelect');

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(ROUTES.HOME);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBuyerClick = () => {
    if (onSelectBuyer) {
      onSelectBuyer();
    } else {
      let hasProfile = false;
      try {
        hasProfile = Boolean(localStorage.getItem('buyer_current_profile'));
      } catch {
        hasProfile = false;
      }

      if (hasProfile) {
        try {
          sessionStorage.removeItem('buyer_explicit_signout');
        } catch {
          // ignore storage error
        }
        navigate(ROUTES.BUYER_DASHBOARD);
      } else {
        navigate(ROUTES.BUYER_LOGIN);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFarmerClick = () => {
    if (onSelectFarmer) {
      onSelectFarmer();
    } else {
      navigate(`${ROUTES.COMING_SOON}?role=farmer`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDriverClick = () => {
    if (onSelectDriver) {
      onSelectDriver();
    } else {
      navigate(`${ROUTES.COMING_SOON}?role=driver`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="role-select-root">
      {/* Top Header */}
      <header className="role-select-topbar">
        <div
          className="role-select-brand"
          onClick={handleBack}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleBack();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Back to home"
        >
          <img src="/logo.png" alt="Naam Uzhavar" className="role-select-logo-img" />
          <div className="role-select-brand-text">
            <span className="role-select-brand-name">
              {t('common.appName')}
            </span>
            <span className="role-select-brand-sub">
              {t('common.appSubtitle')}
            </span>
          </div>
        </div>

        <div className="role-select-topbar-actions">
          <button
            type="button"
            className="role-select-lang-btn"
            onClick={toggleLang}
            aria-label="Toggle Language"
            title="Toggle English / தமிழ்"
          >
            <span>{t('common.switchLangText')}</span>
          </button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="role-select-back-btn"
            onClick={handleBack}
            leftIcon={<ArrowLeft size={16} />}
            aria-label="Back to Home"
          >
            <span className="role-back-home-text">{t('common.navHome')}</span>
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <main className="role-select-container">
        {/* Header Heading */}
        <div className="role-select-header-box">
          <Badge
            variant="brand"
            icon={<Sparkles size={14} />}
            className="role-select-badge"
          >
            {t('directPlatformBadge')}
          </Badge>

          <h1 className="role-select-title">
            {t('title')}
          </h1>

          <p className="role-select-sub">
            {t('subtitle')}
          </p>
        </div>

        {/* Three Role Login Cards */}
        <div className="role-select-cards-grid">
          {/* Card 1: Farmer */}
          <Card
            className="role-select-card farmer-theme"
            onClick={handleFarmerClick}
            variant="interactive"
            padding="none"
          >
            <div className="role-card-top-row">
              <div className="role-card-icon-bubble">🌾</div>
              <Badge variant="grade-a" className="role-card-tag">
                {t('farmerTag')}
              </Badge>
            </div>

            <h2 className="role-card-heading">
              {t('farmerHeading')}
            </h2>
            <span className="role-card-action-sub">
              {t('farmerSub')}
            </span>

            <p className="role-card-desc">
              {t('farmerDesc')}
            </p>

            <Button
              type="button"
              variant="primary"
              className="role-card-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleFarmerClick();
              }}
            >
              <span>{t('farmerBtn')}</span>
            </Button>
          </Card>

          {/* Card 2: Buyer */}
          <Card
            className="role-select-card buyer-theme"
            onClick={handleBuyerClick}
            variant="interactive"
            padding="none"
          >
            <div className="role-card-top-row">
              <div className="role-card-icon-bubble">🧺</div>
              <Badge variant="grade-a" className="role-card-tag">
                {t('buyerTag')}
              </Badge>
            </div>

            <h2 className="role-card-heading">
              {t('buyerHeading')}
            </h2>
            <span className="role-card-action-sub">
              {t('buyerSub')}
            </span>

            <p className="role-card-desc">
              {t('buyerDesc')}
            </p>

            <Button
              type="button"
              variant="primary"
              className="role-card-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleBuyerClick();
              }}
            >
              <span>{t('buyerBtn')}</span>
            </Button>
          </Card>

          {/* Card 3: Driver */}
          <Card
            className="role-select-card driver-theme"
            onClick={handleDriverClick}
            variant="interactive"
            padding="none"
          >
            <div className="role-card-top-row">
              <div className="role-card-icon-bubble">🚚</div>
              <Badge variant="warning" className="role-card-tag">
                {t('driverTag')}
              </Badge>
            </div>

            <h2 className="role-card-heading">
              {t('driverHeading')}
            </h2>
            <span className="role-card-action-sub">
              {t('driverSub')}
            </span>

            <p className="role-card-desc">
              {t('driverDesc')}
            </p>

            <Button
              type="button"
              variant="harvest"
              className="role-card-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleDriverClick();
              }}
            >
              <span>{t('driverBtn')}</span>
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
}
