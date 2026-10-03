import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import {
  Sprout,
  ShoppingBag,
  Truck,
  PackageCheck,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronRight,
  X,
  Bell,
  User,
  Building2,
  Info,
  MessageSquare,
  HelpCircle,
  Menu,
  LogOut,
  Edit3
} from 'lucide-react';
import './BuyerDashboardLayout.css';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { ROUTES } from '../../../router/routes';
import { Button, Modal } from '../../../components/ui';
import { BuyerProvider, useBuyer } from '../context/BuyerContext';
import CropModals from '../components/CropModals';
import EditProfileModal from '../components/EditProfileModal';

/**
 * BuyerDashboardLayout Component
 * Serves as the primary layout shell for the commercial buyer dashboard:
 * - Header (Brand, Language switcher, Notifications, Profile dropdown)
 * - Collapsible desktop sidebar & mobile drawer (NavLink navigation)
 * - Main viewport hosting child route components via <Outlet />
 * - Mobile bottom nav bar
 * - Shared Modals (Sign Out confirmation, Edit Profile, Crop procurement)
 */
function BuyerDashboardContent() {
  const location = useLocation();
  const mainViewportRef = useRef(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const buyer = useBuyer();
  const {
    profile,
    filteredCrops,
    orders,
    toastMessage,
    setToastMessage,
    signOutModalOpen,
    setSignOutModalOpen,
    handleSignOut,
    editProfileOpen,
    setEditProfileOpen,
    editFormData,
    setEditFormData,
    handleOpenEditProfile,
    handleSaveProfile,
    declineModalCrop,
    setDeclineModalCrop,
    handleConfirmDecline,
    acceptModalCrop,
    setAcceptModalCrop,
    acceptedQuantity,
    setAcceptedQuantity,
    handleProceedToFarmer,
    farmerDetailsCrop,
    setFarmerDetailsCrop,
    handleConfirmOrder,
    orderConfirmationData,
    setOrderConfirmationData,
    handleGoToTracking,
    lang,
    toggleLang,
    t
  } = buyer;

  // Auto-scroll viewport to top on route change
  useEffect(() => {
    if (mainViewportRef.current) {
      mainViewportRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="buyer-dashboard-root">
      {/* ====================================================================
          1. TOP NAVIGATION BAR (Header)
          ==================================================================== */}
      <header className="buyer-topbar">
        <div className="buyer-topbar-left">
          {/* Mobile hamburger menu button */}
          <button
            type="button"
            className="buyer-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo Brand Lockup */}
          <Link
            to={ROUTES.BUYER_DASHBOARD}
            className="buyer-brand-badge"
            style={{ textDecoration: 'none' }}
          >
            <img src="/logo.jpg" alt="Naam Uzhavar" className="buyer-brand-logo-img" />
            <div className="buyer-brand-titles">
              <span className="buyer-brand-title">{t('brandName')}</span>
              <span className="buyer-hub-pill">{t('hubBadge')}</span>
            </div>
          </Link>
        </div>

        {/* Topbar Right Actions */}
        <div className="buyer-topbar-right">
          {/* Language Switcher */}
          <button
            type="button"
            className="buyer-lang-btn"
            onClick={toggleLang}
            title="Toggle English / தமிழ்"
          >
            {t('common.switchLangText')}
          </button>

          {/* Notifications Bell */}
          <div className="buyer-topbar-dropdown-wrap buyer-topbar-notif-wrap">
            <button
              type="button"
              className="buyer-icon-circle-btn"
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileDropdownOpen(false);
              }}
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="buyer-bell-dot">4</span>
            </button>

            {notificationsOpen && (
              <div className="buyer-dropdown-menu buyer-notif-dropdown">
                <div className="buyer-dropdown-header">
                  <span className="buyer-dropdown-title">
                    {t('notifications')}
                  </span>
                  <span className="buyer-dropdown-count">{t('newNotifications', { n: 4 })}</span>
                </div>
                <div className="buyer-notif-list">
                  <div className="buyer-notif-item unread">
                    <div className="buyer-notif-icon green">
                      <Truck size={14} />
                    </div>
                    <div className="buyer-notif-content">
                      <p className="buyer-notif-text">{t('notifTataAce')}</p>
                      <span className="buyer-notif-time">{t('notifTataAceTime')}</span>
                    </div>
                  </div>
                  <div className="buyer-notif-item unread">
                    <div className="buyer-notif-icon green">
                      <CheckCircle2 size={14} />
                    </div>
                    <div className="buyer-notif-content">
                      <p className="buyer-notif-text">{t('notifFarmer')}</p>
                      <span className="buyer-notif-time">{t('notifFarmerTime')}</span>
                    </div>
                  </div>
                  <div className="buyer-notif-item">
                    <div className="buyer-notif-icon blue">
                      <Clock size={14} />
                    </div>
                    <div className="buyer-notif-content">
                      <p className="buyer-notif-text">{t('notifOrderArrival')}</p>
                      <span className="buyer-notif-time">{t('notifOrderArrivalTime')}</span>
                    </div>
                  </div>
                  <div className="buyer-notif-item">
                    <div className="buyer-notif-icon gray">
                      <PackageCheck size={14} />
                    </div>
                    <div className="buyer-notif-content">
                      <p className="buyer-notif-text">{t('notifOrderDelivered')}</p>
                      <span className="buyer-notif-time">{t('notifOrderDeliveredTime')}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Buyer Profile Pill with Dropdown */}
          <div className="buyer-topbar-dropdown-wrap buyer-topbar-profile-wrap">
            <button
              type="button"
              className="buyer-profile-chip-btn"
              onClick={() => {
                setProfileDropdownOpen(!profileDropdownOpen);
                setNotificationsOpen(false);
              }}
              aria-label="Buyer profile menu"
            >
              <div className="buyer-avatar-badge has-photo">
                {profile.photo || profile.photoPreview ? (
                  <img
                    src={profile.photo || profile.photoPreview}
                    alt={profile.shopName || profile.name}
                    className="buyer-avatar-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <Building2 size={16} />
                )}
              </div>
              <div className="buyer-profile-info-text">
                <span className="buyer-name-truncate">{profile.shopName || profile.name}</span>
                <span className="buyer-role-subtext">{profile.contactPerson || profile.phone}</span>
              </div>
              <ChevronDown size={14} className="buyer-dropdown-caret" />
            </button>

            {profileDropdownOpen && (
              <div className="buyer-dropdown-menu buyer-profile-dropdown">
                <div className="buyer-profile-card-header">
                  <div className="buyer-profile-card-icon has-photo">
                    {profile.photo || profile.photoPreview ? (
                      <img
                        src={profile.photo || profile.photoPreview}
                        alt={profile.name}
                        className="buyer-profile-dropdown-img"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <Building2 size={24} />
                    )}
                  </div>
                  <div className="buyer-profile-header-info">
                    <h4 className="buyer-card-title">{profile.shopName || profile.name}</h4>
                    <p className="buyer-card-sub">👤 {profile.contactPerson || profile.name}</p>
                    <p className="buyer-card-sub font-mono">📞 {profile.phone}</p>
                    <p className="buyer-card-sub">✉️ {profile.email}</p>
                    <span className="buyer-gstin-tag">GSTIN: {profile.gstin}</span>
                  </div>
                </div>
                <div className="buyer-dropdown-divider" />
                <NavLink
                  to={ROUTES.BUYER_DASHBOARD_PROFILE}
                  className="buyer-dropdown-item"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <User size={15} />
                  <span>{t('viewBusinessProfile')}</span>
                </NavLink>
                <button
                  type="button"
                  className="buyer-dropdown-item"
                  onClick={() => {
                    handleOpenEditProfile();
                    setProfileDropdownOpen(false);
                  }}
                >
                  <Edit3 size={15} />
                  <span>{t('editDetailsPhoto')}</span>
                </button>
                <NavLink
                  to={ROUTES.BUYER_DASHBOARD_ORDERS}
                  className="buyer-dropdown-item"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <PackageCheck size={15} />
                  <span>{t('allPastOrders')}</span>
                </NavLink>
                <div className="buyer-dropdown-divider" />
                <button
                  type="button"
                  className="buyer-dropdown-item logout"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    setSignOutModalOpen(true);
                  }}
                >
                  <LogOut size={15} />
                  <span>{t('signOut')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ====================================================================
          2. DASHBOARD BODY: SIDEBAR + MAIN CONTENT AREA
          ==================================================================== */}
      <div className="buyer-dashboard-body">
        {/* MOBILE DRAWER VIA BOOTSTRAP OFFCANVAS */}
        <Offcanvas
          show={mobileMenuOpen}
          onHide={() => setMobileMenuOpen(false)}
          placement="start"
          className="buyer-mobile-offcanvas text-white"
          style={{ maxWidth: 280, backgroundColor: '#052e16' }}
        >
          <Offcanvas.Header closeButton closeVariant="white" className="border-bottom border-success border-opacity-25 pb-3">
            <Offcanvas.Title>
              <Link
                to={ROUTES.BUYER_DASHBOARD}
                className="d-flex align-items-center gap-2 text-decoration-none"
                onClick={() => setMobileMenuOpen(false)}
              >
                <img src="/logo.jpg" alt="Naam Uzhavar" width={36} height={36} className="rounded-circle border border-success" />
                <div className="d-flex flex-column">
                  <span className="fw-bold text-white small">{t('brandName')}</span>
                  <span className="badge bg-success-subtle text-success py-0.5 px-2 rounded-pill" style={{ fontSize: '0.65rem' }}>{t('hubBadge')}</span>
                </div>
              </Link>
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="d-flex flex-column justify-content-between p-3">
            <div className="d-flex flex-column gap-1">
              <NavLink
                to={ROUTES.BUYER_DASHBOARD}
                end
                className={({ isActive }) => `buyer-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Sprout size={19} />
                <span className="buyer-nav-label">{t('navHome')}</span>
              </NavLink>

              <NavLink
                to={ROUTES.BUYER_DASHBOARD_CROPS}
                className={({ isActive }) => `buyer-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingBag size={19} />
                <span className="buyer-nav-label">{t('navCrops')}</span>
                <span className="buyer-nav-badge">{filteredCrops.length}</span>
              </NavLink>

              <NavLink
                to={ROUTES.BUYER_DASHBOARD_ORDERS}
                className={({ isActive }) => `buyer-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <PackageCheck size={19} />
                <span className="buyer-nav-label">{t('navOrders')}</span>
                <span className="buyer-nav-badge neutral">{orders.length}</span>
              </NavLink>

              <NavLink
                to={ROUTES.BUYER_DASHBOARD_TRACK}
                className={({ isActive }) => `buyer-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Truck size={19} />
                <span className="buyer-nav-label">{t('navTrack')}</span>
                <span className="buyer-nav-dot-pulse" title="1 Active Delivery" />
              </NavLink>

              <NavLink
                to={ROUTES.BUYER_DASHBOARD_MESSAGES}
                className={({ isActive }) => `buyer-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <MessageSquare size={19} />
                <span className="buyer-nav-label">{t('navMessages')}</span>
                <span className="buyer-nav-badge neutral">2</span>
              </NavLink>

              <NavLink
                to={ROUTES.BUYER_DASHBOARD_PROFILE}
                className={({ isActive }) => `buyer-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Building2 size={19} />
                <span className="buyer-nav-label">{t('navProfile')}</span>
              </NavLink>
            </div>

            <div className="pt-4 border-top border-success border-opacity-25">
              <div className="d-flex align-items-center gap-2 mb-1 text-white-50 small">
                <HelpCircle size={16} className="text-success" />
                <span>{t('helplineTitle')}: <a href="tel:18001801551" className="text-white text-decoration-none fw-bold">1800-180-1551</a></span>
              </div>
              <div className="text-white-50" style={{ fontSize: '0.72rem' }}>{t('helplineHours')}</div>
            </div>
          </Offcanvas.Body>
        </Offcanvas>

        {/* DESKTOP COLLAPSIBLE SIDEBAR */}
        <aside
          className={`buyer-sidebar ${sidebarCollapsed ? 'collapsed' : ''} d-none d-lg-flex`}
        >

          {/* Primary Navigation Items with NavLink */}
          <div className="buyer-sidebar-nav">
            <NavLink
              to={ROUTES.BUYER_DASHBOARD}
              end
              className={({ isActive }) => `buyer-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Sprout size={19} />
              <span className="buyer-nav-label">{t('navHome')}</span>
            </NavLink>

            <NavLink
              to={ROUTES.BUYER_DASHBOARD_CROPS}
              className={({ isActive }) => `buyer-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <ShoppingBag size={19} />
              <span className="buyer-nav-label">{t('navCrops')}</span>
              <span className="buyer-nav-badge">{filteredCrops.length}</span>
            </NavLink>

            <NavLink
              to={ROUTES.BUYER_DASHBOARD_ORDERS}
              className={({ isActive }) => `buyer-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <PackageCheck size={19} />
              <span className="buyer-nav-label">{t('navOrders')}</span>
              <span className="buyer-nav-badge neutral">{orders.length}</span>
            </NavLink>

            <NavLink
              to={ROUTES.BUYER_DASHBOARD_TRACK}
              className={({ isActive }) => `buyer-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Truck size={19} />
              <span className="buyer-nav-label">{t('navTrack')}</span>
              <span className="buyer-nav-dot-pulse" title="1 Active Delivery" />
            </NavLink>

            <NavLink
              to={ROUTES.BUYER_DASHBOARD_MESSAGES}
              className={({ isActive }) => `buyer-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <MessageSquare size={19} />
              <span className="buyer-nav-label">{t('navMessages')}</span>
              <span className="buyer-nav-badge neutral">2</span>
            </NavLink>

            <NavLink
              to={ROUTES.BUYER_DASHBOARD_PROFILE}
              className={({ isActive }) => `buyer-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Building2 size={19} />
              <span className="buyer-nav-label">{t('navProfile')}</span>
            </NavLink>
          </div>

          {/* Bottom Docked Section: Helpline + Collapse View */}
          <div className="buyer-sidebar-bottom">
            <div className="buyer-sidebar-helpline">
              <div className="buyer-helpline-icon-wrap">
                <HelpCircle size={16} />
              </div>
              <div className="buyer-helpline-text">
                <span className="buyer-helpline-title">{t('helplineTitle')}</span>
                <a href="tel:18001801551" className="buyer-helpline-num">
                  1800-180-1551
                </a>
                <span className="buyer-helpline-sub">
                  {t('helplineHours')}
                </span>
              </div>
            </div>

            <div className="buyer-sidebar-footer">
              <button
                type="button"
                className="buyer-collapse-btn"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <ChevronRight
                  size={16}
                  className={`buyer-collapse-arrow ${sidebarCollapsed ? 'rotate-180' : ''}`}
                />
                {!sidebarCollapsed && (
                  <span>{t('collapseView')}</span>
                )}
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN DASHBOARD CONTENT VIEWPORT: Renders matched child route via <Outlet /> */}
        <main className="buyer-main-viewport" ref={mainViewportRef}>
          <Outlet context={buyer} />
        </main>
      </div>

      {/* ====================================================================
          PRODUCE MODALS: DECLINE, ACCEPT, FARMER DOSSIER, ORDER CONFIRMED
          ==================================================================== */}
      <CropModals
        declineModalCrop={declineModalCrop}
        onDeclineClose={() => setDeclineModalCrop(null)}
        onConfirmDecline={handleConfirmDecline}
        acceptModalCrop={acceptModalCrop}
        acceptedQuantity={acceptedQuantity}
        onQuantityChange={setAcceptedQuantity}
        onAcceptClose={() => setAcceptModalCrop(null)}
        onProceedToFarmer={handleProceedToFarmer}
        farmerDetailsCrop={farmerDetailsCrop}
        onFarmerDetailsClose={() => setFarmerDetailsCrop(null)}
        onConfirmOrder={handleConfirmOrder}
        orderConfirmationData={orderConfirmationData}
        onGoToTracking={handleGoToTracking}
        onBrowseMore={() => {
          setOrderConfirmationData(null);
        }}
        lang={lang}
      />

      {/* ====================================================================
          EDIT BUSINESS PROFILE MODAL
          ==================================================================== */}
      <EditProfileModal
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        editFormData={editFormData}
        setEditFormData={setEditFormData}
        handleSaveProfile={handleSaveProfile}
        lang={lang}
      />

      {/* ====================================================================
          SIGN OUT CONFIRMATION MODAL
          ==================================================================== */}
      <Modal
        isOpen={signOutModalOpen}
        onClose={() => setSignOutModalOpen(false)}
        size="sm"
        title={t('modals.confirmSignOutTitle')}
        description={t('modals.confirmSignOutDesc')}
        footer={
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setSignOutModalOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="button"
              variant="danger"
              leftIcon={<LogOut size={15} />}
              onClick={handleSignOut}
            >
              <span>{t('modals.yesSignOut')}</span>
            </Button>
          </>
        }
      >
        <p
          style={{
            margin: 0,
            fontSize: '0.94rem',
            color: 'var(--buyer-text-main)',
            lineHeight: 1.55
          }}
        >
          {t('modals.confirmSignOutPrompt')}
        </p>
      </Modal>

      {/* ====================================================================
          MOBILE BOTTOM NAVIGATION BAR
          ==================================================================== */}
      <nav className="buyer-mobile-bottom-nav">
        <NavLink
          to={ROUTES.BUYER_DASHBOARD}
          end
          className={({ isActive }) => `buyer-mb-item ${isActive ? 'active' : ''}`}
        >
          <Sprout size={18} />
          <span>{t('bottomNavHome')}</span>
        </NavLink>

        <NavLink
          to={ROUTES.BUYER_DASHBOARD_CROPS}
          className={({ isActive }) => `buyer-mb-item ${isActive ? 'active' : ''}`}
        >
          <ShoppingBag size={18} />
          <span>{t('bottomNavCrops')}</span>
        </NavLink>

        <NavLink
          to={ROUTES.BUYER_DASHBOARD_ORDERS}
          className={({ isActive }) => `buyer-mb-item ${isActive ? 'active' : ''}`}
        >
          <PackageCheck size={18} />
          <span>{t('bottomNavOrders')}</span>
        </NavLink>

        <NavLink
          to={ROUTES.BUYER_DASHBOARD_TRACK}
          className={({ isActive }) => `buyer-mb-item ${isActive ? 'active' : ''}`}
        >
          <Truck size={18} />
          <span>{t('bottomNavTrack')}</span>
          <span className="buyer-mb-dot" />
        </NavLink>

        <NavLink
          to={ROUTES.BUYER_DASHBOARD_MESSAGES}
          className={({ isActive }) => `buyer-mb-item ${isActive ? 'active' : ''}`}
        >
          <MessageSquare size={18} />
          <span>{t('bottomNavChat')}</span>
          <span className="buyer-mb-badge">2</span>
        </NavLink>

        <NavLink
          to={ROUTES.BUYER_DASHBOARD_PROFILE}
          className={({ isActive }) => `buyer-mb-item ${isActive ? 'active' : ''}`}
        >
          <User size={18} />
          <span>{t('bottomNavProfile')}</span>
        </NavLink>
      </nav>

      {/* TOAST NOTIFICATION POPUP */}
      {toastMessage && (
        <div className={`buyer-toast-notification ${toastMessage.type}`}>
          {toastMessage.type === 'success' && <CheckCircle2 size={16} />}
          {toastMessage.type === 'info' && <Info size={16} />}
          <span>{toastMessage.text}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="toast-close"
          >
            <X size={13} />
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Default Export: Wraps BuyerDashboardContent in BuyerProvider
 */
export default function BuyerDashboardLayout() {
  return (
    <BuyerProvider>
      <BuyerDashboardContent />
    </BuyerProvider>
  );
}
