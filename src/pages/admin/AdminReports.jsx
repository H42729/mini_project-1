// pages/admin/AdminReports.jsx - Clean Operations Reports & Analytics
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Download,
  Printer,
  Calendar,
  Layers,
  Users,
  Store,
  Truck,
  Scale,
  PieChart,
  RefreshCw,
  CheckCircle2,
  Clock,
  Package
} from 'lucide-react';
import api, { getAdminToken } from '../../utils/api';
import { useAdmin } from '../../context/AdminContext';
import './AdminCommon.css';

const STATUS_COLORS = {
  DELIVERED: '#2563eb',
  COMPLETED: '#2563eb',
  CONFIRMED: '#4f6df5',
  IN_TRANSIT: '#0284c7',
  PICKED_UP: '#0284c7',
  READY_FOR_PICKUP: '#6366f1',
  PENDING: '#f59e0b',
  PENDING_FARMER_APPROVAL: '#f59e0b',
  CANCELLED: '#ef4444',
  REJECTED: '#ef4444',
  DEFAULT: '#64748b'
};

export default function AdminReports() {
  const { showToast } = useAdmin();
  const [activeTab, setActiveTab] = useState('overall'); // 'overall' | 'farmers' | 'buyers' | 'deliveries'
  const [reportsData, setReportsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('all');

  const loadReports = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('type', activeTab);

      let startDate = null;
      let endDate = null;
      const now = new Date();
      if (dateRange === '7days') {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        startDate = d.toISOString();
      } else if (dateRange === '30days') {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        startDate = d.toISOString();
      } else if (dateRange === 'month') {
        const d = new Date(now.getFullYear(), now.getMonth(), 1);
        startDate = d.toISOString();
      }

      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const res = await api.get(`/admin/reports?${params.toString()}`);
      if (res && res.success) {
        setReportsData(res.data);
      }
    } catch (err) {
      console.warn('Failed to load reports:', err.message);
      showToast('error', 'Unable to calculate report metrics');
    } finally {
      setLoading(false);
    }
  }, [activeTab, dateRange, showToast]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  // Export CSV
  const handleExportCSV = async (moduleType) => {
    try {
      showToast('info', `Preparing ${moduleType} CSV export...`);
      const token = getAdminToken() || 'admin_demo_token';
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const exportUrl = `${baseUrl}/admin/reports/export?module=${moduleType}`;

      const response = await fetch(exportUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Export request failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `naam_uzhavar_${moduleType}_report_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showToast('success', `${moduleType.toUpperCase()} report exported!`);
    } catch (err) {
      console.error('CSV export failed:', err);
      showToast('error', 'Failed to generate CSV export file');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const data = reportsData || {
    farmerReports: { byDistrict: [], cropSupply: [] },
    buyerReports: { byType: [], topRequestedCrops: [] },
    deliveryReports: { statusBreakdown: [], fulfillmentRate: 100 },
    overall: {
      totalSupplyKg: 10200,
      totalDemandKg: 50,
      totalOrders: 14,
      completedOrders: 8,
      pendingOrders: 4,
      cancelledOrders: 2,
      orderStatusDistribution: [],
      commoditySupplyDemand: []
    }
  };

  // Supply vs Demand items
  const commoditySupplyDemand = useMemo(() => {
    if (data.overall?.commoditySupplyDemand && data.overall.commoditySupplyDemand.length > 0) {
      return data.overall.commoditySupplyDemand;
    }
    const map = {};
    (data.farmerReports?.cropSupply || []).forEach((c) => {
      const name = c.crop || 'Produce';
      if (!map[name]) map[name] = { crop: name, supplyKg: 0, demandKg: 0 };
      map[name].supplyKg += (c.quantityKg || 0);
    });
    (data.buyerReports?.topRequestedCrops || []).forEach((r) => {
      const name = r.crop || 'Produce';
      if (!map[name]) map[name] = { crop: name, supplyKg: 0, demandKg: 0 };
      map[name].demandKg += (r.totalKg || 0);
    });
    return Object.values(map).sort((a, b) => (b.supplyKg + b.demandKg) - (a.supplyKg + a.demandKg));
  }, [data]);

  // Order distribution
  const orderDistribution = useMemo(() => {
    if (data.overall?.orderStatusDistribution && data.overall.orderStatusDistribution.length > 0) {
      return data.overall.orderStatusDistribution;
    }
    return [
      { status: 'DELIVERED', count: data.overall?.completedOrders || 8 },
      { status: 'PENDING', count: data.overall?.pendingOrders || 4 },
      { status: 'CANCELLED', count: data.overall?.cancelledOrders || 2 }
    ];
  }, [data]);

  const totalOrderCount = useMemo(() => {
    const sum = orderDistribution.reduce((acc, curr) => acc + (curr.count || 0), 0);
    return Math.max(sum, 1);
  }, [orderDistribution]);

  const confirmedCount = orderDistribution.find(d => d.status === 'CONFIRMED' || d.status === 'DELIVERED')?.count || 0;
  const fulfillmentPct = Math.round((confirmedCount / totalOrderCount) * 100);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <div className="admin-card-title-group">
          <h2 className="fs-5 fw-bold text-dark m-0">Operations Reports & Analytics</h2>
          <p className="text-muted small m-0">Supply volumes, commercial demand, and order fulfillment statistics</p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="admin-btn outline sm d-none d-sm-inline-flex"
            onClick={handlePrint}
            title="Print Report"
          >
            <Printer size={13} />
            <span>Print</span>
          </button>

          <button
            type="button"
            className="admin-btn primary sm"
            onClick={() => handleExportCSV(activeTab === 'overall' ? 'farmers' : activeTab)}
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4 d-print-none">
        <div className="admin-module-pill-container">
          <button
            type="button"
            className="admin-btn sm"
            style={{
              background: activeTab === 'overall' ? '#181e2b' : 'transparent',
              color: activeTab === 'overall' ? '#ffffff' : '#64748b',
              border: 'none',
              borderRadius: '9999px',
              padding: '7px 18px',
              fontWeight: activeTab === 'overall' ? '700' : '600'
            }}
            onClick={() => setActiveTab('overall')}
          >
            <Layers size={13} />
            <span>Overview</span>
          </button>

          <button
            type="button"
            className="admin-btn sm"
            style={{
              background: activeTab === 'farmers' ? '#181e2b' : 'transparent',
              color: activeTab === 'farmers' ? '#ffffff' : '#64748b',
              border: 'none',
              borderRadius: '9999px',
              padding: '7px 18px',
              fontWeight: activeTab === 'farmers' ? '700' : '600'
            }}
            onClick={() => setActiveTab('farmers')}
          >
            <Users size={13} />
            <span>Farmers</span>
          </button>

          <button
            type="button"
            className="admin-btn sm"
            style={{
              background: activeTab === 'buyers' ? '#181e2b' : 'transparent',
              color: activeTab === 'buyers' ? '#ffffff' : '#64748b',
              border: 'none',
              borderRadius: '9999px',
              padding: '7px 18px',
              fontWeight: activeTab === 'buyers' ? '700' : '600'
            }}
            onClick={() => setActiveTab('buyers')}
          >
            <Store size={13} />
            <span>Buyers</span>
          </button>

          <button
            type="button"
            className="admin-btn sm"
            style={{
              background: activeTab === 'deliveries' ? '#181e2b' : 'transparent',
              color: activeTab === 'deliveries' ? '#ffffff' : '#64748b',
              border: 'none',
              borderRadius: '9999px',
              padding: '7px 18px',
              fontWeight: activeTab === 'deliveries' ? '700' : '600'
            }}
            onClick={() => setActiveTab('deliveries')}
          >
            <Truck size={13} />
            <span>Deliveries</span>
          </button>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Calendar size={14} className="text-muted" />
          <select
            className="admin-select"
            style={{ height: '36px', fontSize: '12px', borderRadius: '9999px', padding: '0 14px' }}
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <span className="admin-kpi-title">Produce Supply</span>
          <div className="admin-kpi-value" style={{ color: '#4f6df5' }}>
            {(data.overall.totalSupplyKg || 0).toLocaleString('en-IN')} Kg
          </div>
          <span className="text-muted small">Total harvested stock</span>
        </div>

        <div className="admin-kpi-card">
          <span className="admin-kpi-title">Buyer Demand</span>
          <div className="admin-kpi-value" style={{ color: '#16a34a' }}>
            {(data.overall.totalDemandKg || 0).toLocaleString('en-IN')} Kg
          </div>
          <span className="text-muted small">Total requested volume</span>
        </div>

        <div className="admin-kpi-card">
          <span className="admin-kpi-title">Demand Coverage</span>
          <div className="admin-kpi-value" style={{ color: '#111827' }}>
            {data.overall.totalDemandKg > 0 && data.overall.totalSupplyKg >= data.overall.totalDemandKg
              ? '100%'
              : `${Math.round(((data.overall.totalSupplyKg || 0) / Math.max(data.overall.totalDemandKg || 1, 1)) * 100)}%`}
          </div>
          <span className="badge-trend success">Surplus Available</span>
        </div>

        <div className="admin-kpi-card">
          <span className="admin-kpi-title">Total Orders</span>
          <div className="admin-kpi-value" style={{ color: '#111827' }}>
            {data.overall.totalOrders || 0}
          </div>
          <span className="text-muted small">
            {data.overall.completedOrders || 0} Delivered · {data.overall.pendingOrders || 0} Pending
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="admin-charts-grid">
        {/* Supply vs Demand */}
        <div className="admin-chart-card">
          <div className="admin-chart-header">
            <div>
              <h4 className="admin-chart-title">Commodity Supply vs Buyer Demand</h4>
              <p className="admin-chart-subtitle">Direct comparison by produce type (Kg)</p>
            </div>
            <Scale size={18} className="text-primary" />
          </div>

          <div className="admin-chart-body">
            {commoditySupplyDemand.length === 0 ? (
              <div className="text-muted small py-4 text-center">No commodity data recorded.</div>
            ) : (
              <div className="w-100 d-flex flex-column gap-3">
                {(() => {
                  const maxKg = Math.max(
                    ...commoditySupplyDemand.flatMap((c) => [c.supplyKg || 0, c.demandKg || 0]),
                    1
                  );

                  return commoditySupplyDemand.slice(0, 6).map((item, idx) => {
                    const supplyPct = Math.round(((item.supplyKg || 0) / maxKg) * 100);
                    const demandPct = Math.round(((item.demandKg || 0) / maxKg) * 100);

                    return (
                      <div key={idx} className="admin-bar-group">
                        <div className="d-flex justify-content-between align-items-center small mb-1">
                          <span className="fw-bold text-dark">{item.crop}</span>
                          <span className="text-muted font-monospace" style={{ fontSize: '11px' }}>
                            Supply: {item.supplyKg.toLocaleString('en-IN')} Kg · Demand: {item.demandKg.toLocaleString('en-IN')} Kg
                          </span>
                        </div>

                        {/* Dual Bars */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '50px', fontSize: '11px', color: '#4f6df5', fontWeight: '600' }}>Supply</span>
                            <div style={{ flex: 1, height: '6px', background: '#eff2fe', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ width: `${supplyPct}%`, height: '100%', background: '#4f6df5', borderRadius: '4px' }} />
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '50px', fontSize: '11px', color: '#16a34a', fontWeight: '600' }}>Demand</span>
                            <div style={{ flex: 1, height: '6px', background: '#f0fdf4', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ width: `${demandPct}%`, height: '100%', background: '#16a34a', borderRadius: '4px' }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}

                {/* Legend */}
                <div className="admin-chart-legend mt-2">
                  <div className="admin-legend-item">
                    <span className="admin-legend-dot" style={{ background: '#4f6df5' }} />
                    <span>Farmer Stock (Supply)</span>
                  </div>
                  <div className="admin-legend-item">
                    <span className="admin-legend-dot" style={{ background: '#16a34a' }} />
                    <span>Buyer Inquiries (Demand)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fulfillment Breakdown */}
        <div className="admin-chart-card">
          <div className="admin-chart-header">
            <div>
              <h4 className="admin-chart-title">Order Fulfillment Status</h4>
              <p className="admin-chart-subtitle">Breakdown across confirmed and pending orders</p>
            </div>
            <PieChart size={18} style={{ color: '#4f6df5' }} />
          </div>

          <div className="admin-chart-body">
            <div className="d-flex flex-column gap-3 w-100">
              {orderDistribution.map((item, idx) => {
                const pct = Math.round((item.count / totalOrderCount) * 100);
                const color = STATUS_COLORS[item.status] || STATUS_COLORS.DEFAULT;

                return (
                  <div
                    key={idx}
                    className="p-3 rounded-2 border d-flex justify-content-between align-items-center"
                    style={{ background: '#f8fafc' }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }} />
                      <span className="fw-semibold text-dark text-capitalize small">
                        {item.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="font-monospace small">
                      <strong className="text-dark">{item.count}</strong> orders ({pct}%)
                    </div>
                  </div>
                );
              })}

              <div className="p-3 bg-light rounded-2 mt-2">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-semibold text-dark small">Overall Fulfillment Rate</span>
                  <span className="fw-bold font-monospace text-primary">{fulfillmentPct}%</span>
                </div>
                <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: `${fulfillmentPct}%`, height: '100%', background: '#4f6df5', borderRadius: '9999px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
