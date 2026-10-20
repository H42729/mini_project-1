// What this file does: Live order and consignment delivery tracking page with timeline and driver contact.

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  Check,
  Truck,
  MapPin,
  Zap,
  RotateCcw,
  User,
  Phone
} from 'lucide-react';
import './Track.css';
import { ROUTES } from '../../routes';
import { useBuyer } from '../../context/BuyerContext';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/Button';

export default function Track() {
  const navigate = useNavigate();
  const {
    orders,
    selectedTrackingOrderId,
    setSelectedTrackingOrderId,
    trackingOrder,
    profile,
    showToast,
    t
  } = useBuyer();

  // Dynamic status stage index (0: Confirmed, 1: Preparing, 2: Vehicle Assigned, 3: On The Way, 4: Delivered)
  const currentStageIndex = useMemo(() => {
    const status = trackingOrder?.status;
    if (status === 'delivered') return 4;
    if (status === 'in_transit') return 3;
    if (status === 'assigned' || status === 'dispatched') return 2;
    if (status === 'preparing') return 1;
    return 0; // confirmed
  }, [trackingOrder?.status]);

  const trackingSteps = useMemo(
    () => [
      {
        id: 'confirmed',
        titleKey: 'track.stepConfirmed',
        time: trackingOrder?.orderTime || '08:30 AM',
        icon: Check
      },
      {
        id: 'preparing',
        titleKey: 'track.stepPreparing',
        time: 'Hub Sorting',
        icon: Check
      },
      {
        id: 'assigned',
        titleKey: 'track.stepAssigned',
        time: trackingOrder?.driver?.vehicleNumber || 'EV Assigned',
        icon: Check
      },
      {
        id: 'in_transit',
        titleKey: 'track.stepOnTheWay',
        time: trackingOrder?.liveTracking?.estimatedMinutes
          ? `${trackingOrder.liveTracking.estimatedMinutes} min ETA`
          : 'In Transit',
        icon: Truck
      },
      {
        id: 'delivered',
        titleKey: 'track.stepDelivered',
        time: 'Destination Bay',
        icon: MapPin
      }
    ],
    [trackingOrder]
  );

  // If no orders exist or trackingOrder is missing, render graceful EmptyState
  if (!trackingOrder || (orders || []).length === 0) {
    return (
      <div className="buyer-view-container animate-fade-in">
        <div className="buyer-view-header">
          <div>
            <h1 className="buyer-view-title">{t('track.title')}</h1>
            <p className="buyer-view-subtitle">{t('track.subtitle')}</p>
          </div>
        </div>
        <EmptyState
          icon={<Truck size={36} />}
          title="No active deliveries to track"
          description="When you place produce orders, real-time GPS telemetry, driver contact, and the secure handover PIN will appear here."
          action={
            <Button
              type="button"
              variant="primary"
              onClick={() => navigate(ROUTES.BUYER_DASHBOARD_CROPS)}
            >
              <span>Browse Fresh Produce</span>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="buyer-view-container animate-fade-in">
      <div className="buyer-view-header">
        <div>
          <h1 className="buyer-view-title">{t('track.title')}</h1>
          <p className="buyer-view-subtitle">{t('track.subtitle')}</p>
        </div>

        {/* Active Tracking Order Switcher */}
        <div className="buyer-active-order-picker">
          <span className="buyer-picker-label">{t('track.trackingOrder')}</span>
          <div className="buyer-select-wrapper">
            <select
              className="buyer-select-input"
              value={selectedTrackingOrderId}
              onChange={(e) => setSelectedTrackingOrderId(e.target.value)}
            >
              {(orders || []).map((o) => (
                <option key={o.orderId} value={o.orderId}>
                  {o.orderId} — {o.cropName} ({o.quantityKg} kg)
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="buyer-select-arrow" />
          </div>
        </div>
      </div>

      {/* 5-STAGE STATUS INDICATOR (Dynamically Reactive) */}
      <div className="buyer-tracking-stepper-card">
        <div className="buyer-stepper-inner">
          {trackingSteps.map((step, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isActive = idx === currentStageIndex;
            const stepClass = isCompleted ? 'completed' : isActive ? 'active' : 'pending';
            const StepIcon = step.icon;

            return (
              <React.Fragment key={step.id}>
                <div className={`buyer-step ${stepClass}`}>
                  <div className={`buyer-step-circle ${isActive ? 'pulse-circle' : ''}`}>
                    {isCompleted ? <Check size={14} /> : <StepIcon size={14} />}
                  </div>
                  <span className={`buyer-step-title ${isActive ? 'active' : ''}`}>
                    {t(step.titleKey)}
                  </span>
                  <span className="buyer-step-time">{step.time}</span>
                </div>
                {idx < trackingSteps.length - 1 && (
                  <div
                    className={`buyer-step-line ${
                      idx < currentStageIndex
                        ? 'completed'
                        : idx === currentStageIndex
                        ? 'active'
                        : 'pending'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* LIVE MAP & TELEMETRY SPLIT LAYOUT */}
      <div className="buyer-map-tracking-layout">
        {/* Visual Logistics Map */}
        <div className="buyer-map-container">
          <div className="buyer-map-header-overlay">
            <div className="buyer-map-legend">
              <span className="legend-item">
                <span className="dot hub" /> {t('track.legendHub')}
              </span>
              <span className="legend-item">
                <span className="dot vehicle" /> {t('track.legendVehicle')}
              </span>
              <span className="legend-item">
                <span className="dot destination" /> {t('track.legendDestination')}
              </span>
            </div>
            <div className="buyer-map-speed-pill">
              <Zap size={14} />{' '}
              {t('track.speedBattery', {
                speed: trackingOrder?.liveTracking?.speedKmh ?? 42,
                battery: trackingOrder?.liveTracking?.batteryPct ?? 84
              })}
            </div>
          </div>

          {/* SVG Vector Map of Logistics Corridor */}
          <div className="buyer-svg-map-wrapper">
            <svg
              viewBox="0 0 800 480"
              className="buyer-logistics-svg"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1c3d5d" />
                  <stop offset="50%" stopColor="#2b5c8a" />
                  <stop offset="100%" stopColor="#c5d5e5" />
                </linearGradient>
                <filter id="shadowFilter" x="-10%" y="-10%" width="130%" height="130%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.18" />
                </filter>
              </defs>

              {/* Map Terrain Grid and Geography Lines */}
              <rect width="800" height="480" fill="#f1f5f9" rx="14" />

              {/* Stylized Contour & River Features */}
              <path
                d="M0,180 Q220,160 400,240 T800,220"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="38"
              />
              <path
                d="M0,320 Q200,340 450,290 T800,380"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="24"
              />

              {/* Secondary Connecting Arterials */}
              <path d="M120,40 L180,440" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="4 4" />
              <path d="M680,30 L640,430" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="4 4" />
              <path d="M30,300 L760,110" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />

              {/* Primary Highway Corridor */}
              <path
                id="highwayCorridor"
                d="M 140 100 C 260 120, 310 240, 430 250 S 580 340, 660 380"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="12"
                strokeLinecap="round"
              />

              {/* Active Route Delivery Polyline with pulsing dashes */}
              <path
                d="M 140 100 C 260 120, 310 240, 430 250 S 580 340, 660 380"
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="7"
                strokeLinecap="round"
                className="buyer-animated-route-path"
              />

              {/* Waypoint 1: Supply Hub (Origin) */}
              <g transform="translate(140, 100)">
                <circle r="18" fill="rgba(43, 92, 138, 0.15)" />
                <circle r="10" fill="#2b5c8a" />
                <circle r="4" fill="#ffffff" />
                <text x="0" y="-22" textAnchor="middle" className="svg-node-label font-bold">
                  {trackingOrder?.hub || 'Central Supply Hub'}
                </text>
                <text x="0" y="-8" textAnchor="middle" className="svg-node-sub">
                  Origin • {trackingOrder?.orderTime || '08:45 AM'}
                </text>
              </g>

              {/* Waypoint 2: Intermediate Checkpoint */}
              <g transform="translate(320, 200)">
                <circle r="5" fill="#64748b" />
                <text x="12" y="4" className="svg-node-sub">
                  Kodai Road Toll (Cleared)
                </text>
              </g>

              {/* Waypoint 3: Samayanallur Bypass */}
              <g transform="translate(460, 260)">
                <circle r="5" fill="#64748b" />
                <text x="12" y="4" className="svg-node-sub">
                  Samayanallur Bypass
                </text>
              </g>

              {/* Destination: Buyer Kitchen / Loading Bay */}
              <g transform="translate(660, 380)">
                <circle r="22" fill="rgba(180, 35, 24, 0.12)" />
                <circle r="11" fill="#b42318" />
                <circle r="4" fill="#ffffff" />
                <text x="0" y="32" textAnchor="middle" className="svg-node-label font-bold">
                  {profile?.shopName || profile?.name || 'Buyer Delivery Bay'}
                </text>
                <text x="0" y="46" textAnchor="middle" className="svg-node-sub">
                  Destination • Loading Bay 2
                </text>
              </g>

              {/* Moving Delivery EV Vehicle Marker (Clean Vector SVG, No Emojis) */}
              <g
                transform="translate(480, 275)"
                filter="url(#shadowFilter)"
                className="buyer-ev-marker-group"
              >
                <circle r="26" fill="rgba(43, 92, 138, 0.18)" className="animate-ping-slow" />
                <rect
                  x="-24"
                  y="-18"
                  width="48"
                  height="36"
                  rx="8"
                  fill="#2b5c8a"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <g transform="translate(-11, -11) scale(0.9)" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                  <path d="M15 18H9" />
                  <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
                  <circle cx="17" cy="18" r="2" />
                  <circle cx="7" cy="18" r="2" />
                </g>

                <g transform="translate(0, -32)">
                  <rect x="-56" y="-12" width="112" height="24" rx="12" fill="#0f172a" opacity="0.9" />
                  <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="600"
                  >
                    EV In Transit • {trackingOrder?.liveTracking?.speedKmh ?? 42} km/h
                  </text>
                </g>
              </g>
            </svg>
          </div>

          <div className="buyer-map-footer-bar">
            <span className="buyer-gps-text">
              <span className="live-gps-dot" /> {t('track.liveTelemetry')}
            </span>
            <button
              type="button"
              className="buyer-map-action-btn"
              onClick={() => showToast('info', t('track.telemetryRefreshed'))}
            >
              <RotateCcw size={13} /> {t('track.refreshGps')}
            </button>
          </div>
        </div>

        {/* SIDEBAR TELEMETRY & DRIVER INFORMATION CARDS */}
        <div className="buyer-telemetry-sidebar">
          {/* Live Status Card */}
          <div className="buyer-status-card">
            <div className="buyer-status-card-header">
              <div className="buyer-radar-pulse">
                <span className="pulse-dot-inner" />
              </div>
              <div>
                <span className="buyer-status-label">{t('track.currentStatus')}</span>
                <h4 className="buyer-status-main">
                  {trackingOrder?.liveTracking?.currentStatus || 'Order Confirmed - Scheduled for Dispatch'}
                </h4>
              </div>
            </div>

            <div className="buyer-status-grid">
              <div className="buyer-status-stat">
                <span className="stat-label">{t('track.currentLocation')}</span>
                <span className="stat-val">
                  {trackingOrder?.liveTracking?.currentLocation || trackingOrder?.hub || 'Collection Hub'}
                </span>
              </div>
              <div className="buyer-status-stat highlight">
                <span className="stat-label">{t('track.estimatedArrival')}</span>
                <span className="stat-val highlight">
                  {trackingOrder?.liveTracking?.estimatedMinutes ?? 25} min
                </span>
              </div>
              <div className="buyer-status-stat">
                <span className="stat-label">{t('track.distanceRemaining')}</span>
                <span className="stat-val">
                  {trackingOrder?.liveTracking?.distanceKm ?? 12} km
                </span>
              </div>
              <div className="buyer-status-stat">
                <span className="stat-label">{t('track.lastUpdated')}</span>
                <span className="stat-val">
                  {trackingOrder?.liveTracking?.lastUpdated || 'Just now'}
                </span>
              </div>
            </div>
          </div>

          {/* Compact Driver Details Card */}
          <div className="buyer-driver-card">
            <div className="buyer-driver-card-header">
              <span className="buyer-driver-heading">{t('track.driverDetails')}</span>
              <span className="buyer-vehicle-tag">{t('track.electricCargo')}</span>
            </div>

            <div className="buyer-driver-profile-row">
              <div className="buyer-driver-avatar">
                <User size={22} />
              </div>
              <div className="buyer-driver-info">
                <h4 className="buyer-driver-name">
                  {trackingOrder?.driver?.name || 'Assigning Logistics Driver...'}
                </h4>
                <div className="buyer-driver-rating">
                  <span>★ {trackingOrder?.driver?.rating ?? 4.9}</span>
                  <span className="buyer-dot">•</span>
                  <span>{t('track.deliveriesCount')}</span>
                </div>
              </div>
            </div>

            <div className="buyer-driver-vehicle-specs">
              <div className="buyer-spec-row">
                <span className="spec-name">{t('track.vehicle')}</span>
                <span className="spec-value">
                  {trackingOrder?.driver?.vehicleType || 'Tata Ace EV Cargo'}
                </span>
              </div>
              <div className="buyer-spec-row">
                <span className="spec-name">{t('track.registration')}</span>
                <span className="spec-value font-mono">
                  {trackingOrder?.driver?.vehicleNumber || 'TN 57 AB 1234'}
                </span>
              </div>
              <div className="buyer-spec-row">
                <span className="spec-name">{t('track.capacity')}</span>
                <span className="spec-value">
                  {trackingOrder?.driver?.capacityKg || 500} kg
                </span>
              </div>
              <div className="buyer-spec-row pin-highlight">
                <span className="spec-name">{t('track.deliveryPin')}</span>
                <span className="spec-value pin-code">
                  {trackingOrder?.driver?.deliveryPin || '4892'}
                </span>
              </div>
            </div>

            <div className="buyer-driver-actions">
              {trackingOrder?.driver?.phone ? (
                <a
                  href={`tel:${trackingOrder.driver.phone}`}
                  className="buyer-btn-primary full-width"
                >
                  <Phone size={15} />
                  <span>
                    {t('track.callDriver')} ({trackingOrder.driver.phone})
                  </span>
                </a>
              ) : (
                <div className="text-muted text-center py-2 fs-7">
                  Driver contact will activate once truck is dispatched.
                </div>
              )}
            </div>
          </div>

          {/* Farmer Summary for this dispatched batch */}
          <div className="buyer-farmer-dispatched-card">
            <div className="buyer-spec-row">
              <span className="spec-name">{t('track.produceGrower')}</span>
              <span className="spec-value">
                {trackingOrder?.farmer?.name || 'Local Farmer'} ({trackingOrder?.farmer?.location || 'Tamil Nadu'})
              </span>
            </div>
            <div className="buyer-spec-row">
              <span className="spec-name">{t('track.dispatchedFrom')}</span>
              <span className="spec-value">{trackingOrder?.hub || 'Central Supply Hub'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
