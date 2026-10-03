import React from 'react';
import { useNavigate } from 'react-router-dom';
import BNavbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Globe, LogIn } from 'lucide-react';
import { useT } from '../../i18n';
import { ROUTES } from '../../router/routes';

/**
 * PublicNavbar Component (built with react-bootstrap/Navbar, Container, Nav)
 * Responsive with collapse on mobile viewports.
 */
export default function PublicNavbar({
  showNavLinks = true,
  showAuthButton = true,
  showLangToggle = true,
  onLoginClick,
  className = '',
}) {
  const { t, toggleLang } = useT('common');
  const navigate = useNavigate();

  const handleBrandClick = (e) => {
    e.preventDefault();
    if (window.location.pathname === ROUTES.HOME || window.location.hash.startsWith('#/')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(ROUTES.HOME);
    }
  };

  const handleAuthClick = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      navigate(ROUTES.ROLE_SELECT);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <BNavbar
      expand="lg"
      sticky="top"
      className={`bg-white bg-opacity-95 shadow-sm border-bottom border-light-subtle py-2.5 ${className}`}
      style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
    >
      <Container fluid="xl" className="px-3 px-md-4">
        {/* Brand Logo & Title */}
        <BNavbar.Brand
          href="#home"
          onClick={handleBrandClick}
          className="d-flex align-items-center gap-2 text-decoration-none py-0 me-3"
        >
          <img
            src="/logo.jpg"
            alt="Naam Uzhavar"
            width={44}
            height={44}
            className="rounded-circle border border-2 border-success object-fit-cover shadow-sm flex-shrink-0"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=100&auto=format&fit=crop&q=80';
            }}
          />
          <div className="d-flex flex-column">
            <span className="fw-bolder fs-5 text-dark lh-sm" style={{ letterSpacing: '-0.3px' }}>
              {t('appName')}
            </span>
            <span className="fw-bold text-success" style={{ fontSize: '0.72rem' }}>
              {t('appSubtitle')}
            </span>
          </div>
        </BNavbar.Brand>

        {/* Mobile Toggle Button */}
        {showNavLinks && (
          <BNavbar.Toggle
            aria-controls="public-navbar-nav"
            className="border-0 shadow-none px-2 py-1"
          />
        )}

        {/* Collapsible Nav Links & Actions */}
        <BNavbar.Collapse id="public-navbar-nav">
          {showNavLinks && (
            <Nav className="mx-auto my-2 my-lg-0 gap-lg-2">
              <Nav.Link href="#home" className="fw-semibold px-2.5 py-1.5 text-secondary">
                {t('navHome')}
              </Nav.Link>
              <Nav.Link href="#how-it-works" className="fw-semibold px-2.5 py-1.5 text-secondary">
                {t('navHowItWorks')}
              </Nav.Link>
              <Nav.Link href="#about" className="fw-semibold px-2.5 py-1.5 text-secondary">
                {t('navAbout')}
              </Nav.Link>
              <Nav.Link href="#contact" className="fw-semibold px-2.5 py-1.5 text-secondary">
                {t('navContact')}
              </Nav.Link>
            </Nav>
          )}

          {/* Action Buttons: Language toggle & Role Login */}
          <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2 pt-2 pt-lg-0 ms-lg-auto">
            {showLangToggle && (
              <button
                type="button"
                className="btn btn-outline-success btn-sm d-inline-flex align-items-center justify-content-center gap-1.5 rounded-pill px-3 py-1.5 fw-semibold"
                onClick={toggleLang}
                aria-label="Toggle Language"
              >
                <Globe size={16} />
                <span>{t('switchLangText')}</span>
              </button>
            )}

            {showAuthButton && (
              <button
                type="button"
                className="btn btn-primary btn-sm d-inline-flex align-items-center justify-content-center gap-1.5 rounded-pill px-3.5 py-1.5 fw-semibold shadow-sm"
                onClick={handleAuthClick}
              >
                <LogIn size={15} />
                <span>{t('btnLogin')}</span>
              </button>
            )}
          </div>
        </BNavbar.Collapse>
      </Container>
    </BNavbar>
  );
}

export { PublicNavbar, PublicNavbar as Navbar };
