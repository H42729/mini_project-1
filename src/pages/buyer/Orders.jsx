// What this file does: Buyer orders management page tracking active, completed, and pending delivery orders.

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  Navigation
} from 'lucide-react';
import './Orders.css';
import { ROUTES } from '../../routes';
import { useBuyer } from '../../context/BuyerContext';

export default function Orders() {
  const navigate = useNavigate();
  const {
    orders,
    activeOrderFilter,
    setActiveOrderFilter,
    setSelectedTrackingOrderId,
    showToast,
    t
  } = useBuyer();

  return (
    <div className="buyer-view-container animate-fade-in">
      <div className="buyer-view-header">
        <div>
          <h1 className="buyer-view-title">{t('orders.title')}</h1>
          <p className="buyer-view-subtitle">{t('orders.subtitle')}</p>
        </div>
        <div className="buyer-order-tab-pills">
          <button
            type="button"
            className={`buyer-tab-pill ${activeOrderFilter === 'active' ? 'active' : ''}`}
            onClick={() => setActiveOrderFilter('active')}
          >
            {t('orders.tabActive', { n: orders.filter((o) => o.status !== 'delivered').length })}
          </button>
          <button
            type="button"
            className={`buyer-tab-pill ${activeOrderFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveOrderFilter('completed')}
          >
            {t('orders.tabCompleted', { n: orders.filter((o) => o.status === 'delivered').length })}
          </button>
          <button
            type="button"
            className={`buyer-tab-pill ${activeOrderFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveOrderFilter('all')}
          >
            {t('orders.tabAll', { n: orders.length })}
          </button>
        </div>
      </div>

      {/* Order Cards List */}
      <div className="buyer-order-list">
        {orders
          .filter((order) => {
            if (activeOrderFilter === 'active') return order.status !== 'delivered';
            if (activeOrderFilter === 'completed') return order.status === 'delivered';
            return true;
          })
          .map((order) => (
            <div key={order.orderId} className="buyer-order-card">
              <div className="buyer-order-card-top">
                <div className="buyer-order-id-group">
                  <span className="buyer-order-id">{order.orderId}</span>
                  <span className="buyer-order-time">{order.orderTime}</span>
                </div>
                <div className={`buyer-order-status-badge ${order.status}`}>
                  {order.status === 'in_transit' && (
                    <>
                      <span className="status-live-beacon" />
                      <span>{t('orders.statusOnTheWay')}</span>
                    </>
                  )}
                  {order.status === 'preparing' && (
                    <>
                      <Clock size={13} />
                      <span>{t('orders.statusPreparing')}</span>
                    </>
                  )}
                  {order.status === 'confirmed' && (
                    <>
                      <CheckCircle2 size={13} />
                      <span>{t('orders.statusConfirmed')}</span>
                    </>
                  )}
                  {order.status === 'delivered' && (
                    <>
                      <CheckCircle2 size={13} />
                      <span>{t('orders.statusDelivered')}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="buyer-order-card-body">
                <div className="buyer-order-produce-info">
                  <h3 className="buyer-order-produce-title">
                    {order.cropName} <span className="buyer-badge-tag">{order.grade}</span>
                  </h3>
                  <p className="buyer-order-produce-hub">
                    <MapPin size={13} /> {order.hub} • Farmer: {order.farmer.name}
                  </p>
                </div>

                <div className="buyer-order-metrics">
                  <div className="buyer-metric-item">
                    <span className="metric-label">{t('orders.quantity')}</span>
                    <span className="metric-val">{order.quantityKg} kg</span>
                  </div>
                  <div className="buyer-metric-item">
                    <span className="metric-label">{t('orders.rate')}</span>
                    <span className="metric-val">₹{order.unitPrice} / kg</span>
                  </div>
                  <div className="buyer-metric-item total">
                    <span className="metric-label">{t('orders.total')}</span>
                    <span className="metric-val total">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="buyer-order-card-footer">
                <div className="buyer-driver-mini">
                  <Truck size={14} />
                  <span>
                    {t('orders.driver')}{' '}
                    <strong>{order.driver.name}</strong> ({order.driver.vehicleNumber})
                  </span>
                </div>
                <div className="buyer-order-actions">
                  {order.status !== 'delivered' ? (
                    <button
                      type="button"
                      className="buyer-btn-primary small"
                      onClick={() => {
                        setSelectedTrackingOrderId(order.orderId);
                        navigate(ROUTES.BUYER_DASHBOARD_TRACK);
                      }}
                    >
                      <Navigation size={14} />
                      <span>{t('orders.trackDelivery')}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="buyer-btn-outline small"
                      onClick={() =>
                        showToast('info', t('orders.invoiceDownloaded', { id: order.orderId }))
                      }
                    >
                      <span>{t('orders.viewInvoice')}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
