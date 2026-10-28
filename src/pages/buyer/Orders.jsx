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
  PackageX,
  XCircle,
  AlertCircle
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
    handleOpenOrderWorkflowForOrder,
    t
  } = useBuyer();

  const orderList = useMemo(() => orders || [], [orders]);

  const counts = useMemo(() => {
    const isCompleted = (o) => o?.deliveryStatus === 'DELIVERED' || o?.status === 'delivered';
    const active = orderList.filter((o) => !isCompleted(o)).length;
    const completed = orderList.filter((o) => isCompleted(o)).length;
    return { active, completed, all: orderList.length };
  }, [orderList]);

  const filteredOrders = useMemo(() => {
    return orderList.filter((order) => {
      if (!order) return false;
      const isCompleted = order.deliveryStatus === 'DELIVERED' || order.status === 'delivered';
      if (activeOrderFilter === 'active') return !isCompleted;
      if (activeOrderFilter === 'completed') return isCompleted;
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
          filteredOrders.map((order) => {
            const isDelivered = order.deliveryStatus === 'DELIVERED' || order.status === 'delivered';
            const isPendingApproval = order.orderStatus === 'PENDING_FARMER_APPROVAL';
            const isRejected = order.orderStatus === 'REJECTED';
            const isConfirmedNoDelivery = order.orderStatus === 'CONFIRMED' && (!order.deliveryStatus || order.deliveryStatus === 'NOT_ASSIGNED');
            const canTrack = Boolean(order.deliveryStatus && order.deliveryStatus !== 'NOT_ASSIGNED' && !isRejected && !isPendingApproval);

            return (
              <div key={order.orderId} className="buyer-order-card">
                <div className="buyer-order-card-top">
                  <div className="buyer-order-id-group">
                    <span className="buyer-order-id">{order.orderId}</span>
                    <span className="buyer-order-time">{order.orderTime}</span>
                  </div>

                  {/* Dynamic Status Badge */}
                  <div className={`buyer-order-status-badge ${order.deliveryStatus || order.orderStatus || order.status}`}>
                    {isPendingApproval && (
                      <>
                        <Clock size={13} style={{ color: '#d97706' }} />
                        <span style={{ color: '#b45309' }}>Pending Farmer Approval</span>
                      </>
                    )}
                    {isRejected && (
                      <>
                        <XCircle size={13} style={{ color: '#dc2626' }} />
                        <span style={{ color: '#b91c1c' }}>Rejected by Farmer</span>
                      </>
                    )}
                    {isConfirmedNoDelivery && (
                      <>
                        <AlertCircle size={13} style={{ color: '#2563eb' }} />
                        <span style={{ color: '#1d4ed8' }}>Confirmed • Delivery Pending</span>
                      </>
                    )}
                    {!isPendingApproval && !isRejected && !isConfirmedNoDelivery && (
                      <>
                        {order.deliveryStatus === 'READY_FOR_PICKUP' && (
                          <>
                            <CheckCircle2 size={13} />
                            <span>Ready for Pickup</span>
                          </>
                        )}
                        {(order.deliveryStatus === 'PICKED_UP' || order.status === 'preparing') && (
                          <>
                            <Truck size={13} />
                            <span>Picked Up from Hub</span>
                          </>
                        )}
                        {(order.deliveryStatus === 'IN_TRANSIT' || order.status === 'in_transit') && (
                          <>
                            <span className="status-live-beacon" />
                            <span>In Transit</span>
                          </>
                        )}
                        {isDelivered && (
                          <>
                            <CheckCircle2 size={13} />
                            <span>Delivered</span>
                          </>
                        )}
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
                      <MapPin size={13} /> {order.location || order.hub || 'Dindigul Central'} • Farmer: {order.farmer?.name || 'Local Farmer'}
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
                    {/* Invoice view is always available */}
                    <button
                      type="button"
                      className="buyer-btn-outline small"
                      onClick={() => navigate(`${ROUTES.BUYER_DASHBOARD_INVOICES}?orderId=${order.orderId}`)}
                      title="View Farm Tax Invoice"
                    >
                      <Receipt size={14} />
                      <span>{t('orders.viewInvoice') || 'Invoice'}</span>
                    </button>

                    {/* Step 3: Pending farmer approval demo button */}
                    {isPendingApproval && (
                      <button
                        type="button"
                        className="buyer-btn-primary small"
                        style={{ background: '#d97706' }}
                        onClick={() => handleOpenOrderWorkflowForOrder(order)}
                        title="Simulate Farmer Approval for Demo"
                      >
                        <Clock size={14} />
                        <span>Demo Approval</span>
                      </button>
                    )}

                    {/* Step 4: Confirmed awaiting delivery arrangement demo button */}
                    {isConfirmedNoDelivery && (
                      <button
                        type="button"
                        className="buyer-btn-primary small"
                        style={{ background: '#2563eb' }}
                        onClick={() => handleOpenOrderWorkflowForOrder(order)}
                        title="Arrange EV Delivery for Demo"
                      >
                        <Truck size={14} />
                        <span>Arrange Delivery</span>
                      </button>
                    )}

                    {/* Step 5: Active delivery tracking */}
                    {canTrack && (
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
                    )}
                  </div>
                </div>
              </div>
            );
          })
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
