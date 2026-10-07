// What this file does: Global React context managing commercial buyer state, profile, crop listings, orders, and messages.

/* oxlint-disable react/only-export-components */
import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes';
import { useT } from '../hooks/useT';
import { INITIAL_CROPS, INITIAL_ORDERS, INITIAL_MESSAGES } from '../data/mockData';

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

    return {
      name: saved?.name || buyerProfile?.name || 'Grand Palace Hotel',
      shopName:
        saved?.shopName ||
        saved?.businessName ||
        buyerProfile?.shopName ||
        'Grand Palace Luxury Dining',
      businessName:
        saved?.shopName ||
        saved?.businessName ||
        buyerProfile?.businessName ||
        'Grand Palace Luxury Dining',
      contactPerson:
        saved?.contactPerson ||
        saved?.fullName ||
        saved?.name ||
        buyerProfile?.contactPerson ||
        'Mr. S. Rajesh (Procurement Head)',
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

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfile(editFormData);
    try {
      localStorage.setItem('buyer_current_profile', JSON.stringify(editFormData));
      localStorage.setItem('buyer_registered_profile', JSON.stringify(editFormData));
    } catch {
      // ignore storage error
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

  // Produce Action Modals
  const [declineModalCrop, setDeclineModalCrop] = useState(null);
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
    return crops
      .filter((crop) => !declinedCropIds.includes(crop.id))
      .filter((crop) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          crop.name.toLowerCase().includes(q) ||
          crop.tamilName.toLowerCase().includes(q) ||
          crop.hubName.toLowerCase().includes(q) ||
          crop.category.toLowerCase().includes(q)
        );
      })
      .filter((crop) => {
        if (selectedCategory === 'all') return true;
        if (selectedCategory === 'vegetables') return crop.category === 'vegetables';
        if (selectedCategory === 'fruits') return crop.category === 'fruits';
        if (selectedCategory === 'grade_a') return crop.grade === 'Grade A';
        if (selectedCategory === 'grade_b') return crop.grade === 'Grade B';
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') return a.pricePerKg - b.pricePerKg;
        if (sortBy === 'price_high') return b.pricePerKg - a.pricePerKg;
        if (sortBy === 'qty_high') return b.availableKg - a.availableKg;
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

  const handleOpenAccept = (crop) => {
    setAcceptModalCrop(crop);
    setAcceptedQuantity(Math.min(200, crop.availableKg));
  };

  const handleProceedToFarmer = () => {
    if (!acceptModalCrop) return;
    const crop = acceptModalCrop;
    const qty = acceptedQuantity;
    setAcceptModalCrop(null);

    setFarmerDetailsCrop({
      ...crop,
      selectedQty: qty,
      estimatedTotal: qty * crop.pricePerKg
    });

    showToast(
      'success',
      t('modals.cropAcceptedToast')
    );
  };

  const handleConfirmOrder = () => {
    if (!farmerDetailsCrop) return;
    const crop = farmerDetailsCrop;
    const newOrderId = `NU-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder = {
      orderId: newOrderId,
      cropName: crop.name,
      tamilCropName: crop.tamilName,
      grade: crop.grade,
      quantityKg: crop.selectedQty,
      unitPrice: crop.pricePerKg,
      totalPrice: crop.estimatedTotal,
      orderTime: 'Just now',
      status: 'confirmed',
      hub: crop.hubName,
      farmer: {
        name: crop.farmer.name,
        phone: crop.farmer.phone,
        location: crop.farmer.village
      },
      driver: {
        name: 'Kumar M.',
        phone: '+91 94432 11098',
        vehicleType: 'Tata Ace EV Cargo',
        vehicleNumber: 'TN 57 AB 1234',
        rating: 4.9,
        capacityKg: 500,
        deliveryPin: `${Math.floor(1000 + Math.random() * 9000)}`
      },
      liveTracking: {
        currentStatus: 'Order Confirmed - Dispatch Queue Scheduled at Hub',
        currentLocation: `${crop.hubName} Sorting Bay`,
        estimatedMinutes: 35,
        distanceKm: crop.distanceKm,
        lastUpdated: 'Just now',
        speedKmh: 0,
        batteryPct: 92,
        origin: crop.hubName,
        destination: profile.address || buyerProfile?.address
      }
    };

    setOrders((prev) => [newOrder, ...prev]);
    setFarmerDetailsCrop(null);
    setOrderConfirmationData(newOrder);
  };

  const handleGoToTracking = (orderId) => {
    setSelectedTrackingOrderId(orderId);
    setOrderConfirmationData(null);
    navigate(ROUTES.BUYER_DASHBOARD_TRACK);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      sessionStorage.setItem('buyer_explicit_signout', 'true');
    } catch {
      // ignore storage error
    }
    if (onLogout) {
      onLogout();
    } else {
      navigate(ROUTES.BUYER_LOGIN);
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
    // Produce modals
    declineModalCrop,
    setDeclineModalCrop,
    handleOpenDecline,
    handleConfirmDecline,
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
