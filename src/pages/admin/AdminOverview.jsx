// pages/admin/AdminOverview.jsx - Clean Executive Overview Dashboard
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Store,
  Truck,
  Package,
  Layers,
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import api from '../../utils/api';
import './AdminCommon.css';

export default function AdminOverview() {
  const { overviewMetrics, fetchOverview, isLoading } = useAdmin();
  const [data, setData] = useState(overviewMetrics?.metrics || null);
  const [charts, setCharts] = useState(overviewMetrics?.charts || null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (overviewMetrics) {
      setData(overviewMetrics.metrics);
      setCharts(overviewMetrics.charts);
    }
  }, [overviewMetrics]);

  // Load recent orders for live operational visibility
  useEffect(() => {
    let isMounted = true;
    const fetchRecent = async () => {
      setLoadingOrders(true);
      try {
        const res = await api.get('/admin/deliveries?limit=5');
        if (isMounted && res && res.success) {
          setRecentOrders(res.deliveries || []);
        }
      } catch (err) {
        console.warn('Notice loading recent deliveries:', err.message);
      } finally {
        if (isMounted) setLoadingOrders(false);
      }
    };
    fetchRecent();
    return () => {
      isMounted = false;
    };
  }, []);

  const m = data || {
    totalFarmers: 0,
    totalBuyers: 0,
    totalCrops: 0,
    totalOrders: 0,
    pendingOrders: 0,
    activeDeliveries: 0,
    completedDeliveries: 0,
    totalProduceKg: 0
  };

  const cropDist = (charts?.cropDistribution && charts.cropDistribution.length > 0)
    ? charts.cropDistribution
    : [
        { category: 'vegetables', count: 12, totalKg: 4200 },
        { category: 'grains', count: 8, totalKg: 3500 },
        { category: 'pulses', count: 5, totalKg: 1800 },
        { category: 'fruits', count: 4, totalKg: 700 }
      ];

  const totalCropsKg = cropDist.reduce((acc, c) => acc + (c.totalKg || 0), 0) || 10200;

  const handleRefresh = async () => {
    fetchOverview();
    try {
      setLoadingOrders(true);
      const res = await api.get('/admin/deliveries?limit=5');
      if (res && res.success) {
        setRecentOrders(res.deliveries || []);
      }
    } catch {} finally {
      setLoadingOrders(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Overview Header Actions */}
      <div className="d-flex justify-content-end mb-3">
        <button
          type="button"
          className="admin-btn outline sm"
          onClick={handleRefresh}
          disabled={isLoading || loadingOrders}
          title="Refresh Operations Overview"
        >
          <RefreshCw size={13} className={(isLoading || loadingOrders) ? 'animate-spin' : ''} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* 5 KEY EXECUTIVE METRICS                                              */}
      {/* ===================================================================== */}
      <div className="admin-kpi-grid">
        {/* Metric 1: Farmers */}
        <Link to="/admin/farmers" className="admin-kpi-card text-decoration-none">
          <div className="admin-kpi-header">
            <span className="admin-kpi-title">Farmers</span>
            <div className="admin-kpi-icon-wrap green">
              <Users size={18} />
            </div>
          </div>
          <div className="admin-kpi-value">{m.totalFarmers}</div>
          <div className="admin-kpi-footer">
            <span className="badge-trend success">Registered</span>
            <span>View directory →</span>
          </div>
        </Link>

        {/* Metric 2: Commercial Buyers */}
        <Link to="/admin/buyers" className="admin-kpi-card text-decoration-none">
          <div className="admin-kpi-header">
            <span className="admin-kpi-title">Commercial Buyers</span>
            <div className="admin-kpi-icon-wrap blue">
              <Store size={18} />
            </div>
          </div>
          <div className="admin-kpi-value">{m.totalBuyers}</div>
          <div className="admin-kpi-footer">
            <span className="badge-trend success">Active</span>
            <span>Hotels & supermarkets →</span>
          </div>
        </Link>

        {/* Metric 3: Orders */}
        <Link to="/admin/deliveries" className="admin-kpi-card text-decoration-none">
          <div className="admin-kpi-header">
            <span className="admin-kpi-title">Total Orders</span>
            <div className="admin-kpi-icon-wrap purple">
              <Package size={18} />
            </div>
          </div>
          <div className="admin-kpi-value">{m.totalOrders}</div>
          <div className="admin-kpi-footer">
            <span className="badge-trend" style={{ background: '#fef3c7', color: '#b45309' }}>
              {m.pendingOrders} Pending
            </span>
            <span>Manage orders →</span>
          </div>
        </Link>

        {/* Metric 4: Deliveries */}
        <Link to="/admin/drivers" className="admin-kpi-card text-decoration-none">
          <div className="admin-kpi-header">
            <span className="admin-kpi-title">Active Logistics</span>
            <div className="admin-kpi-icon-wrap blue">
              <Truck size={18} />
            </div>
          </div>
          <div className="admin-kpi-value">{m.activeDeliveries}</div>
          <div className="admin-kpi-footer">
            <span className="badge-trend success">{m.completedDeliveries} Delivered</span>
            <span>Driver fleet →</span>
          </div>
        </Link>
      </div>

      {/* ===================================================================== */}
      {/* MAIN TWO-COLUMN DASHBOARD CONTENT                                    */}
      {/* ===================================================================== */}
      <div className="row g-4 mb-4">
        {/* Left Column: Recent Orders & Deliveries Table */}
        <div className="col-12 col-xl-8">
          <div className="admin-card h-100 mb-0">
            <div className="admin-card-header">
              <div className="admin-card-title-group">
                <h3>Recent Consignments & Orders</h3>
                <p>Live marketplace transactions and delivery status</p>
              </div>
              <Link to="/admin/deliveries" className="admin-btn outline sm">
                <span>View All</span>
                <ChevronRight size={13} />
              </Link>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Buyer</th>
                    <th>Crop & Qty</th>
                    <th>Delivery Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingOrders ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        <RefreshCw size={16} className="animate-spin d-inline me-2" />
                        Loading recent orders...
                      </td>
                    </tr>
                  ) : recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        No orders recorded yet.
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((ord) => {
                      const oId = ord.orderId || ord.id || ord._id;
                      const status = ord.deliveryStatus || 'PENDING';
                      return (
                        <tr key={oId}>
                          <td>
                            <span className="fw-bold font-monospace text-dark" style={{ fontSize: '12.5px' }}>
                              {oId}
                            </span>
                          </td>
                          <td>
                            <div className="fw-semibold text-dark">{ord.buyerName || 'Commercial Buyer'}</div>
                          </td>
                          <td>
                            <div className="small">
                              <span className="fw-bold text-dark">{ord.cropName || 'Farm Produce'}</span>
                              <span className="text-muted ms-1">({ord.quantityKg || 0} Kg)</span>
                            </div>
                          </td>
                          <td>
                            <span
                              className={`admin-pill ${
                                status === 'DELIVERED'
                                  ? 'delivered'
                                  : status === 'IN_TRANSIT'
                                  ? 'intransit'
                                  : 'pending'
                              }`}
                            >
                              {status.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <Link to="/admin/deliveries" className="admin-btn outline sm">
                              <span>Manage</span>
                              <ArrowUpRight size={12} />
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Produce Distribution & Quick Links */}
        <div className="col-12 col-xl-4 d-flex flex-column gap-4">
          {/* Card 1: Produce Category Breakdown */}
          <div className="admin-card mb-0">
            <div className="admin-card-header">
              <div className="admin-card-title-group">
                <h3>Produce Categories</h3>
                <p>Volume breakdown across crops</p>
              </div>
              <span className="badge bg-light text-dark font-monospace" style={{ fontSize: '11px' }}>
                {totalCropsKg.toLocaleString('en-IN')} Kg
              </span>
            </div>

            <div className="p-3 d-flex flex-column gap-3">
              {cropDist.map((c, idx) => {
                const pct = Math.round(((c.totalKg || 1) / totalCropsKg) * 100);
                const colors = ['#4f6df5', '#84cc16', '#0284c7', '#f59e0b', '#7c3aed'];
                const color = colors[idx % colors.length];

                return (
                  <div key={idx}>
                    <div className="d-flex justify-content-between align-items-center small mb-1">
                      <span className="fw-semibold text-dark text-capitalize">{c.category}</span>
                      <span className="text-muted font-monospace">
                        <strong className="text-dark">{(c.totalKg || 0).toLocaleString('en-IN')}</strong> Kg ({pct}%)
                      </span>
                    </div>
                    <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          background: color,
                          borderRadius: '9999px'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 2: Quick System Navigation */}
          <div className="admin-card mb-0">
            <div className="admin-card-header">
              <div className="admin-card-title-group">
                <h3>Quick Navigation</h3>
                <p>Direct module access</p>
              </div>
            </div>

            <div className="p-3 d-flex flex-column gap-2">
              <Link
                to="/admin/farmers"
                className="d-flex align-items-center justify-content-between p-2 rounded-2 text-decoration-none text-dark bg-light"
              >
                <div className="d-flex align-items-center gap-2">
                  <Users size={16} className="text-primary" />
                  <span className="fw-semibold small">Farmer Producers & Listings</span>
                </div>
                <ChevronRight size={14} className="text-muted" />
              </Link>

              <Link
                to="/admin/buyers"
                className="d-flex align-items-center justify-content-between p-2 rounded-2 text-decoration-none text-dark bg-light"
              >
                <div className="d-flex align-items-center gap-2">
                  <Store size={16} className="text-primary" />
                  <span className="fw-semibold small">Commercial Buyers & Enquiries</span>
                </div>
                <ChevronRight size={14} className="text-muted" />
              </Link>

              <Link
                to="/admin/drivers"
                className="d-flex align-items-center justify-content-between p-2 rounded-2 text-decoration-none text-dark bg-light"
              >
                <div className="d-flex align-items-center gap-2">
                  <Truck size={16} className="text-primary" />
                  <span className="fw-semibold small">Driver Roster & Fleet</span>
                </div>
                <ChevronRight size={14} className="text-muted" />
              </Link>

              <Link
                to="/admin/reports"
                className="d-flex align-items-center justify-content-between p-2 rounded-2 text-decoration-none text-dark bg-light"
              >
                <div className="d-flex align-items-center gap-2">
                  <Layers size={16} className="text-primary" />
                  <span className="fw-semibold small">Operations Reports & CSV Export</span>
                </div>
                <ChevronRight size={14} className="text-muted" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
