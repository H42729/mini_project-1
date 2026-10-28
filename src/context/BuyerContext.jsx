// What this file does: Global React context managing commercial buyer state, profile, crop listings, orders, and messages.

/* oxlint-disable react/only-export-components */
import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes';
import { useT } from '../hooks/useT';
import { INITIAL_CROPS, INITIAL_ORDERS, INITIAL_MESSAGES } from '../data/mockData';
import { api, getToken, removeToken } from '../utils/api';

const BuyerContext = createContext(null);

export function BuyerProvider({ children, buyerProfile, onLogout }) {
  const navigate = useNavigate();
  const { t, lang, toggleLang } = useT('buyerDashboard');

  // Full Buyer Profile State
  const [profile, setProfile] = useState(() => {
    let saved = null;
    try {
      const raw =
        localStorage.getItem('buyer_current_profile') ||
        localStorage.getItem('buyer_registered_profile');
      if (raw) saved = JSON.parse(raw);
    } catch (e) {
      console.warn('Could not read saved profile:', e);
    }

    const firmName =
      saved?.shopName ||
      saved?.businessName ||
      buyerProfile?.shopName ||
      buyerProfile?.businessName ||
      'Grand Palace Luxury Dining';

    let resolvedContactPerson = saved?.contactPerson;
    if (!resolvedContactPerson || resolvedContactPerson === firmName) {
      if (saved?.name && saved.name !== firmName) {
        resolvedContactPerson = saved.name;
      } else if (saved?.fullName && saved.fullName !== firmName) {
        resolvedContactPerson = saved.fullName;
      } else {
        const email = saved?.email || buyerProfile?.email || '';
        if (email.includes('@')) {
          const raw = email.split('@')[0].replace(/\d+/g, '').replace(/[._-]/g, ' ').trim();
          if (raw.toLowerCase() === 'vimalku' || raw.toLowerCase() === 'vimal') {
            resolvedContactPerson = 'Vimal Kumar';
          } else if (raw.length >= 2) {
            resolvedContactPerson = raw
              .split(' ')
              .filter(Boolean)
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
              .join(' ');
          }
        }
      }
    }

    if (!resolvedContactPerson || resolvedContactPerson === firmName) {
      resolvedContactPerson = buyerProfile?.contactPerson || 'Mr. S. Rajesh (Procurement Head)';
    }

    // Auto-heal localStorage if contactPerson was previously corrupted by businessName
    try {
      if (saved && (saved.contactPerson === firmName || !saved.contactPerson)) {
        const healed = {
          ...saved,
          contactPerson: resolvedContactPerson,
          name: resolvedContactPerson,
          fullName: resolvedContactPerson,
          shopName: firmName,
          businessName: firmName
        };
        localStorage.setItem('buyer_current_profile', JSON.stringify(healed));
      }
    } catch {
      // ignore
    }

    return {
      name: resolvedContactPerson,
      fullName: resolvedContactPerson,
      contactPerson: resolvedContactPerson,
      shopName: firmName,
      businessName: firmName,
      phone: saved?.phone || buyerProfile?.phone || '+91 98401 23456',
      email: saved?.email || buyerProfile?.email || 'procurement@grandpalace.in',
      buyerType: saved?.buyerType || buyerProfile?.buyerType || 'hotel',
      businessType:
        saved?.businessType ||
        (saved?.buyerType
          ? `${saved.buyerType.toUpperCase()} Commercial Kitchen`
          : buyerProfile?.businessType || 'Hotel & Commercial Kitchen'),
      address:
        saved?.address ||
        buyerProfile?.address ||
        'Grand Palace Luxury Dining, Bypass Road, Madurai - 625016',
      gstin: saved?.gstin || buyerProfile?.gstin || '33AAAAA0000A1Z5',
      photo:
        saved?.photo ||
        saved?.photoPreview ||
        buyerProfile?.photo ||
        buyerProfile?.photoPreview ||
        'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=300&auto=format&fit=crop&q=80',
      photoPreview:
        saved?.photoPreview ||
        saved?.photo ||
        buyerProfile?.photoPreview ||
        buyerProfile?.photo ||
        'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=300&auto=format&fit=crop&q=80'
    };
  });

  // Sync when buyerProfile prop changes
  const prevBuyerProfileRef = useRef(buyerProfile);
  useEffect(() => {
    if (buyerProfile && prevBuyerProfileRef.current !== buyerProfile) {
      prevBuyerProfileRef.current = buyerProfile;
      setProfile((prev) => ({
        ...prev,
        ...buyerProfile,
        shopName: buyerProfile.shopName || buyerProfile.name || prev.shopName,
        contactPerson:
          buyerProfile.contactPerson ||
          buyerProfile.fullName ||
          buyerProfile.name ||
          prev.contactPerson,
        photo: buyerProfile.photo || buyerProfile.photoPreview || prev.photo,
        photoPreview:
          buyerProfile.photoPreview || buyerProfile.photo || prev.photoPreview
      }));
    }
  }, [buyerProfile]);

  // Fetch latest authenticated profile from backend if token exists
  useEffect(() => {
    async function syncBackendProfile() {
      try {
        if (!getToken()) return;
        const res = await api.get('/profile');
        if (res && res.buyer) {
          const b = res.buyer;
          setProfile((prev) => {
            const updated = {
              ...prev,
              ...b,
              contactPerson: b.contactPerson || prev.contactPerson,
              name: b.contactPerson || prev.name,
              fullName: b.contactPerson || prev.fullName,
              shopName: b.shopName || b.businessName || prev.shopName,
              businessName: b.businessName || prev.businessName,
              photo: b.avatar || b.photo || prev.photo,
              photoPreview: b.avatar || b.photoPreview || prev.photoPreview
            };
            try {
              localStorage.setItem('buyer_current_profile', JSON.stringify(updated));
            } catch {
              // ignore
            }
            return updated;
          });
        }
      } catch {
        // offline or unauthenticated fallback
      }
    }
    syncBackendProfile();
  }, []);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState(null);
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (type, text) => {
    setToastMessage({ type, text });
  };

  // Edit Profile Modal
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [signOutModalOpen, setSignOutModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(profile);
  const photoInputRef = useRef(null);

  const handleOpenEditProfile = () => {
    setEditFormData(profile);
    setEditProfileOpen(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const updated = {
      ...editFormData,
      name: editFormData.contactPerson || editFormData.name,
      fullName: editFormData.contactPerson || editFormData.fullName,
      contactPerson: editFormData.contactPerson || editFormData.name,
      shopName: editFormData.shopName || editFormData.businessName,
      businessName: editFormData.shopName || editFormData.businessName
    };
    setProfile(updated);
    try {
      localStorage.setItem('buyer_current_profile', JSON.stringify(updated));
      localStorage.setItem('buyer_registered_profile', JSON.stringify(updated));
    } catch {
      // ignore storage error
    }

    if (getToken()) {
      try {
        await api.put('/profile', {
          businessName: updated.businessName,
          shopName: updated.shopName,
          contactPerson: updated.contactPerson,
          name: updated.name,
          fullName: updated.fullName,
          buyerType: updated.buyerType,
          phone: updated.phone,
          email: updated.email,
          address: updated.address,
          gstin: updated.gstin,
          avatar: updated.photo || updated.photoPreview
        });
      } catch {
        // ignore background sync error
      }
    }

    setEditProfileOpen(false);
    showToast(
      'success',
      t('modals.profileUpdatedToast')
    );
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const newPhoto = uploadEvent.target.result;
      const updated = { ...profile, photo: newPhoto, photoPreview: newPhoto };
      setProfile(updated);
      setEditFormData((prev) => ({ ...prev, photo: newPhoto, photoPreview: newPhoto }));
      try {
        localStorage.setItem('buyer_current_profile', JSON.stringify(updated));
        localStorage.setItem('buyer_registered_profile', JSON.stringify(updated));
      } catch {
        // ignore storage error
      }
      showToast(
        'success',
        t('modals.profilePhotoToast')
      );
    };
    reader.readAsDataURL(file);
  };

  // Crops Data & Filters
  const [crops, setCrops] = useState(INITIAL_CROPS);
  const [declinedCropIds, setDeclinedCropIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Produce Action Modals & Order Confirmation Workflow State
  const [declineModalCrop, setDeclineModalCrop] = useState(null);
  const [workflowCrop, setWorkflowCrop] = useState(null);
  const [workflowModalOpen, setWorkflowModalOpen] = useState(false);
  const [workflowStep, setWorkflowStep] = useState('CONFIRMATION'); // 'CONFIRMATION' | 'PENDING_APPROVAL' | 'CONFIRMED' | 'DELIVERY_ARRANGED' | 'REJECTED'
  const [activeWorkflowOrder, setActiveWorkflowOrder] = useState(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Legacy produce modal state preserved for backwards compatibility
  const [acceptModalCrop, setAcceptModalCrop] = useState(null);
  const [acceptedQuantity, setAcceptedQuantity] = useState(200);
  const [farmerDetailsCrop, setFarmerDetailsCrop] = useState(null);
  const [orderConfirmationData, setOrderConfirmationData] = useState(null);

  // Orders State
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [activeOrderFilter, setActiveOrderFilter] = useState('active');
  const [selectedTrackingOrderId, setSelectedTrackingOrderId] = useState('NU-2026-00124');

  // Messages State
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [replyText, setReplyText] = useState('');


  // Filter crops
  const filteredCrops = useMemo(() => {
    return (crops || [])
      .filter((crop) => crop && !declinedCropIds?.includes(crop.id))
      .filter((crop) => {
        if (!searchQuery?.trim()) return true;
        const q = searchQuery.toLowerCase().trim();
        return (
          (crop.name || '').toLowerCase().includes(q) ||
          (crop.tamilName || '').toLowerCase().includes(q) ||
          (crop.location || '').toLowerCase().includes(q) ||
          (crop.hubName || '').toLowerCase().includes(q) ||
          (crop.category || '').toLowerCase().includes(q)
        );
      })
      .filter((crop) => {
        if (!crop) return false;
        if (selectedCategory === 'all') return true;
        if (selectedCategory === 'vegetables') return (crop.category || '').toLowerCase() === 'vegetables';
        const g = (crop.grade || '').trim().toLowerCase();
        if (selectedCategory === 'grade_a') return g === 'grade a';
        if (selectedCategory === 'grade_b') return g === 'grade b';
        if (selectedCategory === 'grade_c') return g === 'grade c';
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') return (Number(a.pricePerKg) || 0) - (Number(b.pricePerKg) || 0);
        if (sortBy === 'price_high') return (Number(b.pricePerKg) || 0) - (Number(a.pricePerKg) || 0);
        if (sortBy === 'qty_high') return (Number(b.availableKg) || 0) - (Number(a.availableKg) || 0);
        return 0;
      });
  }, [crops, declinedCropIds, searchQuery, selectedCategory, sortBy]);

  // Selected Order for Live Tracking
  const trackingOrder = useMemo(() => {
    return orders.find((o) => o.orderId === selectedTrackingOrderId) || orders[0];
  }, [orders, selectedTrackingOrderId]);

  // Modal actions
  const handleOpenDecline = (crop) => {
    setDeclineModalCrop(crop);
  };

  const handleConfirmDecline = () => {
    if (!declineModalCrop) return;
    const cropId = declineModalCrop.id;
    const cropName = declineModalCrop.name;
    setDeclinedCropIds((prev) => [...prev, cropId]);
    setDeclineModalCrop(null);
    showToast(
      'info',
      t('modals.declineSuccessToast', { name: cropName })
    );
  };

  // Step 1: When the buyer clicks Accept on a crop card
  // Do not navigate directly to Delivery Status; open the Order Confirmation modal
  const handleOpenAccept = (crop) => {
    if (!crop) return;
    setWorkflowCrop(crop);
    setAcceptedQuantity(Math.min(200, crop.availableKg || 200));
    setWorkflowStep('CONFIRMATION');
    setActiveWorkflowOrder(null);
    setIsSubmittingOrder(false);
    setWorkflowModalOpen(true);
  };

  const handleCloseWorkflow = () => {
    setWorkflowModalOpen(false);
    setWorkflowCrop(null);
    setActiveWorkflowOrder(null);
    setWorkflowStep('CONFIRMATION');
    setIsSubmittingOrder(false);
  };

  // Step 2: Confirm & Place Order
  const handleConfirmCreateOrder = async ({ quantityKg, deliveryAddress, preferredDeliveryDate, notes }) => {
    if (!workflowCrop) return;
    const qty = Number(quantityKg);
    const available = Number(workflowCrop.availableKg || workflowCrop.quantityKg || 0);

    if (!qty || qty <= 0 || isNaN(qty)) {
      showToast('error', 'Please enter a valid quantity in kg.');
      return;
    }
    if (qty > available) {
      showToast('error', `Selected ${qty} kg exceeds available stock of ${available} kg.`);
      return;
    }

    const resolvedAddress = (deliveryAddress || profile.address || 'Grand Palace Luxury Dining, Bypass Road, Madurai - 625016').trim();
    if (!resolvedAddress) {
      showToast('error', 'Please provide a valid delivery address.');
      return;
    }

    setIsSubmittingOrder(true);
    const unitPrice = Number(workflowCrop.pricePerKg) || 0;
    const totalPrice = unitPrice * qty;
    const generatedOrderId = `NU-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const assignedDriver = {
      name: 'Kumar M.',
      phone: '+91 94432 11098',
      vehicleType: 'Tata Ace EV Cargo',
      vehicleNumber: 'TN 57 AB 1234',
      rating: 4.9,
      capacityKg: 500,
      deliveryPin: `${Math.floor(1000 + Math.random() * 9000)}`
    };

    let newOrder = {
      orderId: generatedOrderId,
      cropName: workflowCrop.name,
      tamilCropName: workflowCrop.tamilName || '',
      grade: workflowCrop.grade || 'Grade A',
      image: workflowCrop.image,
      quantityKg: qty,
      unitPrice,
      totalPrice,
      orderTime: 'Just now',
      orderStatus: 'PENDING_FARMER_APPROVAL',
      deliveryStatus: 'NOT_ASSIGNED',
      status: 'PENDING_FARMER_APPROVAL',
      deliveryAddress: resolvedAddress,
      preferredDeliveryDate: preferredDeliveryDate || new Date().toISOString().split('T')[0],
      notes: notes ? notes.trim() : '',
      location: workflowCrop.location || workflowCrop.hubName || 'Dindigul Central',
      hub: workflowCrop.location || workflowCrop.hubName || 'Dindigul Central',
      farmer: {
        name: workflowCrop.farmer?.name || workflowCrop.farmerName || 'Ravi Kumar',
        phone: workflowCrop.farmer?.phone || '+91 98421 78210',
        location: workflowCrop.farmer?.village || workflowCrop.location || 'Siluvathur, Dindigul'
      },
      driver: assignedDriver,
      liveTracking: {
        currentStatus: 'Order Placed — Pending Farmer Confirmation',
        currentLocation: `${workflowCrop.location || workflowCrop.hubName || 'Dindigul Central'} Hub`,
        estimatedMinutes: 45,
        distanceKm: workflowCrop.distanceKm || 18,
        lastUpdated: 'Just now',
        speedKmh: 0,
        batteryPct: 92,
        origin: workflowCrop.location || workflowCrop.hubName || 'Dindigul Central',
        destination: resolvedAddress
      }
    };

    // If backend is authenticated/reachable, call POST /api/orders
    if (getToken()) {
      try {
        const res = await api.post('/orders', {
          cropId: workflowCrop._id || workflowCrop.id,
          quantityKg: qty,
          deliveryAddress: resolvedAddress,
          preferredDeliveryDate: newOrder.preferredDeliveryDate,
          notes: newOrder.notes
        });
        if (res && res.order) {
          newOrder = {
            ...newOrder,
            ...res.order,
            orderId: res.order.orderId || newOrder.orderId,
            orderStatus: res.order.orderStatus || 'PENDING_FARMER_APPROVAL',
            deliveryStatus: res.order.deliveryStatus || 'NOT_ASSIGNED',
            farmer: newOrder.farmer,
            cropName: res.order.crop?.name || newOrder.cropName,
            driver: { ...newOrder.driver, ...(res.order.driver || {}) }
          };
        }
      } catch (err) {
        console.warn('Backend order placement warning, falling back to local state:', err);
      }
    }

    // Deduct stock from client crop listing
    setCrops((prev) =>
      prev.map((c) =>
        c.id === workflowCrop.id
          ? { ...c, availableKg: Math.max(0, (c.availableKg || c.quantityKg || 0) - qty) }
          : c
      )
    );

    setOrders((prev) => [newOrder, ...prev]);
    setActiveWorkflowOrder(newOrder);
    setWorkflowStep('PENDING_APPROVAL');
    setIsSubmittingOrder(false);
    showToast('success', `Order ${newOrder.orderId} submitted! Awaiting farmer confirmation.`);
  };

  // Step 3: Demo Farmer Approval & Rejection Simulation
  const handleSimulateFarmerApproval = async (orderId) => {
    if (getToken()) {
      try {
        await api.patch(`/orders/${orderId}/simulate-farmer`, { action: 'APPROVE' });
      } catch (err) {
        console.warn('Backend simulate-farmer approval warning:', err);
      }
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === orderId
          ? {
              ...o,
              orderStatus: 'CONFIRMED',
              status: 'CONFIRMED',
              liveTracking: {
                ...o.liveTracking,
                currentStatus: 'Farmer Approved — Ready for Delivery Arrangement'
              }
            }
          : o
      )
    );

    setActiveWorkflowOrder((prev) =>
      prev && prev.orderId === orderId
        ? {
            ...prev,
            orderStatus: 'CONFIRMED',
            status: 'CONFIRMED',
            liveTracking: {
              ...prev.liveTracking,
              currentStatus: 'Farmer Approved — Ready for Delivery Arrangement'
            }
          }
        : prev
    );

    setWorkflowStep('CONFIRMED');
    showToast('success', 'Farmer approval simulated successfully! Order confirmed.');
  };

  const handleSimulateFarmerRejection = async (orderId) => {
    if (getToken()) {
      try {
        await api.patch(`/orders/${orderId}/simulate-farmer`, { action: 'REJECT' });
      } catch (err) {
        console.warn('Backend simulate-farmer rejection warning:', err);
      }
    }

    // Restore stock if workflowCrop matches
    if (workflowCrop && activeWorkflowOrder) {
      const qty = Number(activeWorkflowOrder.quantityKg) || 0;
      setCrops((prev) =>
        prev.map((c) =>
          c.id === workflowCrop.id
            ? { ...c, availableKg: (c.availableKg || 0) + qty }
            : c
        )
      );
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === orderId
          ? {
              ...o,
              orderStatus: 'REJECTED',
              status: 'REJECTED',
              deliveryStatus: 'NOT_ASSIGNED',
              liveTracking: {
                ...o.liveTracking,
                currentStatus: 'Order Rejected by Farmer'
              }
            }
          : o
      )
    );

    setActiveWorkflowOrder((prev) =>
      prev && prev.orderId === orderId
        ? {
            ...prev,
            orderStatus: 'REJECTED',
            status: 'REJECTED',
            deliveryStatus: 'NOT_ASSIGNED',
            liveTracking: {
              ...prev.liveTracking,
              currentStatus: 'Order Rejected by Farmer'
            }
          }
        : prev
    );

    setWorkflowStep('REJECTED');
    showToast('info', 'Farmer rejection simulated. Delivery tracking prevented.');
  };

  // Step 4: Demo Delivery Arrangement
  const handleSimulateDeliveryArrangement = async (orderId) => {
    if (getToken()) {
      try {
        await api.patch(`/orders/${orderId}/simulate-delivery-arrangement`);
      } catch (err) {
        console.warn('Backend simulate-delivery-arrangement warning:', err);
      }
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === orderId
          ? {
              ...o,
              deliveryStatus: 'READY_FOR_PICKUP',
              status: 'READY_FOR_PICKUP',
              liveTracking: {
                ...o.liveTracking,
                currentStatus: 'Consignment Prepared — Ready for EV Driver Pickup'
              }
            }
          : o
      )
    );

    setActiveWorkflowOrder((prev) =>
      prev && prev.orderId === orderId
        ? {
            ...prev,
            deliveryStatus: 'READY_FOR_PICKUP',
            status: 'READY_FOR_PICKUP',
            liveTracking: {
              ...prev.liveTracking,
              currentStatus: 'Consignment Prepared — Ready for EV Driver Pickup'
            }
          }
        : prev
    );

    setWorkflowStep('DELIVERY_ARRANGED');
    showToast('success', 'Demo delivery arrangement completed! Ready for pickup.');
  };

  // Step 5: Connect to Existing Delivery Status Page
  const handleGoToDeliveryStatus = (orderId) => {
    handleCloseWorkflow();
    setSelectedTrackingOrderId(orderId);
    navigate(ROUTES.BUYER_DASHBOARD_TRACK);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Step 6: Advance Demo Delivery Stages Sequentially
  const handleAdvanceDeliveryStep = async (orderId) => {
    const targetOrder = orders.find((o) => o.orderId === orderId);
    if (!targetOrder) return;

    const transitions = {
      READY_FOR_PICKUP: 'PICKED_UP',
      PICKED_UP: 'IN_TRANSIT',
      IN_TRANSIT: 'DELIVERED'
    };

    const currentStatus = targetOrder.deliveryStatus || 'READY_FOR_PICKUP';
    const nextStatus = transitions[currentStatus];

    if (!nextStatus) {
      showToast('info', `Order ${orderId} is already at final milestone (${currentStatus}).`);
      return;
    }

    if (getToken()) {
      try {
        await api.patch(`/orders/${orderId}/simulate-delivery-step`, { targetStatus: nextStatus });
      } catch (err) {
        console.warn('Backend simulate-delivery-step warning:', err);
      }
    }

    let statusDescription = 'In Transit';
    let minutesEta = 15;
    let speed = 42;
    if (nextStatus === 'PICKED_UP') {
      statusDescription = 'EV Cargo Picked Up from Hub — Cleared Checkpoint';
      minutesEta = 35;
      speed = 30;
    } else if (nextStatus === 'IN_TRANSIT') {
      statusDescription = 'EV Cargo In Transit on Highway Corridor';
      minutesEta = 18;
      speed = 45;
    } else if (nextStatus === 'DELIVERED') {
      statusDescription = 'Consignment Delivered and Verified at Destination Bay';
      minutesEta = 0;
      speed = 0;
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === orderId
          ? {
              ...o,
              deliveryStatus: nextStatus,
              status: nextStatus === 'DELIVERED' ? 'delivered' : nextStatus === 'IN_TRANSIT' ? 'in_transit' : 'preparing',
              liveTracking: {
                ...o.liveTracking,
                currentStatus: statusDescription,
                estimatedMinutes: minutesEta,
                speedKmh: speed,
                lastUpdated: 'Just now'
              }
            }
          : o
      )
    );

    const friendlyLabels = {
      PICKED_UP: 'Picked Up by Driver',
      IN_TRANSIT: 'In Transit',
      DELIVERED: 'Delivered'
    };

    showToast('success', `Demo: Advanced milestone to "${friendlyLabels[nextStatus] || nextStatus}".`);
  };

  // Re-open workflow modal for existing order (e.g., from Orders list)
  const handleOpenOrderWorkflowForOrder = (order) => {
    if (!order) return;
    setActiveWorkflowOrder(order);
    const fakeCrop = {
      id: order.crop?._id || order.crop || order.cropId || `crop-${order.orderId}`,
      name: order.cropName,
      tamilName: order.tamilCropName,
      image: order.image || order.crop?.image,
      pricePerKg: order.unitPrice,
      availableKg: order.quantityKg,
      grade: order.grade,
      location: order.hub || order.location,
      farmer: order.farmer
    };
    setWorkflowCrop(fakeCrop);
    setAcceptedQuantity(order.quantityKg);

    if (order.orderStatus === 'PENDING_FARMER_APPROVAL') {
      setWorkflowStep('PENDING_APPROVAL');
    } else if (order.orderStatus === 'REJECTED') {
      setWorkflowStep('REJECTED');
    } else if (order.deliveryStatus === 'READY_FOR_PICKUP') {
      setWorkflowStep('DELIVERY_ARRANGED');
    } else if (order.orderStatus === 'CONFIRMED' && order.deliveryStatus === 'NOT_ASSIGNED') {
      setWorkflowStep('CONFIRMED');
    } else {
      setWorkflowStep('DELIVERY_ARRANGED');
    }

    setWorkflowModalOpen(true);
  };

  // Legacy modal helpers maintained for backward compatibility
  const handleProceedToFarmer = () => {
    if (!acceptModalCrop) return;
    setFarmerDetailsCrop({
      ...acceptModalCrop,
      selectedQty: acceptedQuantity,
      estimatedTotal: acceptedQuantity * acceptModalCrop.pricePerKg
    });
    setAcceptModalCrop(null);
  };

  const handleConfirmOrder = (targetCrop) => {
    handleOpenAccept(targetCrop || farmerDetailsCrop || acceptModalCrop);
  };

  const handleGoToTracking = (orderId) => {
    handleGoToDeliveryStatus(orderId);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    const newMsg = {
      id: `m-${Date.now()}`,
      sender: profile.shopName || profile.name || buyerProfile?.name,
      role: 'Procurement Team',
      time: 'Just now',
      text: replyText.trim(),
      isBuyer: true
    };
    setMessages((prev) => [...prev, newMsg]);
    setReplyText('');
  };

  const handleSignOut = () => {
    setSignOutModalOpen(false);
    try {
      localStorage.removeItem('buyer_current_profile');
      localStorage.removeItem('buyer_registered_profile');
      removeToken();
      sessionStorage.setItem('buyer_explicit_signout', 'true');
    } catch {
      // ignore storage error
    }
    if (onLogout) {
      onLogout();
    } else {
      navigate(ROUTES.BUYER_LOGIN, { replace: true });
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const value = {
    profile,
    setProfile,
    buyerProfile,
    crops,
    setCrops,
    declinedCropIds,
    setDeclinedCropIds,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    filteredCrops,
    orders,
    setOrders,
    activeOrderFilter,
    setActiveOrderFilter,
    selectedTrackingOrderId,
    setSelectedTrackingOrderId,
    trackingOrder,
    messages,
    setMessages,
    replyText,
    setReplyText,
    handleSendMessage,
    toastMessage,
    setToastMessage,
    showToast,
    signOutModalOpen,
    setSignOutModalOpen,
    handleSignOut,
    editProfileOpen,
    setEditProfileOpen,
    editFormData,
    setEditFormData,
    photoInputRef,
    handleOpenEditProfile,
    handleSaveProfile,
    handlePhotoUpload,
    // Produce modals & Order Workflow
    declineModalCrop,
    setDeclineModalCrop,
    handleOpenDecline,
    handleConfirmDecline,
    workflowCrop,
    setWorkflowCrop,
    workflowModalOpen,
    setWorkflowModalOpen,
    workflowStep,
    setWorkflowStep,
    activeWorkflowOrder,
    setActiveWorkflowOrder,
    isSubmittingOrder,
    handleCloseWorkflow,
    handleConfirmCreateOrder,
    handleSimulateFarmerApproval,
    handleSimulateFarmerRejection,
    handleSimulateDeliveryArrangement,
    handleGoToDeliveryStatus,
    handleAdvanceDeliveryStep,
    handleOpenOrderWorkflowForOrder,
    // Legacy modal compat
    acceptModalCrop,
    setAcceptModalCrop,
    acceptedQuantity,
    setAcceptedQuantity,
    handleOpenAccept,
    handleProceedToFarmer,
    farmerDetailsCrop,
    setFarmerDetailsCrop,
    handleConfirmOrder,
    orderConfirmationData,
    setOrderConfirmationData,
    handleGoToTracking,
    // Lang & Translations
    lang,
    toggleLang,
    t
  };

  return <BuyerContext.Provider value={value}>{children}</BuyerContext.Provider>;
}

export function useBuyer() {
  const context = useContext(BuyerContext);
  if (!context) {
    throw new Error('useBuyer must be used within a BuyerProvider');
  }
  return context;
}
