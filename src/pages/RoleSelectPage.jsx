import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, Sparkles, ShieldCheck, Phone, CheckCircle2, Truck } from 'lucide-react';
import { useT } from '../i18n';
import { ROUTES } from '../router/routes';
import { Card, Badge, Button, Input, Modal } from '../components/ui';
import './RoleSelectPage.css';

export default function RoleSelectPage({
  onBack,
  _onSelectFarmer,
  onSelectBuyer,
  _onSelectDriver
}) {
  const navigate = useNavigate();
  const { t, toggleLang } = useT('roleSelect');

  const [activeModal, setActiveModal] = useState(null); // 'farmer' | 'driver'
  const [farmerPhone, setFarmerPhone] = useState('');
  const [driverVehicle, setDriverVehicle] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [modalSuccessMsg, setModalSuccessMsg] = useState('');

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
      navigate(ROUTES.BUYER_LOGIN);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFarmerSubmit = (e) => {
    e.preventDefault();
    setModalSuccessMsg(t('farmerOtpSent'));
    setTimeout(() => {
      setModalSuccessMsg('');
      setActiveModal(null);
    }, 2000);
  };

  const handleDriverSubmit = (e) => {
    e.preventDefault();
    setModalSuccessMsg(t('driverPartnerSent'));
    setTimeout(() => {
      setModalSuccessMsg('');
      setActiveModal(null);
    }, 2000);
  };

  return (
    <div className="role-select-root">
      {/* Top Header */}
      <header className="role-select-topbar">
        <div className="role-select-brand" onClick={handleBack} role="button" tabIndex={0}>
          <img src="/logo.jpg" alt="Naam Uzhavar" className="role-select-logo-img" />
          <div className="role-select-brand-text">
            <span className="role-select-brand-name">
              {t('common.appName')}
            </span>
            <span className="role-select-brand-sub">
              {t('portalSub')}
            </span>
          </div>
        </div>

        <div className="role-select-topbar-actions">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="role-select-lang-btn"
            onClick={toggleLang}
            leftIcon={<Globe size={16} />}
            aria-label="Toggle Language"
          >
            <span>{t('common.switchLangText')}</span>
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="role-select-back-btn"
            onClick={handleBack}
            leftIcon={<ArrowLeft size={16} />}
            aria-label="Back to Home"
          >
            <span>{t('common.navHome')}</span>
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
            onClick={() => setActiveModal('farmer')}
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
                setActiveModal('farmer');
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
            onClick={() => setActiveModal('driver')}
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
                setActiveModal('driver');
              }}
            >
              <span>{t('driverBtn')}</span>
            </Button>
          </Card>
        </div>

        {/* Footer Support Info */}
        <div className="role-select-footer-note">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Phone size={15} color="#16a34a" />
            <span>{t('helpline')} <strong>1800-180-1551</strong></span>
          </span>
          <span>•</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <ShieldCheck size={15} color="#16a34a" />
            <span>{t('verifiedNetwork')}</span>
          </span>
        </div>
      </main>

      {/* Internal Modals for Farmer and Driver */}
      <Modal
        isOpen={!!activeModal}
        onClose={() => setActiveModal(null)}
        size="sm"
      >
        {modalSuccessMsg ? (
          <div style={{ textAlign: 'center', padding: '24px 10px' }}>
            <CheckCircle2 size={54} color="#16a34a" style={{ margin: '0 auto 14px auto' }} />
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#14532d', marginBottom: 8 }}>
              {t('common.success')}
            </h3>
            <p style={{ color: '#475569', fontSize: 14 }}>{modalSuccessMsg}</p>
          </div>
        ) : activeModal === 'farmer' ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>🌾</div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#15803d', margin: '0 0 6px 0' }}>
              {t('farmerPortalTitle')}
            </h3>
            <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 18px 0', lineHeight: 1.4 }}>
              {t('farmerPortalDesc')}
            </p>

            <form onSubmit={handleFarmerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Input
                label={t('farmerMobileLabel')}
                type="tel"
                required
                icon={<Phone size={18} />}
                placeholder={t('farmerMobilePlaceholder')}
                value={farmerPhone}
                onChange={(e) => setFarmerPhone(e.target.value)}
              />

              <div className="d-flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={() => setActiveModal(null)}
                >
                  <span>{t('common.cancel')}</span>
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  style={{ background: '#16a34a', borderColor: '#16a34a' }}
                >
                  <span>{t('farmerSubmitBtn')}</span>
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>🚚</div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#c2410c', margin: '0 0 6px 0' }}>
              {t('driverPortalTitle')}
            </h3>
            <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 18px 0', lineHeight: 1.4 }}>
              {t('driverPortalDesc')}
            </p>

            <form onSubmit={handleDriverSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Input
                label={t('driverVehicleLabel')}
                type="text"
                required
                icon={<Truck size={18} />}
                placeholder={t('driverVehiclePlaceholder')}
                value={driverVehicle}
                onChange={(e) => setDriverVehicle(e.target.value)}
              />

              <Input
                label={t('driverMobileLabel')}
                type="tel"
                required
                icon={<Phone size={18} />}
                placeholder={t('driverMobilePlaceholder')}
                value={driverPhone}
                onChange={(e) => setDriverPhone(e.target.value)}
              />

              <div className="d-flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={() => setActiveModal(null)}
                >
                  <span>{t('common.cancel')}</span>
                </Button>
                <Button
                  type="submit"
                  variant="harvest"
                  fullWidth
                >
                  <span>{t('driverSubmitBtn')}</span>
                </Button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}
