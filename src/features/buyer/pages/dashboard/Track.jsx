import React from 'react';
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
import { useBuyer } from '../../context/BuyerContext';

export default function Track() {
  const {
    orders,
    selectedTrackingOrderId,
    setSelectedTrackingOrderId,
    trackingOrder,
    profile,
    showToast,
    t
  } = useBuyer();

  return (
    <div className="buyer-view-container animate-fade-in">
      <div className="buyer-view-header">
        <div>
          <h1 className="buyer-view-title">
            {t('track.title')}
          </h1>
          <p className="buyer-view-subtitle">
            {t('track.subtitle')}
          </p>
        </div>

        {/* Active Tracking Order Switcher */}
        <div className="buyer-active-order-picker">
          <span className="buyer-picker-label">
            {t('track.trackingOrder')}
          </span>
          <div className="buyer-select-wrapper">
            <select
              className="buyer-select-input"
              value={selectedTrackingOrderId}
              onChange={(e) => setSelectedTrackingOrderId(e.target.value)}
            >
              {orders.map((o) => (
                <option key={o.orderId} value={o.orderId}>
                  {o.orderId} — {o.cropName} ({o.quantityKg} kg)
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="buyer-select-arrow" />
          </div>
        </div>
      </div>

      {/* 5-STAGE STATUS INDICATOR */}
      <div className="buyer-tracking-stepper-card">
        <div className="buyer-stepper-inner">
          <div className="buyer-step completed">
            <div className="buyer-step-circle">
              <Check size={14} />
            </div>
            <span className="buyer-step-title">
              {t('track.stepConfirmed')}
            </span>
            <span className="buyer-step-time">08:30 AM</span>
          </div>

          <div className="buyer-step-line completed" />

          <div className="buyer-step completed">
            <div className="buyer-step-circle">
              <Check size={14} />
            </div>
            <span className="buyer-step-title">
              {t('track.stepPreparing')}
            </span>
            <span className="buyer-step-time">08:45 AM</span>
          </div>

          <div className="buyer-step-line completed" />

          <div className="buyer-step completed">
            <div className="buyer-step-circle">
              <Check size={14} />
            </div>
            <span className="buyer-step-title">
              {t('track.stepAssigned')}
            </span>
            <span className="buyer-step-time">09:05 AM</span>
          </div>

          <div className="buyer-step-line active" />

          <div className="buyer-step active">
            <div className="buyer-step-circle pulse-circle">
              <Truck size={15} />
            </div>
            <span className="buyer-step-title active">
              {t('track.stepOnTheWay')}
            </span>
            <span className="buyer-step-time">
              {trackingOrder.liveTracking.estimatedMinutes} min ETA
            </span>
          </div>

          <div className="buyer-step-line pending" />

          <div className="buyer-step pending">
            <div className="buyer-step-circle">
              <MapPin size={14} />
            </div>
            <span className="buyer-step-title">
              {t('track.stepDelivered')}
            </span>
            <span className="buyer-step-time">Est. 09:45 AM</span>
          </div>
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
              <Zap size={14} /> {t('track.speedBattery', { speed: trackingOrder.liveTracking.speedKmh, battery: trackingOrder.liveTracking.batteryPct })}
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
                  <stop offset="0%" stopColor="#0f4a30" />
                  <stop offset="50%" stopColor="#15803d" />
                  <stop offset="100%" stopColor="#059669" />
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

              {/* Waypoint 1: Dindigul Supply Hub (Origin) */}
              <g transform="translate(140, 100)">
                <circle r="18" fill="rgba(15, 74, 48, 0.15)" />
                <circle r="10" fill="#0f4a30" />
                <circle r="4" fill="#ffffff" />
                <text x="0" y="-22" textAnchor="middle" className="svg-node-label font-bold">
                  Dindigul Central Hub
                </text>
                <text x="0" y="-8" textAnchor="middle" className="svg-node-sub">
                  Origin • 08:45 AM
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

              {/* Destination: Grand Palace Hotel (Madurai) */}
              <g transform="translate(660, 380)">
                <circle r="22" fill="rgba(220, 38, 38, 0.12)" />
                <circle r="11" fill="#dc2626" />
                <circle r="4" fill="#ffffff" />
                <text x="0" y="32" textAnchor="middle" className="svg-node-label font-bold">
                  {profile.shopName || profile.name}
                </text>
                <text x="0" y="46" textAnchor="middle" className="svg-node-sub">
                  Destination • Loading Bay 2
                </text>
              </g>

              {/* Moving Delivery EV Vehicle Marker */}
              <g
                transform="translate(480, 275)"
                filter="url(#shadowFilter)"
                className="buyer-ev-marker-group"
              >
                <circle r="26" fill="rgba(16, 185, 129, 0.22)" className="animate-ping-slow" />
                <rect
                  x="-24"
                  y="-18"
                  width="48"
                  height="36"
                  rx="8"
                  fill="#0f4a30"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                />
                <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="16">
                  🚚
                </text>

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
                    EV In Transit • 42 km/h
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
              onClick={() =>
                showToast('info', t('track.telemetryRefreshed'))
              }
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
                <span className="buyer-status-label">
                  {t('track.currentStatus')}
                </span>
                <h4 className="buyer-status-main">{trackingOrder.liveTracking.currentStatus}</h4>
              </div>
            </div>

            <div className="buyer-status-grid">
              <div className="buyer-status-stat">
                <span className="stat-label">
                  {t('track.currentLocation')}
                </span>
                <span className="stat-val">{trackingOrder.liveTracking.currentLocation}</span>
              </div>
              <div className="buyer-status-stat highlight">
                <span className="stat-label">
                  {t('track.estimatedArrival')}
                </span>
                <span className="stat-val highlight">
                  {trackingOrder.liveTracking.estimatedMinutes} min
                </span>
              </div>
              <div className="buyer-status-stat">
                <span className="stat-label">
                  {t('track.distanceRemaining')}
                </span>
                <span className="stat-val">{trackingOrder.liveTracking.distanceKm} km</span>
              </div>
              <div className="buyer-status-stat">
                <span className="stat-label">
                  {t('track.lastUpdated')}
                </span>
                <span className="stat-val">{trackingOrder.liveTracking.lastUpdated}</span>
              </div>
            </div>
          </div>

          {/* Compact Driver Details Card */}
          <div className="buyer-driver-card">
            <div className="buyer-driver-card-header">
              <span className="buyer-driver-heading">
                {t('track.driverDetails')}
              </span>
              <span className="buyer-vehicle-tag">{t('track.electricCargo')}</span>
            </div>

            <div className="buyer-driver-profile-row">
              <div className="buyer-driver-avatar">
                <User size={22} />
              </div>
              <div className="buyer-driver-info">
                <h4 className="buyer-driver-name">{trackingOrder.driver.name}</h4>
                <div className="buyer-driver-rating">
                  <span>★ {trackingOrder.driver.rating}</span>
                  <span className="buyer-dot">•</span>
                  <span>{t('track.deliveriesCount')}</span>
                </div>
              </div>
            </div>

            <div className="buyer-driver-vehicle-specs">
              <div className="buyer-spec-row">
                <span className="spec-name">{t('track.vehicle')}</span>
                <span className="spec-value">{trackingOrder.driver.vehicleType}</span>
              </div>
              <div className="buyer-spec-row">
                <span className="spec-name">{t('track.registration')}</span>
                <span className="spec-value font-mono">{trackingOrder.driver.vehicleNumber}</span>
              </div>
              <div className="buyer-spec-row">
                <span className="spec-name">{t('track.capacity')}</span>
                <span className="spec-value">{trackingOrder.driver.capacityKg} kg</span>
              </div>
              <div className="buyer-spec-row pin-highlight">
                <span className="spec-name">{t('track.deliveryPin')}</span>
                <span className="spec-value pin-code">{trackingOrder.driver.deliveryPin}</span>
              </div>
            </div>

            <div className="buyer-driver-actions">
              <a
                href={`tel:${trackingOrder.driver.phone}`}
                className="buyer-btn-primary full-width"
              >
                <Phone size={15} />
                <span>
                  {t('track.callDriver')} ({trackingOrder.driver.phone})
                </span>
              </a>
            </div>
          </div>

          {/* Farmer Summary for this dispatched batch */}
          <div className="buyer-farmer-dispatched-card">
            <div className="buyer-spec-row">
              <span className="spec-name">{t('track.produceGrower')}</span>
              <span className="spec-value">
                {trackingOrder.farmer.name} ({trackingOrder.farmer.location})
              </span>
            </div>
            <div className="buyer-spec-row">
              <span className="spec-name">{t('track.dispatchedFrom')}</span>
              <span className="spec-value">{trackingOrder.hub}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
