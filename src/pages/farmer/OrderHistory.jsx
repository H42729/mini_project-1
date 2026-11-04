// What this file does: Complete historical consignment ledger for the authenticated farmer.
// Stores and displays past orders persistently with sorting, status filtering, and slide-over order drawer.

import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useFarmer } from '../../context/FarmerContext';
import { formatDisplayOrderId } from '../../utils/orderId';
import OrderDetailsDrawer from '../../components/farmer/OrderDetailsDrawer';
import SectionHeader from '../../components/SectionHeader';
import { TableSkeleton } from '../../components/Skeleton';
import './OrderHistory.css';

export default function OrderHistory() {
  const {
    isDataLoading,
    orders,
    selectedOrderDetails,
    setSelectedOrderDetails,
    orderDrawerOpen,
    setOrderDrawerOpen,
    lang
  } = useFarmer();

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'active' | 'completed' | 'cancelled'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filtered orders
  const filteredOrders = useMemo(() => {
    let result = [...(orders || [])];

    // Filter by category
    if (activeFilter === 'active') {
      result = result.filter((o) => o.orderStatus === 'CONFIRMED' && o.deliveryStatus !== 'DELIVERED');
    } else if (activeFilter === 'completed') {
      result = result.filter((o) => o.deliveryStatus === 'DELIVERED');
    } else if (activeFilter === 'cancelled') {
      result = result.filter((o) => o.orderStatus === 'CANCELLED' || o.orderStatus === 'REJECTED');
    }

    // Search query: Order ID, Buyer Name, Crop Name
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (o) =>
          o.orderId.toLowerCase().includes(q) ||
          (o.buyerName && o.buyerName.toLowerCase().includes(q)) ||
          (o.buyerDetails?.businessName && o.buyerDetails.businessName.toLowerCase().includes(q)) ||
          (o.cropDetails?.name && o.cropDetails.name.toLowerCase().includes(q)) ||
          (o.cropName && o.cropName.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    } else {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return result;
  }, [orders, activeFilter, searchQuery, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const handleOpenOrder = (ord) => {
    setSelectedOrderDetails(ord);
    setOrderDrawerOpen(true);
  };

  return (
    <div className="buyer-view-container animate-fade-in">
      {/* 0. HEADER */}
      <SectionHeader
        className="buyer-view-header"
        title={lang === 'ta' ? 'விவசாயி ஆர்டர் வரலாறு' : 'Farmer Order History'}
        subtitle={
          lang === 'ta'
            ? 'உங்கள் அனைத்து கடந்தகால மற்றும் நடப்பு வணிக ஆர்டர்களின் முழுமையான பதிவுப் பட்டியல்.'
            : 'Permanent transactional ledger of all historical harvest shipments, driver dispatches, and payments.'
        }
        action={
          <div className="buyer-total-stock-badge">
            <History size={15} />
            <span>
              {lang === 'ta' ? 'மொத்த ஆர்டர்கள்: ' : 'Total Orders: '}
              {(orders || []).length}
            </span>
          </div>
        }
      />

      {/* 1. CONTROLS: FILTER PILLS, SEARCH, SORT */}
      <div className="farmer-orders-controls">
        <div className="buyer-order-tab-pills">
          <button
            type="button"
            className={`buyer-tab-pill ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => {
              setActiveFilter('all');
              setCurrentPage(1);
            }}
          >
            {lang === 'ta' ? 'அனைத்து ஆர்டர்கள்' : 'All Orders'} ({(orders || []).length})
          </button>
          <button
            type="button"
            className={`buyer-tab-pill ${activeFilter === 'active' ? 'active' : ''}`}
            onClick={() => {
              setActiveFilter('active');
              setCurrentPage(1);
            }}
          >
            {lang === 'ta' ? 'நடப்பு ஆர்டர்கள்' : 'Active Orders'} (
            {(orders || []).filter((o) => o.orderStatus === 'CONFIRMED' && o.deliveryStatus !== 'DELIVERED').length})
          </button>
          <button
            type="button"
            className={`buyer-tab-pill ${activeFilter === 'completed' ? 'active' : ''}`}
            onClick={() => {
              setActiveFilter('completed');
              setCurrentPage(1);
            }}
          >
            {lang === 'ta' ? 'நிறைவடைந்தவை' : 'Completed'} (
            {(orders || []).filter((o) => o.deliveryStatus === 'DELIVERED').length})
          </button>
          <button
            type="button"
            className={`buyer-tab-pill ${activeFilter === 'cancelled' ? 'active' : ''}`}
            onClick={() => {
              setActiveFilter('cancelled');
              setCurrentPage(1);
            }}
          >
            {lang === 'ta' ? 'ரத்து செய்யப்பட்டவை' : 'Cancelled'} (
            {(orders || []).filter((o) => o.orderStatus === 'CANCELLED' || o.orderStatus === 'REJECTED').length})
          </button>
        </div>

        <div className="d-flex align-items-center gap-2">
          <div className="input-group" style={{ maxWidth: 260 }}>
            <span className="input-group-text bg-white border-end-0">
              <Search size={14} className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder={lang === 'ta' ? 'ஆர்டர் எண், வாங்குபவர்...' : 'Order ID, buyer, crop...'}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <select
            className="form-select"
            style={{ width: 130 }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">{lang === 'ta' ? 'புதியவை' : 'Newest'}</option>
            <option value="oldest">{lang === 'ta' ? 'பழையவை' : 'Oldest'}</option>
          </select>
        </div>
      </div>

      {/* 2. RESPONSIVE TABLE & CARDS */}
      {isDataLoading && (!orders || orders.length === 0) ? (
        <TableSkeleton rows={4} columns={8} hasFilterBar={false} />
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-5 bg-white border rounded-3 text-muted">
          <History size={40} className="text-muted mb-2 opacity-50" />
          <p className="mb-0 fw-semibold">
            {lang === 'ta' ? 'ஆர்டர்கள் ஏதும் காணப்படவில்லை' : 'No order history records found matching this criteria.'}
          </p>
        </div>
      ) : (
        <div>
          {/* Desktop Table View */}
          <div className="farmer-table-responsive" style={{ borderRadius: totalPages > 1 ? '12px 12px 0 0' : '12px' }}>
            <table className="farmer-table">
              <thead>
                <tr>
                  <th>{lang === 'ta' ? 'ஆர்டர் எண்' : 'Order ID'}</th>
                  <th>{lang === 'ta' ? 'வாங்குபவர் பெயர்' : 'Buyer Name'}</th>
                  <th>{lang === 'ta' ? 'பயிர் விவரம்' : 'Crop'}</th>
                  <th>{lang === 'ta' ? 'அளவு' : 'Quantity'}</th>
                  <th>{lang === 'ta' ? 'கிலோ விலை' : 'Unit Price'}</th>
                  <th>{lang === 'ta' ? 'மொத்த மதிப்பு' : 'Total Value'}</th>
                  <th>{lang === 'ta' ? 'விநியோக தேதி' : 'Date'}</th>
                  <th>{lang === 'ta' ? 'ஆர்டர் நிலை' : 'Order Status'}</th>
                  <th>{lang === 'ta' ? 'பணம் நிலை' : 'Payment'}</th>
                  <th style={{ textAlign: 'right' }}>{lang === 'ta' ? 'நடவடிக்கை' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((ord) => {
                  const isDelivered = ord.deliveryStatus === 'DELIVERED';
                  const isCancelled = ord.orderStatus === 'CANCELLED' || ord.orderStatus === 'REJECTED';
                  const c = ord.cropDetails || {};

                  return (
                    <tr key={ord.id || ord._id || ord.orderId}>
                      <td>
                        <span className="font-mono fw-bold text-dark">{formatDisplayOrderId(ord.orderId)}</span>
                      </td>
                      <td>
                        <span className="fw-semibold">{ord.buyerName || ord.buyerDetails?.businessName || 'Commercial Buyer'}</span>
                      </td>
                      <td>
                        <span className="small">{c.name || ord.cropName}</span>
                      </td>
                      <td>
                        <span className="font-mono fw-bold">{ord.quantityKg ?? ord.quantity ?? 0} {ord.unit || 'Kg'}</span>
                      </td>
                      <td>
                        <span className="font-mono">₹{ord.pricePerUnit || c.pricePerKg || ord.offeredPrice || 0}</span>
                      </td>
                      <td>
                        <span className="font-mono fw-bold text-success">₹{(ord.totalPrice ?? ord.totalEstimatedValue ?? ((ord.quantityKg ?? ord.quantity ?? 0) * (ord.pricePerUnit || c.pricePerKg || ord.offeredPrice || 0))).toLocaleString('en-IN')}</span>
                      </td>
                      <td>
                        <span className="small text-muted">{ord.pickupDate || ord.preferredDeliveryDate || 'Recent'}</span>
                      </td>
                      <td>
                        <span className={`status-pill ${isDelivered ? 'success' : isCancelled ? 'danger' : 'info'}`}>
                          {ord.deliveryStatus || ord.orderStatus}
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill ${ord.paymentStatus === 'RELEASED_TO_FARMER' ? 'success' : 'pending'}`}>
                          {ord.paymentStatus === 'RELEASED_TO_FARMER' ? 'PAID' : 'ESCROW'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="buyer-btn-outline small"
                          onClick={() => handleOpenOrder(ord)}
                          title={lang === 'ta' ? 'விவரம்' : 'View'}
                        >
                          <Eye size={13} />
                          <span>{lang === 'ta' ? 'விவரம்' : 'View'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="farmer-mobile-cards-grid mt-3">
            {paginatedOrders.map((ord) => {
              const isDelivered = ord.deliveryStatus === 'DELIVERED';
              const isCancelled = ord.orderStatus === 'CANCELLED' || ord.orderStatus === 'REJECTED';
              const c = ord.cropDetails || {};

              return (
                <div key={ord.id || ord._id || ord.orderId} className="farmer-mobile-crop-card">
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="font-mono fw-bold fs-6">{formatDisplayOrderId(ord.orderId)}</span>
                    <span className={`status-pill ${isDelivered ? 'success' : isCancelled ? 'danger' : 'info'}`}>
                      {ord.deliveryStatus || ord.orderStatus}
                    </span>
                  </div>

                  <div className="fw-bold">{ord.buyerName || ord.buyerDetails?.businessName}</div>

                  <div className="mobile-card-body-grid">
                    <div>
                      <span className="text-muted small">{lang === 'ta' ? 'பயிர்' : 'Produce'}</span>
                      <div className="fw-semibold small">{c.name || ord.cropName}</div>
                    </div>
                    <div>
                      <span className="text-muted small">{lang === 'ta' ? 'அளவு' : 'Quantity'}</span>
                      <div className="fw-bold font-mono">{ord.quantityKg ?? ord.quantity ?? 0} {ord.unit || 'Kg'}</div>
                    </div>
                    <div>
                      <span className="text-muted small">{lang === 'ta' ? 'மொத்த தொகை' : 'Total Price'}</span>
                      <div className="fw-bold font-mono text-success">₹{(ord.totalPrice ?? ord.totalEstimatedValue ?? ((ord.quantityKg ?? ord.quantity ?? 0) * (ord.pricePerUnit || c.pricePerKg || ord.offeredPrice || 0))).toLocaleString('en-IN')}</div>
                    </div>
                    <div>
                      <span className="text-muted small">{lang === 'ta' ? 'பணம் நிலை' : 'Payment'}</span>
                      <div className="small fw-semibold">{ord.paymentStatus || 'ESCROW'}</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                    <span className="small text-muted">{ord.pickupDate || 'Recent'}</span>
                    <button
                      type="button"
                      className="buyer-btn-outline small"
                      onClick={() => handleOpenOrder(ord)}
                    >
                      <Eye size={13} />
                      <span>{lang === 'ta' ? 'முழு விவரம்' : 'View Details'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="farmer-pagination-row">
              <span className="text-muted small">
                {lang === 'ta' ? 'பக்கம்' : 'Page'} {currentPage} / {totalPages} ({filteredOrders.length} {lang === 'ta' ? 'ஆர்டர்கள்' : 'Orders'})
              </span>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="buyer-btn-outline small"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={14} />
                  <span>{lang === 'ta' ? 'முந்தைய' : 'Prev'}</span>
                </button>
                <button
                  type="button"
                  className="buyer-btn-outline small"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  <span>{lang === 'ta' ? 'அடுத்தது' : 'Next'}</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. ORDER DETAILS DRAWER */}
      <OrderDetailsDrawer
        order={selectedOrderDetails}
        isOpen={orderDrawerOpen}
        onClose={() => setOrderDrawerOpen(false)}
        lang={lang}
      />
    </div>
  );
}

