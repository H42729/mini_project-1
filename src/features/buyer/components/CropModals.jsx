import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Check,
  X,
  ArrowRight,
  User,
  Phone,
  Truck
} from 'lucide-react';
import { useT } from '../../../i18n';

export default function CropModals({
  declineModalCrop,
  onDeclineClose,
  onConfirmDecline,
  acceptModalCrop,
  acceptedQuantity,
  onQuantityChange,
  onAcceptClose,
  onProceedToFarmer,
  farmerDetailsCrop,
  onFarmerDetailsClose,
  onConfirmOrder,
  orderConfirmationData,
  onGoToTracking,
  onBrowseMore,
  _lang
}) {
  const { t } = useT('buyerDashboard');

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
                    e.target.src =
                       'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80';
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
      {acceptModalCrop && (
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
                    e.target.src =
                      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="buyer-accept-details">
                  <div className="buyer-accept-tags">
                    <span className="buyer-grade-badge green">{acceptModalCrop.grade} ✓</span>
                    <span className="buyer-hub-loc-tag">{acceptModalCrop.hubName}</span>
                  </div>
                  <h4 className="buyer-accept-name">{acceptModalCrop.name}</h4>
                  <div className="buyer-accept-price-row">
                    <span className="buyer-accept-price">₹{acceptModalCrop.pricePerKg}</span>
                    <span className="buyer-accept-unit">{t('modals.directWholesale')}</span>
                  </div>
                  <p className="buyer-accept-stock">
                    {t('modals.availableHubStock', { qty: acceptModalCrop.availableKg })}
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
                      min={acceptModalCrop.minOrderKg}
                      max={acceptModalCrop.availableKg}
                      step={10}
                      className="buyer-qty-numeric-input"
                      value={acceptedQuantity}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        onQuantityChange(
                          Math.min(acceptModalCrop.availableKg, Math.max(acceptModalCrop.minOrderKg, val))
                        );
                      }}
                    />
                    <span className="buyer-qty-unit-label">kg</span>
                  </div>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min={acceptModalCrop.minOrderKg}
                  max={acceptModalCrop.availableKg}
                  step={10}
                  className="buyer-range-slider"
                  value={acceptedQuantity}
                  onChange={(e) => onQuantityChange(Number(e.target.value))}
                />

                {/* Quick Presets */}
                <div className="buyer-qty-presets">
                  {[50, 100, 200, 300, acceptModalCrop.availableKg]
                    .filter((q) => q <= acceptModalCrop.availableKg)
                    .map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        className={`buyer-preset-btn ${acceptedQuantity === preset ? 'active' : ''}`}
                        onClick={() => onQuantityChange(preset)}
                      >
                        {preset === acceptModalCrop.availableKg ? t('modals.allPreset', { qty: preset }) : t('modals.qtyPreset', { qty: preset })}
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
                      ({acceptedQuantity} kg × ₹{acceptModalCrop.pricePerKg}/kg)
                    </span>
                  </div>
                  <span className="buyer-calc-val">
                    ₹{(acceptedQuantity * acceptModalCrop.pricePerKg).toLocaleString('en-IN')}
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
                onClick={onProceedToFarmer}
              >
                <span>{t('modals.acceptAndProceed')}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Farmer Details & Order Review Modal */}
      {farmerDetailsCrop && (
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
                    <h4 className="buyer-farmer-fullname">👤 {farmerDetailsCrop.farmer.name}</h4>
                    <span className="buyer-farmer-location">📍 {farmerDetailsCrop.farmer.village}</span>
                    <span className="buyer-grower-id">ID: {farmerDetailsCrop.farmer.farmerId}</span>
                  </div>
                  <div className="buyer-farmer-call-box">
                    <a
                      href={`tel:${farmerDetailsCrop.farmer.phone}`}
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
                    <span className="fspec-val font-mono">{farmerDetailsCrop.farmer.phone}</span>
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
                      ₹{farmerDetailsCrop.estimatedTotal.toLocaleString('en-IN')}
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
      )}

      {/* 4. Order Confirmed Modal */}
      {orderConfirmationData && (
        <div className="buyer-modal-backdrop">
          <div className="buyer-modal-panel success-modal">
            <div className="buyer-success-card">
              <div className="buyer-success-icon-badge">
                <Check size={36} />
              </div>
              <span className="buyer-success-sub-badge">{t('modals.orderConfirmedBadge')}</span>
              <h2 className="buyer-success-heading">
                {t('modals.orderConfirmedTitle')}
              </h2>
              <p className="buyer-success-message">
                {t('modals.orderConfirmedMsg', { qty: orderConfirmationData.quantityKg, name: orderConfirmationData.cropName })}
              </p>

              <div className="buyer-confirmed-meta-box">
                <div className="buyer-cmeta-row">
                  <span className="cmeta-label">{t('modals.orderId')}</span>
                  <span className="cmeta-val font-mono">{orderConfirmationData.orderId}</span>
                </div>
                <div className="buyer-cmeta-row">
                  <span className="cmeta-label">{t('modals.status')}</span>
                  <span className="cmeta-val green">{t('modals.preparingForDispatch')}</span>
                </div>
                <div className="buyer-cmeta-row">
                  <span className="cmeta-label">{t('modals.estimatedTotal')}</span>
                  <span className="cmeta-val font-bold">
                    ₹{orderConfirmationData.totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="buyer-success-actions">
                <button
                  type="button"
                  className="buyer-btn-primary full-width"
                  onClick={() => onGoToTracking(orderConfirmationData.orderId)}
                >
                  <Truck size={17} />
                  <span>{t('modals.trackDeliveryLive')}</span>
                </button>
                <button
                  type="button"
                  className="buyer-btn-outline full-width"
                  onClick={onBrowseMore}
                >
                  <span>{t('modals.browseMoreProduce')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
