import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ShieldCheck, LogIn } from 'lucide-react';
import { useT } from '../i18n';
import { ROUTES } from '../router/routes';
import { Navbar, Footer } from '../components/layout';
import { Badge, SectionHeader, Card, Button } from '../components/ui';

export default function HomePage({ onBuyerAuthSuccess: _onBuyerAuthSuccess }) {
  const navigate = useNavigate();
  const { t } = useT('home');

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const navigateToRoleSelect = () => {
    stopSpeaking();
    navigate(ROUTES.ROLE_SELECT);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="website-root">
      {/* 1. EXTRACTED NAVBAR */}
      <Navbar onLoginClick={navigateToRoleSelect} />

      {/* 2. HERO SECTION */}
      <section id="home" className="hero-section">
        <div className="hero-content">
          <div className="hero-badge-strip">
            <Badge
              variant="brand"
              icon={<Sparkles size={16} color="#fde047" />}
              className="hero-badge-pill"
            >
              {t('badgeDirect')}
            </Badge>
          </div>

          <h1 className="hero-tagline">
            {t('tagline')}
          </h1>

          <p className="hero-description">
            {t('heroSubtitle')}
          </p>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="section-how-it-works">
        <div className="site-container">
          <SectionHeader
            title={t('howItWorksTitle')}
            subtitle={t('howItWorksSub')}
            align="center"
          />

          <div className="how-it-works-grid">
            {/* Step 1 */}
            <Card className="how-step-card step-1" padding="lg">
              <div className="step-number-badge">1</div>
              <div className="step-illustration-icon">🌾</div>
              <h3 className="step-title">{t('step1Title')}</h3>
              <p className="step-desc">{t('step1Desc')}</p>
            </Card>

            {/* Step 2 */}
            <Card className="how-step-card step-2" padding="lg">
              <div className="step-number-badge">2</div>
              <div className="step-illustration-icon">📦</div>
              <h3 className="step-title">{t('step2Title')}</h3>
              <p className="step-desc">{t('step2Desc')}</p>
            </Card>

            {/* Step 3 */}
            <Card className="how-step-card step-3" padding="lg">
              <div className="step-number-badge">3</div>
              <div className="step-illustration-icon">🚚</div>
              <h3 className="step-title">{t('step3Title')}</h3>
              <p className="step-desc">{t('step3Desc')}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. TRUST / STATS SECTION */}
      <section className="section-stats">
        <div className="site-container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{t('stat1Num')}</div>
              <div className="stat-label-ta">{t('stat1Label')}</div>
              <div className="stat-label-en">{t('stat1Sub')}</div>
            </div>

            <div className="stat-item">
              <div className="stat-number">{t('stat2Num')}</div>
              <div className="stat-label-ta">{t('stat2Label')}</div>
              <div className="stat-label-en">{t('stat2Sub')}</div>
            </div>

            <div className="stat-item">
              <div className="stat-number">{t('stat3Num')}</div>
              <div className="stat-label-ta">{t('stat3Label')}</div>
              <div className="stat-label-en">{t('stat3Sub')}</div>
            </div>

            <div className="stat-item">
              <div className="stat-number">{t('stat4Num')}</div>
              <div className="stat-label-ta">{t('stat4Label')}</div>
              <div className="stat-label-en">{t('stat4Sub')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ABOUT US SECTION */}
      <section id="about" style={{ padding: '70px 20px', background: '#fafcfb', borderBottom: '1px solid #e2e8f0' }}>
        <div className="site-container" style={{ maxWidth: 880, textAlign: 'center' }}>
          <SectionHeader
            badge={t('aboutBadge')}
            badgeIcon={<ShieldCheck size={18} />}
            title={t('aboutTitle')}
            subtitle={t('aboutText')}
            align="center"
          />
        </div>
      </section>

      {/* 6. EXTRACTED FOOTER */}
      <Footer />

      {/* Mobile Floating Action Button (FAB) for Login */}
      <Button
        type="button"
        variant="primary"
        className="mobile-floating-login-fab"
        onClick={navigateToRoleSelect}
        aria-label="Login / Choose Role"
      >
        <div className="mobile-fab-icon-wrap">
          <LogIn size={18} />
        </div>
        <span className="mobile-fab-label">{t('mobileLogin')}</span>
      </Button>
    </div>
  );
}
