// What this file does: Buyer orders management page tracking active, completed, and pending delivery orders.

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  Navigation,
  Receipt,
  PackageX
} from 'lucide-react';
import './Orders.css';
import { ROUTES } from '../../routes';
import { useBuyer } from '../../context/BuyerContext';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/Button';

export default function Orders() {
  const navigate = useNavigate();
  const {
    orders,
    activeOrderFilter,
    setActiveOrderFilter,
    setSelectedTrackingOrderId,
    t
  } = useBuyer();

  const orderList = useMemo(() => orders || [], [orders]);

  const counts = useMemo(() => {
    const active = orderList.filter((o) => o?.status !== 'delivered').length;
    const completed = orderList.filter((o) => o?.status === 'delivered').length;
    return { active, completed, all: orderList.length };
  }, [orderList]);

  const filteredOrders = useMemo(() => {
    return orderList.filter((order) => {
      if (!order) return false;
      if (activeOrderFilter === 'active') return order.status !== 'delivered';
      if (activeOrderFilter === 'completed') return order.status === 'delivered';
      return true;
    });
  }, [orderList, activeOrderFilter]);

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
            {t('orders.tabActive', { n: counts.active })}
          </button>
          <button
            type="button"
            className={`buyer-tab-pill ${activeOrderFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveOrderFilter('completed')}
          >
            {t('orders.tabCompleted', { n: counts.completed })}
          </button>
          <button
            type="button"
            className={`buyer-tab-pill ${activeOrderFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveOrderFilter('all')}
          >
            {t('orders.tabAll', { n: counts.all })}
          </button>
        </div>
      </div>

      {/* Order Cards List */}
      <div className="buyer-order-list">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
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
                  {!['in_transit', 'preparing', 'confirmed', 'delivered'].includes(order.status) && (
                    <>
                      <Clock size={13} />
                      <span>{order.status || 'Processing'}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="buyer-order-card-body">
                <div className="buyer-order-produce-info">
                  <h3 className="buyer-order-produce-title">
                    {order.cropName}{' '}
                    {order.grade && <span className="buyer-badge-tag">{order.grade}</span>}
                  </h3>
                  <p className="buyer-order-produce-hub">
                    <MapPin size={13} /> {order.hub || 'Hub'} • Farmer: {order.farmer?.name || 'Local Farmer'}
                  </p>
                </div>

                <div className="buyer-order-metrics">
                  <div className="buyer-metric-item">
                    <span className="metric-label">{t('orders.quantity')}</span>
                    <span className="metric-val">{order.quantityKg ?? 0} kg</span>
                  </div>
                  <div className="buyer-metric-item">
                    <span className="metric-label">{t('orders.rate')}</span>
                    <span className="metric-val">₹{order.unitPrice ?? 0} / kg</span>
                  </div>
                  <div className="buyer-metric-item total">
                    <span className="metric-label">{t('orders.total')}</span>
                    <span className="metric-val total">
                      ₹{Number(order.totalPrice || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="buyer-order-card-footer">
                <div className="buyer-driver-mini">
                  <Truck size={14} />
                  <span>
                    {t('orders.driver')}{' '}
                    <strong>{order.driver?.name || 'Assigning EV Driver...'}</strong>{' '}
                    {order.driver?.vehicleNumber ? `(${order.driver.vehicleNumber})` : ''}
                  </span>
                </div>
                <div className="buyer-order-actions">
                  {order.status !== 'delivered' ? (
                    <>
                      <button
                        type="button"
                        className="buyer-btn-outline small"
                        onClick={() => navigate(`${ROUTES.BUYER_DASHBOARD_INVOICES}?orderId=${order.orderId}`)}
                        title="View Farm Tax Invoice"
                      >
                        <Receipt size={14} />
                        <span>{t('orders.viewInvoice') || 'Invoice'}</span>
                      </button>
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
                    </>
                  ) : (
                    <button
                      type="button"
                      className="buyer-btn-primary small"
                      onClick={() => navigate(`${ROUTES.BUYER_DASHBOARD_INVOICES}?orderId=${order.orderId}`)}
                    >
                      <Receipt size={14} />
                      <span>{t('orders.viewInvoice')}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            icon={<PackageX size={36} />}
            title={
              activeOrderFilter === 'active'
                ? 'No active shipments'
                : activeOrderFilter === 'completed'
                ? 'No completed orders yet'
                : 'No orders found'
            }
            description={
              activeOrderFilter === 'active'
                ? 'When you accept farm produce lots from the marketplace, your active shipments will appear here.'
                : 'Your delivered orders and farm tax receipts will be archived here once completed.'
            }
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
        )}
      </div>
    </div>
  );
}
