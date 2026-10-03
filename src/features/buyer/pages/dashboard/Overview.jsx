import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sprout,
  Truck,
  Clock,
  ArrowRight,
  Calendar
} from 'lucide-react';
import './Overview.css';
import { ROUTES } from '../../../../router/routes';
import { SectionHeader, Skeleton } from '../../../../components/ui';
import { useBuyer } from '../../context/BuyerContext';
import CropCard from '../../components/CropCard';

export default function Overview() {
  const navigate = useNavigate();
  const {
    profile,
    crops,
    filteredCrops,
    orders,
    t,
    lang,
    handleOpenAccept,
    handleOpenDecline
  } = useBuyer();

  return (
    <div className="buyer-view-container animate-fade-in">
      <SectionHeader
        className="buyer-view-header"
        title={
          <span>
            {t('goodMorning')}{' '}
            <span className="buyer-highlight-name">
              {profile.shopName || profile.contactPerson || profile.name}
            </span>
          </span>
        }
        subtitle={t('hubTagline')}
        action={
          <div className="buyer-header-date-tag">
            <Calendar size={15} />
            <span>{t('activeHubsTag')}</span>
          </div>
        }
      />

      {/* Summary Row (ONLY 3 clean cards - NO excessive charts!) */}
      <div className="buyer-summary-row">
        <div
          className="buyer-summary-card"
          onClick={() => navigate(ROUTES.BUYER_DASHBOARD_CROPS)}
        >
          <div className="buyer-summary-number-wrap">
            <span className="buyer-summary-number">{crops.length}</span>
            <span className="buyer-summary-trend">
              <Sprout size={14} /> {t('overview.fresh')}
            </span>
          </div>
          <span className="buyer-summary-label">{t('overview.statCrops')}</span>
          <span className="buyer-summary-hint">{t('overview.cropsHint')}</span>
        </div>

        <div
          className="buyer-summary-card"
          onClick={() => navigate(ROUTES.BUYER_DASHBOARD_ORDERS)}
        >
          <div className="buyer-summary-number-wrap">
            <span className="buyer-summary-number">{orders.length}</span>
            <span className="buyer-summary-trend neutral">
              <Clock size={14} /> {t('overview.active')}
            </span>
          </div>
          <span className="buyer-summary-label">{t('overview.statOrders')}</span>
          <span className="buyer-summary-hint">{t('overview.ordersHint')}</span>
        </div>

        <div
          className="buyer-summary-card active-transit"
          onClick={() => navigate(ROUTES.BUYER_DASHBOARD_TRACK)}
        >
          <div className="buyer-summary-number-wrap">
            <span className="buyer-summary-number">1</span>
            <span className="buyer-summary-trend green">
              <span className="pulse-indicator" /> {t('overview.onRoute')}
            </span>
          </div>
          <span className="buyer-summary-label">{t('overview.statTransit')}</span>
          <span className="buyer-summary-hint">{t('overview.transitHint')}</span>
        </div>
      </div>

      {/* Active Delivery Spotlight Quick Banner */}
      <div className="buyer-transit-spotlight-card">
        <div className="buyer-transit-spotlight-left">
          <div className="buyer-transit-icon-box">
            <Truck size={24} className="buyer-transit-icon animate-bounce-subtle" />
          </div>
          <div>
            <div className="buyer-transit-badge-row">
              <span className="buyer-live-badge">{t('overview.liveTracking')}</span>
              <span className="buyer-transit-id">Order #NU-2026-00124</span>
            </div>
            <h3 className="buyer-transit-title">
              {t('overview.spotlightTitle')}
            </h3>
            <p className="buyer-transit-meta">
              {t('overview.spotlightMeta')}
            </p>
          </div>
        </div>
        <div className="buyer-transit-spotlight-right">
          <div className="buyer-eta-pill">
            <span className="buyer-eta-sub">{t('overview.estimatedArrival')}</span>
            <span className="buyer-eta-val">{t('overview.estimatedArrivalVal')}</span>
          </div>
          <button
            type="button"
            className="buyer-btn-primary"
            onClick={() => navigate(ROUTES.BUYER_DASHBOARD_TRACK)}
          >
            <span>{t('overview.trackLiveMap')}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Quick Fresh Arrivals Section */}
      <div className="buyer-section-block">
        <div className="buyer-section-header">
          <div>
            <h2 className="buyer-section-heading">
              {t('overview.freshArrivalsTitle')}
            </h2>
            <p className="buyer-section-sub">
              {t('overview.freshArrivalsSub')}
            </p>
          </div>
          <button
            type="button"
            className="buyer-link-btn"
            onClick={() => navigate(ROUTES.BUYER_DASHBOARD_CROPS)}
          >
            <span>{t('overview.viewAllCrops')}</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* 3 Featured Cards */}
        <div className="buyer-crop-grid featured-row">
          {filteredCrops.length > 0 ? (
            filteredCrops.slice(0, 3).map((crop) => (
              <CropCard
                key={crop.id}
                crop={crop}
                lang={lang}
                t={t}
                onAccept={() => handleOpenAccept(crop)}
                onDecline={() => handleOpenDecline(crop)}
              />
            ))
          ) : (
            <Skeleton variant="card" count={3} height={220} />
          )}
        </div>
      </div>
    </div>
  );
}
