// What this file does: Simple, clean invoices management page for commercial buyers. Keeps only important details: Invoice #, Date, Order Ref, Produce, Quantity, Rate, Total Amount, Farmer/Hub, and Status.

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Receipt,
  Search,
  Printer,
  X,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  FileText,
  Sprout
} from 'lucide-react';
import './Invoices.css';
import { useBuyer } from '../../context/BuyerContext';
import { ROUTES } from '../../routes';

// Seed historical delivered invoices for accounting records
const ARCHIVED_INVOICES = [
  {
    id: 'INV-2026-00088',
    orderId: 'NU-2026-00088',
    invoiceDate: '15 Oct 2026',
    cropName: 'Robusta Golden Bananas',
    tamilCropName: 'ரோபஸ்டா வாழை',
    grade: 'Grade A',
    quantityKg: 300,
    unitPrice: 38,
    totalAmount: 11400,
    status: 'paid',
    hub: 'Trichy Cauvery Hub',
    farmer: {
      name: 'N. Balakrishnan',
      phone: '+91 94438 90123',
      location: 'Thottiyam, Tiruchirappalli'
    }
  },
  {
    id: 'INV-2026-00075',
    orderId: 'NU-2026-00075',
    invoiceDate: '12 Oct 2026',
    cropName: 'Hosur Green Capsicum',
    tamilCropName: 'குடைமிளகாய்',
    grade: 'Grade A',
    quantityKg: 120,
    unitPrice: 52,
    totalAmount: 6240,
    status: 'paid',
    hub: 'Hosur Agri Hub',
    farmer: {
      name: 'V. Senthil',
      phone: '+91 97890 12345',
      location: 'Kelamangalam, Krishnagiri'
    }
  }
];

