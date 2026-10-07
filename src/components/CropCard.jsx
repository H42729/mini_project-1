// What this file does: Reusable card component displaying crop listing details, pricing, farmer info, and action buttons.

import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import Badge from './Badge';
import Button from './Button';
import Card from './Card';

/**
 * Reusable Crop Card Component
 * Strict responsive card: 3-4 on desktop, 2 on tablet, 1 on mobile
 */
export default function CropCard({ crop, _lang, t, onAccept, onDecline }) {
  return (
    <Card className="buyer-crop-card" padding="none">
      {/* Crop Image with harvest time badge */}
      <div className="buyer-crop-img-wrap">
        <img
          src={crop.image}
          alt={crop.name}
          className="buyer-crop-img"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80';
          }}
        />
        <span className="buyer-crop-harvest-badge">
          <Clock size={11} /> {crop.harvestTime}
        </span>
        {crop.grade && (
          <Badge
            grade={crop.grade}
            className={`buyer-crop-grade-tag ${crop.grade === 'Grade A' ? 'grade-a' : 'grade-b'}`}
          />
        )}
      </div>

      {/* Card Content */}
      <div className="buyer-crop-card-body">
        {/* Title & Hub Row */}
        <div className="buyer-crop-title-group">
          <h3 className="buyer-crop-name">{crop.name}</h3>
          <span className="buyer-crop-tamil-name">{crop.tamilName}</span>
        </div>

        {/* Price with strong visual hierarchy */}
        <div className="buyer-crop-price-box">
          <span className="buyer-price-currency">₹</span>
          <span className="buyer-price-number">{crop.pricePerKg}</span>
          <span className="buyer-price-unit">{typeof t === 'function' ? t('crops.perKg') : (t?.perKg || '/ kg')}</span>
        </div>

        {/* Quantity & Hub details */}
        <div className="buyer-crop-meta-rows">
          <div className="buyer-meta-item">
            <span className="meta-label">{typeof t === 'function' ? t('crops.available') : (t?.available || 'Available:')}</span>
            <span className="meta-value font-semibold">{crop.availableKg} kg</span>
          </div>
          <div className="buyer-meta-item">
            <span className="meta-label">{typeof t === 'function' ? t('crops.hub') : (t?.hub || 'Hub:')}</span>
            <span className="meta-value hub-name">
              <MapPin size={12} /> {crop.hubName}
            </span>
          </div>
        </div>

        {/* Action Buttons: Accept (Primary) & Decline (Secondary) */}
        <div className="buyer-crop-card-actions">
          <Button
            type="button"
            variant="primary"
            className="buyer-btn-accept"
            onClick={onAccept}
          >
            {typeof t === 'function' ? t('crops.btnAccept') : (t?.btnAccept || 'Accept')}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="buyer-btn-decline"
            onClick={onDecline}
          >
            {typeof t === 'function' ? t('crops.btnDecline') : (t?.btnDecline || 'Decline')}
          </Button>
        </div>
      </div>
    </Card>
  );
}
