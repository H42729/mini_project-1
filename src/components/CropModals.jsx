// What this file does: Reusable modal dialogs for crop workflows: decline confirmation, accept quantity modal, and farmer contact details modal.

import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Check,
  X,
  User,
  Phone,
  Truck
} from 'lucide-react';
import { useT } from '../hooks/useT';

const FALLBACK_CROP_IMG =
  'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80';

export default function CropModals({
  declineModalCrop,
  onDeclineClose,
  onConfirmDecline,
  acceptModalCrop,
  acceptedQuantity,
  onQuantityChange,
  onAcceptClose,
  onProceedToFarmer: _onProceedToFarmer,
  farmerDetailsCrop,
  onFarmerDetailsClose,
  onConfirmOrder,
  orderConfirmationData,
  onGoToTracking,
  onBrowseMore,
  lang: propLang
}) {
  const { t, lang: hookLang } = useT('buyerDashboard');
  const lang = propLang || hookLang || 'en';

  return (
    <>
      {/* 1. Decline Confirmation Modal */}
      {declineModalCrop && (
        <div className="buyer-modal-backdrop" onClick={onDeclineClose}>
          <div className="buyer-modal-panel decline-modal" onClick={(e) => e.stopPropagation()}>
            <div className="buyer-modal-header">
              <div className="buyer-modal-icon-wrap amber">
                <AlertCircle size={22} />
              </div>
              <div>
                <h3 className="buyer-modal-title">
                  {t('modals.declineTitle')}
                </h3>
                <p className="buyer-modal-subtitle">
                  {t('modals.declinePrompt', { name: declineModalCrop.name })}
                </p>
              </div>
              <button
                type="button"
                className="buyer-modal-close-btn"
                onClick={onDeclineClose}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="buyer-modal-body">
              <div className="buyer-decline-crop-preview">
                <img
                  src={declineModalCrop.image}
                  alt={declineModalCrop.name}
                  className="buyer-decline-img"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_CROP_IMG;
                  }}
                />
                <div>
                  <h4 className="buyer-preview-name">{declineModalCrop.name}</h4>
                  <p className="buyer-preview-meta">
                    {declineModalCrop.grade} • ₹{declineModalCrop.pricePerKg} / kg • Available:{' '}
                    {declineModalCrop.availableKg} kg
                  </p>
                  <p className="buyer-preview-sub">
                    {t('modals.declineDesc')}
                  </p>
                </div>
              </div>
            </div>

            <div className="buyer-modal-footer">
              <button
                type="button"
                className="buyer-btn-outline"
                onClick={onDeclineClose}
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                className="buyer-btn-danger"
                onClick={onConfirmDecline}
              >
                {t('modals.declineBtn')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Accept Produce Modal */}
      {acceptModalCrop && (() => {
        const minOrder = Number(acceptModalCrop.minOrderKg) || 10;
        const maxOrder = Number(acceptModalCrop.availableKg) || 100;
        const pricePerKg = Number(acceptModalCrop.pricePerKg) || 0;
        const presets = Array.from(new Set([50, 100, 200, 300, maxOrder])).filter((q) => q <= maxOrder);

        return (
          <div className="buyer-modal-backdrop" onClick={onAcceptClose}>
            <div className="buyer-modal-panel accept-modal" onClick={(e) => e.stopPropagation()}>
              <div className="buyer-modal-header">
                <div className="buyer-modal-icon-wrap green">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <h3 className="buyer-modal-title">
                    {t('modals.acceptTitle', { name: acceptModalCrop.name })}
                  </h3>
                  <p className="buyer-modal-subtitle">
                    {t('modals.acceptSubtitle')}
                  </p>
                </div>
                <button
                  type="button"
                  className="buyer-modal-close-btn"
                  onClick={onAcceptClose}
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="buyer-modal-body">
                <div className="buyer-accept-produce-summary">
                  <img
                    src={acceptModalCrop.image}
                    alt={acceptModalCrop.name}
                    className="buyer-accept-img"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_CROP_IMG;
                    }}
                  />
                  <div className="buyer-accept-details">
                    <div className="buyer-accept-tags">
                      <span className="buyer-grade-badge green">{acceptModalCrop.grade} ✓</span>
                      <span className="buyer-hub-loc-tag">{acceptModalCrop.hubName}</span>
                    </div>
                    <h4 className="buyer-accept-name">{acceptModalCrop.name}</h4>
                    <div className="buyer-accept-price-row">
                      <span className="buyer-accept-price">₹{pricePerKg}</span>
                      <span className="buyer-accept-unit">{t('modals.directWholesale')}</span>
                    </div>
                    <p className="buyer-accept-stock">
                      {t('modals.availableHubStock', { qty: maxOrder })}
                    </p>
                  </div>
                </div>

                {/* Quantity Slider & Presets */}
                <div className="buyer-quantity-picker-box">
                  <div className="buyer-picker-header">
                    <label htmlFor="modal-quantity-input" className="buyer-picker-title">
                      {t('modals.selectQuantity')}
                    </label>
                    <div className="buyer-qty-input-wrap">
                      <input
                        id="modal-quantity-input"
                        type="number"
                        min={minOrder}
                        max={maxOrder}
                        step={10}
                        className="buyer-qty-numeric-input"
                        value={acceptedQuantity}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          onQuantityChange(Math.min(maxOrder, Math.max(minOrder, val)));
                        }}
                      />
                      <span className="buyer-qty-unit-label">kg</span>
                    </div>
                  </div>

                  {/* Range Slider */}
                  <input
                    type="range"
                    min={minOrder}
                    max={maxOrder}
                    step={10}
                    className="buyer-range-slider"
                    value={acceptedQuantity}
                    onChange={(e) => onQuantityChange(Number(e.target.value))}
                  />

                  {/* Quick Presets with Deduplicated Keys */}
                  <div className="buyer-qty-presets">
                    {presets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        className={`buyer-preset-btn ${acceptedQuantity === preset ? 'active' : ''}`}
                        onClick={() => onQuantityChange(preset)}
                      >
                        {preset === maxOrder
                          ? t('modals.allPreset', { qty: preset })
                          : t('modals.qtyPreset', { qty: preset })}
                      </button>
                    ))}
                  </div>

                  {/* Calculated Estimated Total */}
                  <div className="buyer-calc-total-banner">
                    <div>
                      <span className="buyer-calc-label">
                        {t('modals.estimatedTotal')}
                      </span>
                      <span className="buyer-calc-sub">
                        ({acceptedQuantity} kg × ₹{pricePerKg}/kg)
                      </span>
                    </div>
                    <span className="buyer-calc-val">
                      ₹{((Number(acceptedQuantity) || 0) * pricePerKg).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="buyer-modal-footer">
                <button
                  type="button"
                  className="buyer-btn-outline"
                  onClick={onAcceptClose}
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="button"
                  className="buyer-btn-primary"
                  onClick={onConfirmOrder}
                >
                  <Check size={16} />
                  <span>{lang === 'ta' ? 'ஆர்டரை உறுதிப்படுத்துக' : 'Confirm & Accept Order'}</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 3. Farmer Details & Order Review Modal */}
      {farmerDetailsCrop && (() => {
        const f = farmerDetailsCrop.farmer || {};
        const estimatedTotal =
          Number(farmerDetailsCrop.estimatedTotal) ||
          (Number(farmerDetailsCrop.selectedQty) || 0) * (Number(farmerDetailsCrop.pricePerKg) || 0);

        return (
          <div className="buyer-modal-backdrop" onClick={onFarmerDetailsClose}>
            <div className="buyer-modal-panel farmer-modal" onClick={(e) => e.stopPropagation()}>
              <div className="buyer-modal-header">
                <div className="buyer-modal-icon-wrap green">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <span className="buyer-badge-tag green">{t('modals.cropAcceptedBadge')}</span>
                  <h3 className="buyer-modal-title">
                    {t('modals.farmerDossierTitle')}
                  </h3>
                </div>
                <button
                  type="button"
                  className="buyer-modal-close-btn"
                  onClick={onFarmerDetailsClose}
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="buyer-modal-body">
                <div className="buyer-farmer-dossier-card">
                  <div className="buyer-dossier-header">
                    <div className="buyer-farmer-avatar-wrap">
                      <User size={26} />
                    </div>
                    <div className="buyer-farmer-names">
                      <h4 className="buyer-farmer-fullname">👤 {f.name || 'Local Producer'}</h4>
                      <span className="buyer-farmer-location">📍 {f.village || 'Tamil Nadu Agri Hub'}</span>
                      <span className="buyer-grower-id">ID: {f.farmerId || 'NU-FAR-2026'}</span>
                    </div>
                    <div className="buyer-farmer-call-box">
                      <a
                        href={f.phone ? `tel:${f.phone}` : '#'}
                        className="buyer-call-farmer-btn"
                        title="Direct telephone connect"
                      >
                        <Phone size={15} />
                        <span>{t('modals.callFarmer')}</span>
                      </a>
                    </div>
                  </div>

                  <div className="buyer-farmer-specs-grid">
                    <div className="buyer-fspec-item">
                      <span className="fspec-label">{t('modals.cropLabel')}</span>
                      <span className="fspec-val">{farmerDetailsCrop.name}</span>
                    </div>
                    <div className="buyer-fspec-item">
                      <span className="fspec-label">{t('modals.gradeLabel')}</span>
                      <span className="fspec-val font-semibold">{farmerDetailsCrop.grade}</span>
                    </div>
                    <div className="buyer-fspec-item">
                      <span className="fspec-label">{t('modals.acceptedQtyLabel')}</span>
                      <span className="fspec-val">{farmerDetailsCrop.selectedQty} kg</span>
                    </div>
                    <div className="buyer-fspec-item">
                      <span className="fspec-label">{t('modals.contactNumberLabel')}</span>
                      <span className="fspec-val font-mono">{f.phone || '+91 98400 00000'}</span>
                    </div>
                  </div>
                </div>

                <div className="buyer-order-summary-box">
                  <h4 className="buyer-summary-box-title">
                    {t('modals.orderSummary')}
                  </h4>
                  <div className="buyer-summary-lines">
                    <div className="buyer-sline">
                      <span>{t('modals.produceLabel')}</span>
                      <span className="font-semibold">
                        {farmerDetailsCrop.name} ({farmerDetailsCrop.grade})
                      </span>
                    </div>
                    <div className="buyer-sline">
                      <span>{t('modals.quantityLabel')}</span>
                      <span>{farmerDetailsCrop.selectedQty} kg</span>
                    </div>
                    <div className="buyer-sline">
                      <span>{t('modals.wholesalePriceLabel')}</span>
                      <span>₹{farmerDetailsCrop.pricePerKg} / kg</span>
                    </div>
                    <div className="buyer-sline">
                      <span>{t('modals.middlemanCommission')}</span>
                      <span className="text-green-700 font-semibold">{t('modals.zeroBrokerage')}</span>
                    </div>
                    <div className="buyer-sline-divider" />
                    <div className="buyer-sline total">
                      <span>{t('modals.estimatedTotal')}</span>
                      <span className="buyer-sline-total-val">
                        ₹{estimatedTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="buyer-modal-footer">
                <button
                  type="button"
                  className="buyer-btn-outline"
                  onClick={onFarmerDetailsClose}
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="button"
                  className="buyer-btn-primary"
                  onClick={onConfirmOrder}
                >
                  <CheckCircle2 size={16} />
                  <span>{t('modals.confirmOrderBtn')}</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 4. Order Confirmed Modal: Displays confirmation message and action buttons */}
      {orderConfirmationData && (
        <div className="buyer-modal-backdrop" onClick={() => onGoToTracking(orderConfirmationData.orderId)}>
          <div className="buyer-modal-panel success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="buyer-success-card">
              <div className="buyer-success-icon-badge">
                <Check size={36} />
              </div>
              <h2 className="buyer-success-heading">
                {lang === 'ta' ? 'ஆர்டர் உறுதி செய்யப்பட்டது' : 'Order Confirmed'}
              </h2>
              <p className="buyer-success-message">
                {t('modals.orderConfirmedMsg', {
                  qty: orderConfirmationData.quantityKg || '—',
                  name: orderConfirmationData.cropName || orderConfirmationData.name || 'Produce'
                })}
              </p>

              <div className="buyer-success-actions" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  type="button"
                  className="buyer-btn-primary full-width"
                  onClick={() => onGoToTracking(orderConfirmationData.orderId)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    fontSize: '1rem',
                    fontWeight: '700',
                    borderRadius: '10px'
                  }}
                >
                  <Truck size={18} />
                  <span>{lang === 'ta' ? 'உங்கள் ஆர்டரைக் கண்காணிக்கவும்' : 'Track Your Order'}</span>
                </button>
                {onBrowseMore && (
                  <button
                    type="button"
                    className="buyer-btn-outline full-width"
                    onClick={onBrowseMore}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      fontSize: '0.95rem',
                      borderRadius: '10px'
                    }}
                  >
                    <span>{lang === 'ta' ? 'மேலும் விளைபொருட்களைப் பார்க்கவும்' : 'Browse More Produce'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