export default function Invoices() {
  const [searchParams] = useSearchParams();
  const urlOrderId = searchParams.get('orderId');

  const { orders, profile, t, lang } = useBuyer();

  const [searchQuery, setSearchQuery] = useState(urlOrderId || '');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'paid' | 'pending'
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Unified list of invoices from orders + archival records
  const allInvoices = useMemo(() => {
    const liveInvoices = orders.map((order, idx) => {
      const cleanNum = order.orderId.replace(/[^0-9]/g, '') || `${100 + idx}`;
      const isPaid = order.status === 'delivered';
      return {
        id: `INV-2026-${cleanNum.slice(-5).padStart(5, '0')}`,
        orderId: order.orderId,
        invoiceDate: order.orderTime || 'Today',
        cropName: order.cropName,
        tamilCropName: order.tamilCropName,
        grade: order.grade,
        quantityKg: order.quantityKg,
        unitPrice: order.unitPrice,
        totalAmount: order.totalPrice,
        status: isPaid ? 'paid' : 'pending',
        hub: order.hub,
        farmer: {
          name: order.farmer?.name || 'Local Producer',
          phone: order.farmer?.phone || '+91 98400 00000',
          location: order.farmer?.location || 'Tamil Nadu'
        }
      };
    });

    return [...liveInvoices, ...ARCHIVED_INVOICES];
  }, [orders]);

  // Automatically open preview if orderId passed via query string
  useEffect(() => {
    if (urlOrderId) {
      const matched = allInvoices.find(
        (inv) => inv.orderId === urlOrderId || inv.id === urlOrderId
      );
      if (matched) {
        setSelectedInvoice(matched);
      }
    }
  }, [urlOrderId, allInvoices]);

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return allInvoices.filter((inv) => {
      if (activeTab === 'paid' && inv.status !== 'paid') return false;
      if (activeTab === 'pending' && inv.status !== 'pending') return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        inv.id.toLowerCase().includes(q) ||
        inv.orderId.toLowerCase().includes(q) ||
        inv.cropName.toLowerCase().includes(q) ||
        (inv.tamilCropName && inv.tamilCropName.toLowerCase().includes(q)) ||
        inv.farmer.name.toLowerCase().includes(q) ||
        inv.hub.toLowerCase().includes(q)
      );
    });
  }, [allInvoices, activeTab, searchQuery]);

  // Aggregate stats (Simple: Total, Paid, Pending)
  const stats = useMemo(() => {
    let totalBilled = 0;
    let paidBilled = 0;
    let pendingBilled = 0;

    allInvoices.forEach((inv) => {
      totalBilled += inv.totalAmount;
      if (inv.status === 'paid') {
        paidBilled += inv.totalAmount;
      } else {
        pendingBilled += inv.totalAmount;
      }
    });

    return { totalBilled, paidBilled, pendingBilled };
  }, [allInvoices]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="buyer-view-container buyer-invoices-view animate-fade-in">
      {/* 1. Header Section */}
      <div className="buyer-view-header">
        <div>
          <h1 className="buyer-view-title">{lang === 'ta' ? 'விலைப்பட்டியல்கள்' : 'Invoices'}</h1>
          <p className="buyer-view-subtitle">
            {lang === 'ta'
              ? 'விளைபொருள் கொள்முதல் பில்கள் மற்றும் ரசீதுகள்.'
              : 'Direct farm produce procurement invoices and receipts.'}
          </p>
        </div>
      </div>

      {/* 2. Simple 3-Metric Summary Bar */}
      <div className="simple-invoices-stats-bar">
        <div className="simple-stat-box">
          <span className="simple-stat-lbl">{lang === 'ta' ? 'மொத்த தொகை' : 'Total Billed'}</span>
          <span className="simple-stat-num">₹{stats.totalBilled.toLocaleString('en-IN')}</span>
        </div>
        <div className="simple-stat-divider" />
        <div className="simple-stat-box">
          <span className="simple-stat-lbl">{lang === 'ta' ? 'செலுத்தப்பட்டது' : 'Paid'}</span>
          <span className="simple-stat-num text-success">₹{stats.paidBilled.toLocaleString('en-IN')}</span>
        </div>
        <div className="simple-stat-divider" />
        <div className="simple-stat-box">
          <span className="simple-stat-lbl">{lang === 'ta' ? 'நிலுவை' : 'Pending'}</span>
          <span className="simple-stat-num text-amber">₹{stats.pendingBilled.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* 3. Search & Tabs Filter Bar */}
      <div className="simple-invoices-filter-row">
        <div className="simple-invoices-search-box">
          <Search size={16} className="simple-invoices-search-icon" />
          <input
            type="text"
            className="simple-invoices-search-input"
            placeholder={
              lang === 'ta'
                ? 'பில் எண், ஆர்டர் எண் அல்லது பயிர் பெயர் தேடவும்...'
                : 'Search by invoice #, order ID, or crop name...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="simple-search-clear-btn"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="simple-invoices-tabs">
          <button
            type="button"
            className={`simple-inv-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            {lang === 'ta' ? `அனைத்தும் (${allInvoices.length})` : `All (${allInvoices.length})`}
          </button>
          <button
            type="button"
            className={`simple-inv-tab ${activeTab === 'paid' ? 'active' : ''}`}
            onClick={() => setActiveTab('paid')}
          >
            {lang === 'ta'
              ? `செலுத்தப்பட்டவை (${allInvoices.filter((i) => i.status === 'paid').length})`
              : `Paid (${allInvoices.filter((i) => i.status === 'paid').length})`}
          </button>
          <button
            type="button"
            className={`simple-inv-tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            {lang === 'ta'
              ? `நிலுவை (${allInvoices.filter((i) => i.status === 'pending').length})`
              : `Pending (${allInvoices.filter((i) => i.status === 'pending').length})`}
          </button>
        </div>
      </div>

      {/* 4. Simple Clean Invoices List */}
      <div className="simple-invoices-list">
        {filteredInvoices.length === 0 ? (
          <div className="buyer-empty-state-card">
            <Receipt size={32} className="text-muted mb-2" />
            <h3 className="buyer-empty-title">
              {lang === 'ta' ? 'பில்கள் எதுவும் கிடைக்கவில்லை' : 'No invoices found'}
            </h3>
            <p className="buyer-empty-desc">
              {lang === 'ta' ? 'தேடல் சொற்களை மாற்றி முயற்சிக்கவும்.' : 'Try adjusting your search criteria.'}
            </p>
          </div>
        ) : (
          filteredInvoices.map((inv) => (
            <div
              key={inv.id}
              className={`simple-invoice-item ${inv.orderId === urlOrderId ? 'highlighted' : ''}`}
            >
              <div className="simple-item-main">
                <div className="simple-item-meta">
                  <span className="simple-item-num">{inv.id}</span>
                  <Link
                    to={ROUTES.BUYER_DASHBOARD_ORDERS}
                    className="simple-item-order-ref"
                    title="View order"
                  >
                    Order: {inv.orderId}
                  </Link>
                  <span className="simple-item-date">
                    <Calendar size={13} /> {inv.invoiceDate}
                  </span>
                </div>

                <div className="simple-item-produce-row">
                  <div className="simple-item-crop">
                    <span className="simple-crop-name">{inv.cropName}</span>
                    <span className="simple-crop-grade">{inv.grade}</span>
                  </div>
                  <span className="simple-item-hub">
                    <MapPin size={13} /> {inv.farmer.name} • {inv.hub}
                  </span>
                </div>
              </div>

              <div className="simple-item-details">
                <div className="simple-item-qty">
                  <span className="simple-qty-val">{inv.quantityKg} kg</span>
                  <span className="simple-rate-val">₹{inv.unitPrice} / kg</span>
                </div>

                <div className="simple-item-total">
                  <span className="simple-total-amount">₹{inv.totalAmount.toLocaleString('en-IN')}</span>
                  <span className={`simple-status-tag ${inv.status}`}>
                    {inv.status === 'paid' ? (
                      <>
                        <CheckCircle2 size={12} />
                        <span>{lang === 'ta' ? 'செலுத்தப்பட்டது' : 'Paid'}</span>
                      </>
                    ) : (
                      <>
                        <Clock size={12} />
                        <span>{lang === 'ta' ? 'நிலுவை' : 'Pending'}</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="simple-item-actions">
                  <button
                    type="button"
                    className="simple-btn-view"
                    onClick={() => setSelectedInvoice(inv)}
                  >
                    <FileText size={14} />
                    <span>{lang === 'ta' ? 'பில் காண்க' : 'View Invoice'}</span>
                  </button>
                  <button
                    type="button"
                    className="simple-btn-print"
                    onClick={() => {
                      setSelectedInvoice(inv);
                      setTimeout(() => window.print(), 250);
                    }}
                    title="Print"
                  >
                    <Printer size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ====================================================================
          5. SIMPLE INVOICE PREVIEW MODAL (ONLY IMPORTANT DETAILS)
          ==================================================================== */}
      {selectedInvoice && (
        <div
          className="buyer-invoice-modal-overlay"
          onClick={() => setSelectedInvoice(null)}
        >
          <div
            className="buyer-invoice-modal-content simple"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="simple-modal-header">
              <div className="simple-modal-title">
                <Receipt size={18} className="text-success" />
                <span>{lang === 'ta' ? 'விலைப்பட்டியல்' : 'Invoice'} #{selectedInvoice.id}</span>
              </div>
              <div className="simple-modal-actions">
                <button
                  type="button"
                  className="simple-print-action-btn"
                  onClick={handlePrint}
                >
                  <Printer size={14} />
                  <span>{lang === 'ta' ? 'அச்சிடுக' : 'Print'}</span>
                </button>
                <button
                  type="button"
                  className="buyer-invoice-modal-close-btn"
                  onClick={() => setSelectedInvoice(null)}
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Clean Printable Invoice Document */}
            <div className="buyer-invoice-paper-wrapper">
              <div className="simple-invoice-sheet">
                {/* Header: Logo, Company & Status */}
                <div className="simple-sheet-top">
                  <div className="simple-sheet-brand">
                    <img src="/logo.jpg" alt="Naam Uzhavar" className="simple-sheet-logo" />
                    <div>
                      <h2 className="simple-sheet-title">Naam Uzhavar</h2>
                      <span className="simple-sheet-sub">
                        {lang === 'ta' ? 'நேரடி விவசாய கொள்முதல் மையம்' : 'Direct Farm Produce Hub'}
                      </span>
                    </div>
                  </div>
                  <span className={`simple-sheet-status ${selectedInvoice.status}`}>
                    {selectedInvoice.status === 'paid'
                      ? (lang === 'ta' ? '✓ செலுத்தப்பட்டது' : '✓ Paid')
                      : (lang === 'ta' ? '• நிலுவை' : '• Pending')}
                  </span>
                </div>

                <div className="simple-sheet-divider" />

                {/* Key Information Row: Invoice #, Date, Order Ref */}
                <div className="simple-sheet-meta-grid">
                  <div className="simple-sheet-meta-item">
                    <span className="smeta-lbl">{lang === 'ta' ? 'பில் எண்' : 'Invoice No'}</span>
                    <strong className="smeta-val mono">{selectedInvoice.id}</strong>
                  </div>
                  <div className="simple-sheet-meta-item">
                    <span className="smeta-lbl">{lang === 'ta' ? 'தேதி' : 'Date'}</span>
                    <strong className="smeta-val">{selectedInvoice.invoiceDate}</strong>
                  </div>
                  <div className="simple-sheet-meta-item">
                    <span className="smeta-lbl">{lang === 'ta' ? 'ஆர்டர் எண்' : 'Order ID'}</span>
                    <strong className="smeta-val mono">{selectedInvoice.orderId}</strong>
                  </div>
                </div>

                {/* Buyer & Farmer Info */}
                <div className="simple-sheet-parties">
                  <div className="simple-party-card">
                    <span className="party-title">{lang === 'ta' ? 'வாங்குபவர்' : 'Billed To'}</span>
                    <strong className="party-name">
                      {profile.shopName || profile.businessName || profile.fullName || 'Grand Palace Hotel'}
                    </strong>
                    <span className="party-sub">
                      {profile.contactPerson || profile.fullName} • {profile.phone}
                    </span>
                  </div>

                  <div className="simple-party-card">
                    <span className="party-title">{lang === 'ta' ? 'விவசாயி & மையம்' : 'Farmer & Hub'}</span>
                    <strong className="party-name">
                      🌾 {selectedInvoice.farmer.name}
                    </strong>
                    <span className="party-sub">
                      {selectedInvoice.hub} • {selectedInvoice.farmer.location}
                    </span>
                  </div>
                </div>

                {/* Clean Item Table */}
                <div className="simple-table-wrapper">
                  <table className="simple-table">
                    <thead>
                      <tr>
                        <th>{lang === 'ta' ? 'விளைபொருள்' : 'Produce Item'}</th>
                        <th className="text-center">{lang === 'ta' ? 'தரம்' : 'Grade'}</th>
                        <th className="text-right">{lang === 'ta' ? 'அளவு' : 'Quantity'}</th>
                        <th className="text-right">{lang === 'ta' ? 'விலை / கிலோ' : 'Rate / kg'}</th>
                        <th className="text-right">{lang === 'ta' ? 'மொத்தம்' : 'Amount'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <strong>{selectedInvoice.cropName}</strong>
                          {selectedInvoice.tamilCropName && (
                            <span className="simple-tamil-text"> ({selectedInvoice.tamilCropName})</span>
                          )}
                        </td>
                        <td className="text-center">
                          <span className="simple-grade-pill">{selectedInvoice.grade}</span>
                        </td>
                        <td className="text-right">{selectedInvoice.quantityKg} kg</td>
                        <td className="text-right">₹{selectedInvoice.unitPrice}</td>
                        <td className="text-right font-bold">
                          ₹{selectedInvoice.totalAmount.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Grand Total Row */}
                <div className="simple-grand-total-row">
                  <span className="gtotal-lbl">{lang === 'ta' ? 'மொத்த தொகை' : 'Total Amount'}:</span>
                  <span className="gtotal-val">₹{selectedInvoice.totalAmount.toLocaleString('en-IN')}</span>
                </div>

                {/* Minimal Footer Note */}
                <div className="simple-sheet-footer">
                  <span>
                    {lang === 'ta'
                      ? '✓ நேரடி விவசாய கொள்முதல் • இடைத்தரகர் இல்லை'
                      : '✓ Direct Farmer Procurement • Zero Middleman Brokerage'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
