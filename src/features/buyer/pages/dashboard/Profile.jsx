import React from 'react';
import {
  Building2,
  Camera,
  CheckCircle2,
  ShoppingCart,
  Store,
  Check,
  ShieldCheck,
  Edit3,
  LogOut
} from 'lucide-react';
import './Profile.css';
import { useBuyer } from '../../context/BuyerContext';

export default function Profile() {
  const {
    profile,
    photoInputRef,
    handlePhotoUpload,
    handleOpenEditProfile,
    setSignOutModalOpen,
    t
  } = useBuyer();

  return (
    <div className="buyer-view-container animate-fade-in">
      <div className="buyer-view-header">
        <div>
          <h1 className="buyer-view-title">{t('profile.title')}</h1>
          <p className="buyer-view-subtitle">
            {t('profile.subtitle')}
          </p>
        </div>
      </div>

      <div className="buyer-profile-layout">
        {/* Hidden File Input for Direct Photo Update */}
        <input
          type="file"
          ref={photoInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handlePhotoUpload}
        />

        <div className="buyer-profile-box">
          {/* Top Profile Banner with Uploaded Photo & Verification */}
          <div className="buyer-profile-top-banner">
            <div className="buyer-profile-photo-wrapper">
              {profile.photo || profile.photoPreview ? (
                <img
                  src={profile.photo || profile.photoPreview}
                  alt={profile.shopName || profile.name}
                  className="buyer-profile-photo-large"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="buyer-profile-photo-fallback">
                  <Building2 size={36} />
                </div>
              )}
              {/* Photo Change Badge Button */}
              <button
                type="button"
                className="buyer-profile-photo-change-btn"
                onClick={() => photoInputRef.current?.click()}
                title="Upload / Change Photo"
                aria-label="Change photo"
              >
                <Camera size={14} />
              </button>
            </div>

            <div className="buyer-profile-header-text">
              <div className="buyer-profile-name-row">
                <h2 className="buyer-profile-firm-name">
                  {profile.shopName || profile.name}
                </h2>
                <span className="buyer-verified-badge">
                  <CheckCircle2 size={13} />
                  <span>{t('profile.verifiedBuyer')}</span>
                </span>
              </div>
              <p className="buyer-profile-firm-sub">
                👤 {profile.contactPerson || profile.name} •{' '}
                {profile.businessType || t('profile.commercialBuyerCategory')}
              </p>
              <div className="buyer-profile-meta-tags">
                <span className="buyer-category-pill">
                  {profile.buyerType === 'hotel' && <Building2 size={12} />}
                  {profile.buyerType === 'supermarket' && <ShoppingCart size={12} />}
                  {profile.buyerType === 'retailer' && <Store size={12} />}
                  {profile.buyerType === 'mahal' && <Building2 size={12} />}
                  <span>
                    {profile.buyerType === 'hotel'
                      ? t('profile.hotelCategory')
                      : profile.buyerType === 'supermarket'
                      ? t('profile.supermarketCategory')
                      : profile.buyerType === 'retailer'
                      ? t('profile.retailerCategory')
                      : profile.buyerType === 'mahal'
                      ? t('profile.mahalCategory')
                      : profile.businessType || t('profile.commercialBuyerCategory')}
                  </span>
                </span>
                <span className="buyer-id-pill">ID: NU-BYR-2026</span>
              </div>
            </div>
          </div>

          {/* Complete 8-Field Details Grid */}
          <div className="buyer-profile-details-grid">
            {/* 1. Contact Person */}
            <div className="buyer-detail-item">
              <span className="detail-label">
                {t('profile.contactPersonLabel')}
              </span>
              <span className="detail-value">{profile.contactPerson || profile.name}</span>
              <span className="detail-subtext">
                {t('profile.contactPersonSub')}
              </span>
            </div>

            {/* 2. Phone Number */}
            <div className="buyer-detail-item">
              <span className="detail-label">
                {t('profile.mobileNumberLabel')}
              </span>
              <span className="detail-value font-mono">{profile.phone}</span>
              <span className="detail-status-pill green">
                <Check size={11} /> {t('profile.verifiedMobile')}
              </span>
            </div>

            {/* 3. Corporate Email */}
            <div className="buyer-detail-item">
              <span className="detail-label">
                {t('profile.emailLabel')}
              </span>
              <span className="detail-value">{profile.email}</span>
              <span className="detail-status-pill green">
                <Check size={11} /> {t('profile.eInvoicingEnabled')}
              </span>
            </div>

            {/* 4. Shop / Business Name */}
            <div className="buyer-detail-item">
              <span className="detail-label">
                {t('profile.shopNameLabel')}
              </span>
              <span className="detail-value font-semibold">
                {profile.shopName || profile.name}
              </span>
              <span className="detail-subtext">
                {t('profile.shopNameSub')}
              </span>
            </div>

            {/* 5. Commercial Buyer Type */}
            <div className="buyer-detail-item">
              <span className="detail-label">
                {t('profile.buyerCategoryLabel')}
              </span>
              <span className="detail-value">
                {profile.buyerType === 'hotel'
                  ? t('profile.hotelCategory')
                  : profile.buyerType === 'supermarket'
                  ? t('profile.supermarketCategory')
                  : profile.buyerType === 'retailer'
                  ? t('profile.retailerCategory')
                  : profile.buyerType === 'mahal'
                  ? t('profile.mahalCategory')
                  : profile.businessType || t('profile.commercialBuyerCategory')}
              </span>
              <span className="detail-subtext">
                {t('profile.buyerCategorySub')}
              </span>
            </div>

            {/* 6. GSTIN Number */}
            <div className="buyer-detail-item">
              <span className="detail-label">
                {t('profile.gstinLabel')}
              </span>
              <span className="detail-value font-mono">{profile.gstin}</span>
              <span className="detail-status-pill green">
                <ShieldCheck size={11} />{' '}
                {t('profile.verifiedGst')}
              </span>
            </div>

            {/* 7. Loading Bay Delivery Address */}
            <div className="buyer-detail-item full-width">
              <span className="detail-label">
                {t('profile.addressLabel')}
              </span>
              <span className="detail-value">{profile.address}</span>
              <span className="detail-subtext">
                {t('profile.addressSub')}
              </span>
            </div>

            {/* 8. KYC Document & Profile Photo Status */}
            <div className="buyer-detail-item">
              <span className="detail-label">
                {t('profile.kycLabel')}
              </span>
              <div className="buyer-doc-preview-chip">
                {profile.photo || profile.photoPreview ? (
                  <img
                    src={profile.photo || profile.photoPreview}
                    alt="Document Thumbnail"
                    className="buyer-doc-mini-thumb"
                  />
                ) : (
                  <Building2 size={16} />
                )}
                <span>
                  {t('profile.photoAttached')}
                </span>
              </div>
            </div>

            {/* 9. Hub Allocation & PIN */}
            <div className="buyer-detail-item">
              <span className="detail-label">
                {t('profile.assignedHubLabel')}
              </span>
              <span className="detail-value">{t('profile.assignedHubVal')}</span>
              <span className="detail-subtext">
                {t('profile.securityPin', { pin: '4892' })}
              </span>
            </div>
          </div>

          {/* Profile Action Buttons */}
          <div className="buyer-profile-footer-actions">
            <button
              type="button"
              className="buyer-btn-outline"
              onClick={() => photoInputRef.current?.click()}
            >
              <Camera size={15} />
              <span>{t('profile.changePhoto')}</span>
            </button>
            <button
              type="button"
              className="buyer-btn-primary"
              onClick={handleOpenEditProfile}
            >
              <Edit3 size={15} />
              <span>{t('profile.editBusinessDetails')}</span>
            </button>
            <button
              type="button"
              className="buyer-btn-danger"
              onClick={() => setSignOutModalOpen(true)}
            >
              <LogOut size={15} />
              <span>{t('signOut')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
