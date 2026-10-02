import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sprout,
  ShoppingBag,
  Truck,
  PackageCheck,
  Search,
  MapPin,
  Phone,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  X,
  Bell,
  User,
  ShieldCheck,
  Building2,
  Info,
  Calendar,
  AlertCircle,
  Check,
  RotateCcw,
  Navigation,
  MessageSquare,
  HelpCircle,
  Menu,
  Scale,
  Zap,
  LogOut,
  Send,
  Camera,
  Edit3,
  Store,
  ShoppingCart
} from 'lucide-react';
import './BuyerDashboardScreen.css';

/**
 * INITIAL SEED DATA: Today's Hub Fresh Produce
 * Sourced directly from local farmers at Tamil Nadu supply hubs
 */
const INITIAL_CROPS = [
  {
    id: 'crop-tomato-01',
    name: 'Country Tomato',
    tamilName: 'நாட்டு தக்காளி',
    category: 'vegetables',
    grade: 'Grade A',
    gradeDesc: 'Firm, uniform size, hub certified',
    pricePerKg: 32,
    availableKg: 500,
    minOrderKg: 50,
    hubName: 'Dindigul Central Hub',
    hubCode: 'DGL-HUB-01',
    distanceKm: 28,
    harvestTime: 'Today, 04:30 AM',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    farmer: {
      name: 'Ravi Kumar',
      farmerId: 'FMR-TN-4821',
      village: 'Siluvathur, Dindigul',
      phone: '+91 98421 78210',
      rating: 4.9,
      totalHarvests: 142
    },
    popular: true
  },
  {
    id: 'crop-onion-02',
    name: 'Small Shallots (Chinna Vengayam)',
    tamilName: 'சின்ன வெங்காயம்',
    category: 'vegetables',
    grade: 'Grade A',
    gradeDesc: 'Sun-cured, pungent, dry skin',
    pricePerKg: 58,
    availableKg: 400,
    minOrderKg: 50,
    hubName: 'Perambalur Hub',
    hubCode: 'PBR-HUB-02',
    distanceKm: 42,
    harvestTime: 'Today, 05:00 AM',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80',
    farmer: {
      name: 'P. Murugesan',
      farmerId: 'FMR-TN-3104',
      village: 'Veppanthattai, Perambalur',
      phone: '+91 94432 89123',
      rating: 4.8,
      totalHarvests: 98
    },
    popular: true
  },
  {
    id: 'crop-carrot-03',
    name: 'Ooty Country Carrots',
    tamilName: 'ஊட்டி கேரட்',
    category: 'vegetables',
    grade: 'Grade A',
    gradeDesc: 'Crisp, washed, high sweetness',
    pricePerKg: 45,
    availableKg: 350,
    minOrderKg: 40,
    hubName: 'Ketti Valley Hub',
    hubCode: 'NLG-HUB-04',
    distanceKm: 65,
    harvestTime: 'Today, 04:00 AM',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80',
    farmer: {
      name: 'K. Selvam',
      farmerId: 'FMR-TN-5529',
      village: 'Ketti Valley, Nilgiris',
      phone: '+91 98428 33412',
      rating: 4.95,
      totalHarvests: 210
    },
    popular: false
  },
  {
    id: 'crop-potato-04',
    name: 'Mettupalayam Potatoes',
    tamilName: 'உருளைக்கிழங்கு',
    category: 'vegetables',
    grade: 'Grade B',
    gradeDesc: 'Medium size, ideal for gravies & fries',
    pricePerKg: 28,
    availableKg: 800,
    minOrderKg: 100,
    hubName: 'Nilgiris Foothill Hub',
    hubCode: 'CBE-HUB-03',
    distanceKm: 55,
    harvestTime: 'Yesterday, 05:00 PM',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80',
    farmer: {
      name: 'M. Ramasamy',
      farmerId: 'FMR-TN-1940',
      village: 'Sirumugai, Coimbatore',
      phone: '+91 97891 66543',
      rating: 4.7,
      totalHarvests: 85
    },
    popular: false
  },
  {
    id: 'crop-chilli-05',
    name: 'Samba Green Chillies',
    tamilName: 'பச்சை மிளகாய்',
    category: 'vegetables',
    grade: 'Grade A',
    gradeDesc: 'Deep green, high heat index',
    pricePerKg: 62,
    availableKg: 180,
    minOrderKg: 20,
    hubName: 'Theni Produce Hub',
    hubCode: 'THN-HUB-01',
    distanceKm: 34,
    harvestTime: 'Today, 06:15 AM',
    image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&auto=format&fit=crop&q=80',
    farmer: {
      name: 'A. Ganesan',
      farmerId: 'FMR-TN-6120',
      village: 'Andipatti, Theni',
      phone: '+91 98425 11980',
      rating: 4.85,
      totalHarvests: 130
    },
    popular: true
  },
  {
    id: 'crop-cabbage-06',
    name: 'Oddanchatram Fresh Cabbage',
    tamilName: 'முட்டைக்கோஸ்',
    category: 'vegetables',
    grade: 'Grade A',
    gradeDesc: 'Tight heads, zero pest damage',
    pricePerKg: 22,
    availableKg: 600,
    minOrderKg: 50,
    hubName: 'Oddanchatram Hub',
    hubCode: 'DGL-HUB-02',
    distanceKm: 31,
    harvestTime: 'Today, 05:30 AM',
    image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=600&auto=format&fit=crop&q=80',
    farmer: {
      name: 'S. Velumani',
      farmerId: 'FMR-TN-2210',
      village: 'Kallimanthayam, Dindigul',
      phone: '+91 94435 67890',
      rating: 4.9,
      totalHarvests: 175
    },
    popular: false
  },
  {
    id: 'crop-okra-07',
    name: 'Tender Lady\'s Finger (Vendakkai)',
    tamilName: 'வெண்டைக்காய்',
    category: 'vegetables',
    grade: 'Grade A',
    gradeDesc: 'Soft tips, snap fresh, pesticide tested',
    pricePerKg: 36,
    availableKg: 250,
    minOrderKg: 25,
    hubName: 'Madurai Central Hub',
    hubCode: 'MDU-HUB-01',
    distanceKm: 18,
    harvestTime: 'Today, 06:00 AM',
    image: 'https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?w=600&auto=format&fit=crop&q=80',
    farmer: {
      name: 'T. Meenakshi',
      farmerId: 'FMR-TN-7734',
      village: 'Vadipatti, Madurai',
      phone: '+91 98422 45678',
      rating: 4.92,
      totalHarvests: 92
    },
    popular: false
  },
  {
    id: 'crop-capsicum-08',
    name: 'Hosur Green Capsicum',
    tamilName: 'குடைமிளகாய்',
    category: 'vegetables',
    grade: 'Grade A',
    gradeDesc: 'Thick walled, gloss finish, polyhouse',
    pricePerKg: 52,
    availableKg: 300,
    minOrderKg: 30,
    hubName: 'Hosur Agri Hub',
    hubCode: 'HSR-HUB-01',
    distanceKm: 85,
    harvestTime: 'Today, 05:45 AM',
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&auto=format&fit=crop&q=80',
    farmer: {
      name: 'V. Senthil',
      farmerId: 'FMR-TN-8941',
      village: 'Kelamangalam, Krishnagiri',
      phone: '+91 97890 12345',
      rating: 4.88,
      totalHarvests: 114
    },
    popular: false
  },
  {
    id: 'crop-banana-09',
    name: 'Robusta Golden Bananas',
    tamilName: 'ரோபஸ்டா வாழை',
    category: 'fruits',
    grade: 'Grade A',
    gradeDesc: 'Naturally ripened, export grade',
    pricePerKg: 38,
    availableKg: 650,
    minOrderKg: 50,
    hubName: 'Trichy Cauvery Hub',
    hubCode: 'TRY-HUB-01',
    distanceKm: 48,
    harvestTime: 'Today, 05:00 AM',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80',
    farmer: {
      name: 'N. Balakrishnan',
      farmerId: 'FMR-TN-3401',
      village: 'Thottiyam, Tiruchirappalli',
      phone: '+91 94438 90123',
      rating: 4.94,
      totalHarvests: 230
    },
    popular: true
  },
  {
    id: 'crop-pomegranate-10',
    name: 'Kabul Red Pomegranates',
    tamilName: 'மாதுளை',
    category: 'fruits',
    grade: 'Grade A',
    gradeDesc: 'Deep ruby arils, sweet Brix 15+',
    pricePerKg: 115,
    availableKg: 220,
    minOrderKg: 25,
    hubName: 'Dindigul Central Hub',
    hubCode: 'DGL-HUB-01',
    distanceKm: 28,
    harvestTime: 'Yesterday, 04:00 PM',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80',
    farmer: {
      name: 'C. Muthuraj',
      farmerId: 'FMR-TN-9023',
      village: 'Vadamadurai, Dindigul',
      phone: '+91 98433 77889',
      rating: 4.86,
      totalHarvests: 76
    },
    popular: false
  }
];

/**
 * INITIAL SEED ORDERS FOR ORDER HISTORY & TRACKING
 */
const INITIAL_ORDERS = [
  {
    orderId: 'NU-2026-00124',
    cropName: 'Country Tomato',
    tamilCropName: 'நாட்டு தக்காளி',
    grade: 'Grade A',
    quantityKg: 200,
    unitPrice: 32,
    totalPrice: 6400,
    orderTime: 'Today, 08:30 AM',
    status: 'in_transit', // 'confirmed' | 'preparing' | 'dispatched' | 'in_transit' | 'delivered'
    hub: 'Dindigul Central Hub',
    farmer: {
      name: 'Ravi Kumar',
      phone: '+91 98421 78210',
      location: 'Siluvathur, Dindigul'
    },
    driver: {
      name: 'Kumar M.',
      phone: '+91 94432 11098',
      vehicleType: 'Tata Ace EV Cargo',
      vehicleNumber: 'TN 57 AB 1234',
      rating: 4.9,
      capacityKg: 500,
      deliveryPin: '4892'
    },
    liveTracking: {
      currentStatus: 'Vehicle is on the way',
      currentLocation: 'Near Samayanallur Bypass',
      estimatedMinutes: 25,
      distanceKm: 12.4,
      lastUpdated: 'Just now',
      speedKmh: 42,
      batteryPct: 84,
      origin: 'Dindigul Central Supply Hub',
      destination: 'Grand Palace Hotel, Bypass Road, Madurai'
    }
  },
  {
    orderId: 'NU-2026-00119',
    cropName: 'Small Shallots (Chinna Vengayam)',
    tamilCropName: 'சின்ன வெங்காயம்',
    grade: 'Grade A',
    quantityKg: 150,
    unitPrice: 58,
    totalPrice: 8700,
    orderTime: 'Today, 06:15 AM',
    status: 'preparing',
    hub: 'Perambalur Hub',
    farmer: {
      name: 'P. Murugesan',
      phone: '+91 94432 89123',
      location: 'Veppanthattai, Perambalur'
    },
    driver: {
      name: 'S. Arumugam',
      phone: '+91 98423 44556',
      vehicleType: 'Mahindra Zor Grand EV',
      vehicleNumber: 'TN 45 EF 5678',
      rating: 4.85,
      capacityKg: 600,
      deliveryPin: '3190'
    },
    liveTracking: {
      currentStatus: 'Quality grading completed, loading into EV vehicle',
      currentLocation: 'Perambalur Hub Loading Bay 3',
      estimatedMinutes: 65,
      distanceKm: 38.2,
      lastUpdated: '5 mins ago',
      speedKmh: 0,
      batteryPct: 96,
      origin: 'Perambalur Central Hub',
      destination: 'Grand Palace Hotel, Madurai'
    }
  },
  {
    orderId: 'NU-2026-00098',
    cropName: 'Ooty Country Carrots',
    tamilCropName: 'ஊட்டி கேரட்',
    grade: 'Grade A',
    quantityKg: 100,
    unitPrice: 45,
    totalPrice: 4500,
    orderTime: 'Yesterday, 02:40 PM',
    status: 'delivered',
    hub: 'Ketti Valley Hub',
    farmer: {
      name: 'K. Selvam',
      phone: '+91 98428 33412',
      location: 'Ketti Valley, Nilgiris'
    },
    driver: {
      name: 'V. Prakash',
      phone: '+91 97890 88990',
      vehicleType: 'Tata Ace EV Cargo',
      vehicleNumber: 'TN 43 CD 9012',
      rating: 4.95,
      capacityKg: 500,
      deliveryPin: '7721'
    },
    liveTracking: {
      currentStatus: 'Delivered and Verified at Gate 2',
      currentLocation: 'Grand Palace Hotel, Madurai',
      estimatedMinutes: 0,
      distanceKm: 0,
      lastUpdated: 'Yesterday, 04:55 PM',
      speedKmh: 0,
      batteryPct: 62,
      origin: 'Ketti Valley Hub',
      destination: 'Grand Palace Hotel, Madurai'
    }
  }
];

export default function BuyerDashboardScreen({
  buyerProfile,
  defaultLang = 'en',
  onLogout
}) {
  // Navigation State
  const [activeNav, setActiveNav] = useState('home'); // 'home' | 'crops' | 'orders' | 'track' | 'messages' | 'profile'
  const [lang, setLang] = useState(defaultLang);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mainViewportRef = useRef(null);

  const handleNavSelect = (navKey) => {
    setActiveNav(navKey);
    setMobileMenuOpen(false);
    if (mainViewportRef.current) {
      mainViewportRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Full Buyer Profile State (Synched with Sign Up / Sign In data and localStorage)
  const [profile, setProfile] = useState(() => {
    let saved = null;
    try {
      const raw = localStorage.getItem('buyer_current_profile') || localStorage.getItem('buyer_registered_profile');
      if (raw) saved = JSON.parse(raw);
    } catch (e) {
      console.warn('Could not read saved profile:', e);
    }

    return {
      name: saved?.name || buyerProfile?.name || 'Grand Palace Hotel',
      shopName: saved?.shopName || saved?.businessName || buyerProfile?.shopName || 'Grand Palace Luxury Dining',
      businessName: saved?.shopName || saved?.businessName || buyerProfile?.businessName || 'Grand Palace Luxury Dining',
      contactPerson: saved?.contactPerson || saved?.fullName || saved?.name || buyerProfile?.contactPerson || 'Mr. S. Rajesh (Procurement Head)',
      phone: saved?.phone || buyerProfile?.phone || '+91 98401 23456',
      email: saved?.email || buyerProfile?.email || 'procurement@grandpalace.in',
      buyerType: saved?.buyerType || buyerProfile?.buyerType || 'hotel',
      businessType: saved?.businessType || (saved?.buyerType ? `${saved.buyerType.toUpperCase()} Commercial Kitchen` : (buyerProfile?.businessType || 'Hotel & Commercial Kitchen')),
      address: saved?.address || buyerProfile?.address || 'Grand Palace Luxury Dining, Bypass Road, Madurai - 625016',
      gstin: saved?.gstin || buyerProfile?.gstin || '33AAAAA0000A1Z5',
      photo: saved?.photo || saved?.photoPreview || buyerProfile?.photo || buyerProfile?.photoPreview || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=300&auto=format&fit=crop&q=80',
      photoPreview: saved?.photoPreview || saved?.photo || buyerProfile?.photoPreview || buyerProfile?.photo || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=300&auto=format&fit=crop&q=80'
    };
  });

  // Sync when buyerProfile prop changes
  useEffect(() => {
    if (buyerProfile) {
      setProfile((prev) => ({
        ...prev,
        ...buyerProfile,
        shopName: buyerProfile.shopName || buyerProfile.name || prev.shopName,
        contactPerson: buyerProfile.contactPerson || buyerProfile.fullName || buyerProfile.name || prev.contactPerson,
        photo: buyerProfile.photo || buyerProfile.photoPreview || prev.photo,
        photoPreview: buyerProfile.photoPreview || buyerProfile.photo || prev.photoPreview
      }));
    }
  }, [buyerProfile]);

  // Edit Profile Modal & Photo upload refs
  const [editProfileOpen, setEditProfileOpen] = useState(false);
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
    } catch (err) { }
    setEditProfileOpen(false);
    setToastMessage({
      type: 'success',
      text: lang === 'en' ? '✓ Profile & photo updated successfully!' : '✓ சுயவிவரம் மற்றும் புகைப்படம் மாற்றப்பட்டது!'
    });
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
      } catch (err) { }
      setToastMessage({
        type: 'success',
        text: lang === 'en' ? '✓ Profile photo updated!' : '✓ சுயவிவரப் படம் மாற்றப்பட்டது!'
      });
    };
    reader.readAsDataURL(file);
  };

  // Crops Data & Filter States
  const [crops, _setCrops] = useState(INITIAL_CROPS);
  const [declinedCropIds, setDeclinedCropIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'vegetables' | 'fruits' | 'grade_a' | 'grade_b'
  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'price_low' | 'price_high' | 'qty_high'

  // Interactive Flow States (Accept / Decline / Farmer / Order)
  const [declineModalCrop, setDeclineModalCrop] = useState(null);
  const [acceptModalCrop, setAcceptModalCrop] = useState(null);
  const [acceptedQuantity, setAcceptedQuantity] = useState(200);
  const [farmerDetailsCrop, setFarmerDetailsCrop] = useState(null);
  const [orderConfirmationData, setOrderConfirmationData] = useState(null);

  // Orders & Tracking State
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [activeOrderFilter, setActiveOrderFilter] = useState('active'); // 'active' | 'completed' | 'all'
  const [selectedTrackingOrderId, setSelectedTrackingOrderId] = useState('NU-2026-00124');

  // UI Micro-state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Messages Chat state
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'Driver Kumar M.',
      role: 'EV Delivery Driver',
      time: '09:12 AM',
      text: 'Good morning sir, produce picked from Dindigul Hub. Crossed Samayanallur Bypass. Expected arrival at Kitchen Gate 2 in 25 minutes.',
      isDriver: true
    },
    {
      id: 'm2',
      sender: 'Farmer Ravi Kumar',
      role: 'Tomato Grower (Siluvathur)',
      time: '08:45 AM',
      text: 'Vanakkam sir, today harvest is premium Grade A country tomatoes, crate packed carefully. Thank you for direct acceptance.',
      isDriver: false
    }
  ]);
  const [replyText, setReplyText] = useState('');

  // Toast auto-clear
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Content Strings Dictionary (English / Tamil)
  const t = {
    brandName: lang === 'ta' ? 'நாம் உழவர்' : 'Naam Uzhavar',
    hubBadge: lang === 'ta' ? 'வாங்குவோர் தளம்' : 'Buyer Hub',
    searchPlaceholder: lang === 'ta' ? 'தக்காளி, வெங்காயம், உருளைக்கிழங்கு தேடுக...' : 'Search tomato, onion, potato...',
    goodMorning: lang === 'ta' ? 'வணக்கம்,' : 'Good morning,',
    hubTagline: lang === 'ta' ? 'இன்றைய கொள்முதல் மையத்தில் கிடைக்கும் புதிய விளைபொருட்கள்.' : "Find fresh produce available from today's supply hub.",

    // Nav Items
    navHome: lang === 'ta' ? 'முகப்பு' : 'Home',
    navCrops: lang === 'ta' ? 'கிடைக்கும் பயிர்கள்' : 'Available Crops',
    navOrders: lang === 'ta' ? 'எனது ஆர்டர்கள்' : 'My Orders',
    navTrack: lang === 'ta' ? 'டெலிவரி கண்காணிப்பு' : 'Track Delivery',
    navMessages: lang === 'ta' ? 'செய்திகள்' : 'Messages',
    navProfile: lang === 'ta' ? 'சுயவிவரம்' : 'Profile',
    navSupport: lang === 'ta' ? 'உதவி & ஆதரவு' : 'Help & Support',

    // Summary Cards
    statCrops: lang === 'ta' ? 'இன்றைய பயிர்கள்' : 'Crops Today',
    statOrders: lang === 'ta' ? 'செயலில் உள்ள ஆர்டர்கள்' : 'Active Orders',
    statTransit: lang === 'ta' ? 'வழியில் உள்ளவை' : 'In Transit',

    // Filter Chips
    filterAll: lang === 'ta' ? 'அனைத்தும்' : 'All',
    filterVegetables: lang === 'ta' ? 'காய்கறிகள்' : 'Vegetables',
    filterFruits: lang === 'ta' ? 'பழங்கள்' : 'Fruits',
    filterGradeA: lang === 'ta' ? 'தரம் A (Grade A)' : 'Grade A',
    filterGradeB: lang === 'ta' ? 'தரம் B (Grade B)' : 'Grade B',

    // Sort Options
    sortRecent: lang === 'ta' ? 'சமீபத்திய அறுவடை' : 'Recently Added',
    sortPriceLow: lang === 'ta' ? 'விலை: குறைந்தது முதல்' : 'Price: Low to High',
    sortPriceHigh: lang === 'ta' ? 'விலை: அதிகமானது முதல்' : 'Price: High to Low',
    sortQtyHigh: lang === 'ta' ? 'அதிக அளவு உள்ளவை' : 'Quantity: High to Low',

    // Crop Card
    perKg: '/ kg',
    available: lang === 'ta' ? 'கிடைக்கும் அளவு:' : 'Available:',
    hub: lang === 'ta' ? 'மையம்:' : 'Hub:',
    btnAccept: lang === 'ta' ? 'ஏற்றுக்கொள்க' : 'Accept',
    btnDecline: lang === 'ta' ? 'மறுக்க' : 'Decline'
  };

  // Filter crops based on search, category, and declines
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
        return 0; // default recent order
      });
  }, [crops, declinedCropIds, searchQuery, selectedCategory, sortBy]);

  // Selected Order for Live Tracking
  const trackingOrder = useMemo(() => {
    return orders.find((o) => o.orderId === selectedTrackingOrderId) || orders[0];
  }, [orders, selectedTrackingOrderId]);

  // Handle Decline confirmation
  const handleConfirmDecline = () => {
    if (!declineModalCrop) return;
    const cropId = declineModalCrop.id;
    const cropName = declineModalCrop.name;
    setDeclinedCropIds((prev) => [...prev, cropId]);
    setDeclineModalCrop(null);
    setToastMessage({
      type: 'info',
      text: lang === 'en'
        ? `"${cropName}" removed from your available crops list.`
        : `"${cropName}" உங்கள் பயிர்கள் பட்டியலில் இருந்து நீக்கப்பட்டது.`
    });
  };

  // Open Accept Modal
  const handleOpenAccept = (crop) => {
    setAcceptModalCrop(crop);
    // sensible default quantity: 200 kg or max available
    setAcceptedQuantity(Math.min(200, crop.availableKg));
  };

  // Proceed from Accept modal to Farmer Details
  const handleProceedToFarmer = () => {
    if (!acceptModalCrop) return;
    const crop = acceptModalCrop;
    const qty = acceptedQuantity;
    setAcceptModalCrop(null);

    // Set farmer review payload
    setFarmerDetailsCrop({
      ...crop,
      selectedQty: qty,
      estimatedTotal: qty * crop.pricePerKg
    });

    setToastMessage({
      type: 'success',
      text: lang === 'en' ? '✓ Crop accepted. Farmer details unlocked.' : '✓ விளைபொருள் ஏற்கப்பட்டது. உழவர் விவரங்கள் திறக்கப்பட்டது.'
    });
  };

  // Confirm Order from Farmer Details panel
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

  // Jump to track view from confirmation modal
  const handleGoToTracking = (orderId) => {
    setSelectedTrackingOrderId(orderId);
    setOrderConfirmationData(null);
    setActiveNav('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Send message
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

  return (
    <div className="buyer-dashboard-root">
      {/* ====================================================================
          1. TOP NAVIGATION BAR (Compact, Clean, Logo, Search, Alerts, Profile)
          ==================================================================== */}
      <header className="buyer-topbar">
        <div className="buyer-topbar-left">
          {/* Mobile hamburger menu */}
          <button
            type="button"
            className="buyer-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo Brand Lockup */}
          <div className="buyer-brand-badge" onClick={() => setActiveNav('home')}>
            <img src="/logo.jpg" alt="Naam Uzhavar" className="buyer-brand-logo-img" />
            <div className="buyer-brand-titles">
              <span className="buyer-brand-title">{t.brandName}</span>
              <span className="buyer-hub-pill">{t.hubBadge}</span>
            </div>
          </div>
        </div>


        {/* Topbar Right Actions */}
        <div className="buyer-topbar-right">
          {/* Language Switcher */}
          <button
            type="button"
            className="buyer-lang-btn"
            onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
            title="Toggle English / தமிழ்"
          >
            {lang === 'en' ? 'தமிழ்' : 'English'}
          </button>

          {/* Notifications Bell */}
          <div className="buyer-topbar-dropdown-wrap">
            <button
              type="button"
              className="buyer-icon-circle-btn"
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileDropdownOpen(false);
              }}
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="buyer-bell-dot">4</span>
            </button>

            {notificationsOpen && (
              <div className="buyer-dropdown-menu buyer-notif-dropdown">
                <div className="buyer-dropdown-header">
                  <span className="buyer-dropdown-title">
                    {lang === 'en' ? 'Notifications' : 'அறிவிப்புகள்'}
                  </span>
                  <span className="buyer-dropdown-count">4 {lang === 'en' ? 'new' : 'புதிய'}</span>
                </div>
                <div className="buyer-notif-list">
                  <div className="buyer-notif-item unread">
                    <div className="buyer-notif-icon green">
                      <Truck size={14} />
                    </div>
                    <div className="buyer-notif-content">
                      <p className="buyer-notif-text">
                        <strong>Tata Ace EV (TN 57 AB 1234)</strong> is on the way with your Tomato order.
                      </p>
                      <span className="buyer-notif-time">2 mins ago</span>
                    </div>
                  </div>
                  <div className="buyer-notif-item unread">
                    <div className="buyer-notif-icon green">
                      <CheckCircle2 size={14} />
                    </div>
                    <div className="buyer-notif-content">
                      <p className="buyer-notif-text">
                        Farmer <strong>Ravi Kumar</strong> accepted your 200 kg dispatch request.
                      </p>
                      <span className="buyer-notif-time">15 mins ago</span>
                    </div>
                  </div>
                  <div className="buyer-notif-item">
                    <div className="buyer-notif-icon blue">
                      <Clock size={14} />
                    </div>
                    <div className="buyer-notif-content">
                      <p className="buyer-notif-text">
                        Your order <strong>NU-2026-00124</strong> will arrive in approx 25 minutes.
                      </p>
                      <span className="buyer-notif-time">30 mins ago</span>
                    </div>
                  </div>
                  <div className="buyer-notif-item">
                    <div className="buyer-notif-icon gray">
                      <PackageCheck size={14} />
                    </div>
                    <div className="buyer-notif-content">
                      <p className="buyer-notif-text">
                        Order <strong>NU-2026-00098</strong> (Ooty Carrots) delivered successfully.
                      </p>
                      <span className="buyer-notif-time">Yesterday</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Buyer Profile Pill with Uploaded Photo (Right Top) */}
          <div className="buyer-topbar-dropdown-wrap">
            <button
              type="button"
              className="buyer-profile-chip-btn"
              onClick={() => {
                setProfileDropdownOpen(!profileDropdownOpen);
                setNotificationsOpen(false);
              }}
              aria-label="Buyer profile menu"
            >
              <div className="buyer-avatar-badge has-photo">
                {profile.photo || profile.photoPreview ? (
                  <img
                    src={profile.photo || profile.photoPreview}
                    alt={profile.shopName || profile.name}
                    className="buyer-avatar-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <Building2 size={16} />
                )}
              </div>
              <div className="buyer-profile-info-text">
                <span className="buyer-name-truncate">{profile.shopName || profile.name}</span>
                <span className="buyer-role-subtext">{profile.contactPerson || profile.phone}</span>
              </div>
              <ChevronDown size={14} className="buyer-dropdown-caret" />
            </button>

            {profileDropdownOpen && (
              <div className="buyer-dropdown-menu buyer-profile-dropdown">
                <div className="buyer-profile-card-header">
                  <div className="buyer-profile-card-icon has-photo">
                    {profile.photo || profile.photoPreview ? (
                      <img
                        src={profile.photo || profile.photoPreview}
                        alt={profile.name}
                        className="buyer-profile-dropdown-img"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <Building2 size={24} />
                    )}
                  </div>
                  <div className="buyer-profile-header-info">
                    <h4 className="buyer-card-title">{profile.shopName || profile.name}</h4>
                    <p className="buyer-card-sub">👤 {profile.contactPerson || profile.name}</p>
                    <p className="buyer-card-sub font-mono">📞 {profile.phone}</p>
                    <p className="buyer-card-sub">✉️ {profile.email}</p>
                    <span className="buyer-gstin-tag">GSTIN: {profile.gstin}</span>
                  </div>
                </div>
                <div className="buyer-dropdown-divider" />
                <button
                  type="button"
                  className="buyer-dropdown-item"
                  onClick={() => {
                    setActiveNav('profile');
                    setProfileDropdownOpen(false);
                  }}
                >
                  <User size={15} />
                  <span>{lang === 'en' ? 'View Business Profile' : 'வணிக சுயவிவரம்'}</span>
                </button>
                <button
                  type="button"
                  className="buyer-dropdown-item"
                  onClick={() => {
                    handleOpenEditProfile();
                    setProfileDropdownOpen(false);
                  }}
                >
                  <Edit3 size={15} />
                  <span>{lang === 'en' ? 'Edit Details & Photo' : 'விவரங்களை திருத்த'}</span>
                </button>
                <button
                  type="button"
                  className="buyer-dropdown-item"
                  onClick={() => {
                    setActiveNav('orders');
                    setProfileDropdownOpen(false);
                  }}
                >
                  <PackageCheck size={15} />
                  <span>{lang === 'en' ? 'All Past Orders' : 'கடந்தகால ஆர்டர்கள்'}</span>
                </button>
                <div className="buyer-dropdown-divider" />
                <button
                  type="button"
                  className="buyer-dropdown-item logout"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    if (onLogout) {
                      onLogout();
                    } else {
                      window.location.hash = '#buyer-login';
                    }
                  }}
                >
                  <LogOut size={15} />
                  <span>{lang === 'en' ? 'Sign Out / Logout' : 'வெளியேறுக'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ====================================================================
          2. DASHBOARD BODY: SIDEBAR + MAIN CONTENT AREA
          ==================================================================== */}
      <div className="buyer-dashboard-body">
        {/* Mobile Sidebar Backdrop Overlay */}
        {mobileMenuOpen && (
          <div
            className="buyer-sidebar-overlay"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation menu"
          />
        )}

        {/* DESKTOP COLLAPSIBLE SIDEBAR / MOBILE DRAWER */}
        <aside className={`buyer-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-visible' : ''}`}>
          {/* Mobile Drawer Header */}
          <div className="buyer-sidebar-mobile-header">
            <div className="buyer-brand-badge" onClick={() => handleNavSelect('home')}>
              <img src="/logo.jpg" alt="Naam Uzhavar" className="buyer-brand-logo-img" />
              <div className="buyer-brand-titles">
                <span className="buyer-brand-title">{t.brandName}</span>
                <span className="buyer-hub-pill">{t.hubBadge}</span>
              </div>
            </div>
            <button
              type="button"
              className="buyer-drawer-close-btn"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close sidebar menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Primary Navigation Items */}
          <div className="buyer-sidebar-nav">
            <button
              type="button"
              className={`buyer-nav-item ${activeNav === 'home' ? 'active' : ''}`}
              onClick={() => handleNavSelect('home')}
            >
              <Sprout size={19} />
              <span className="buyer-nav-label">{t.navHome}</span>
            </button>

            <button
              type="button"
              className={`buyer-nav-item ${activeNav === 'crops' ? 'active' : ''}`}
              onClick={() => handleNavSelect('crops')}
            >
              <ShoppingBag size={19} />
              <span className="buyer-nav-label">{t.navCrops}</span>
              <span className="buyer-nav-badge">{filteredCrops.length}</span>
            </button>

            <button
              type="button"
              className={`buyer-nav-item ${activeNav === 'orders' ? 'active' : ''}`}
              onClick={() => handleNavSelect('orders')}
            >
              <PackageCheck size={19} />
              <span className="buyer-nav-label">{t.navOrders}</span>
              <span className="buyer-nav-badge neutral">{orders.length}</span>
            </button>

            <button
              type="button"
              className={`buyer-nav-item ${activeNav === 'track' ? 'active' : ''}`}
              onClick={() => handleNavSelect('track')}
            >
              <Truck size={19} />
              <span className="buyer-nav-label">{t.navTrack}</span>
              <span className="buyer-nav-dot-pulse" title="1 Active Delivery" />
            </button>

            <button
              type="button"
              className={`buyer-nav-item ${activeNav === 'messages' ? 'active' : ''}`}
              onClick={() => handleNavSelect('messages')}
            >
              <MessageSquare size={19} />
              <span className="buyer-nav-label">{t.navMessages}</span>
              <span className="buyer-nav-badge neutral">2</span>
            </button>

            <button
              type="button"
              className={`buyer-nav-item ${activeNav === 'profile' ? 'active' : ''}`}
              onClick={() => handleNavSelect('profile')}
            >
              <Building2 size={19} />
              <span className="buyer-nav-label">{t.navProfile}</span>
            </button>
          </div>

          {/* Bottom Docked Section: Helpline + Collapse View (No gap between them) */}
          <div className="buyer-sidebar-bottom">
            <div className="buyer-sidebar-helpline">
              <div className="buyer-helpline-icon-wrap">
                <HelpCircle size={16} />
              </div>
              <div className="buyer-helpline-text">
                <span className="buyer-helpline-title">Kisan Supply Helpline</span>
                <a href="tel:18001801551" className="buyer-helpline-num">1800-180-1551</a>
                <span className="buyer-helpline-sub">{lang === 'ta' ? 'கட்டணமில்லா சேவை • காலை 6 - இரவு 9' : 'Toll-free • 6 AM - 9 PM'}</span>
              </div>
            </div>

            <div className="buyer-sidebar-footer">
              <button
                type="button"
                className="buyer-collapse-btn"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <ChevronRight size={16} className={`buyer-collapse-arrow ${sidebarCollapsed ? 'rotate-180' : ''}`} />
                {!sidebarCollapsed && <span>{lang === 'en' ? 'Collapse view' : 'குறுக்குக'}</span>}
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN DASHBOARD CONTENT VIEWPORT */}
        <main className="buyer-main-viewport" ref={mainViewportRef}>
          {/* ================================================================
              SECTION 4: DASHBOARD HOME
              ================================================================ */}
          {activeNav === 'home' && (
            <div className="buyer-view-container animate-fade-in">
              {/* Top Greeting Header */}
              <div className="buyer-view-header">
                <div>
                  <h1 className="buyer-view-title">
                    {t.goodMorning} <span className="buyer-highlight-name">{profile.shopName || profile.contactPerson || profile.name}</span>
                  </h1>
                  <p className="buyer-view-subtitle">{t.hubTagline}</p>
                </div>
                <div className="buyer-header-date-tag">
                  <Calendar size={15} />
                  <span>Dindigul & Perambalur Hubs Active</span>
                </div>
              </div>

              {/* Summary Row (ONLY 3 clean cards - NO excessive charts!) */}
              <div className="buyer-summary-row">
                <div className="buyer-summary-card" onClick={() => setActiveNav('crops')}>
                  <div className="buyer-summary-number-wrap">
                    <span className="buyer-summary-number">{crops.length}</span>
                    <span className="buyer-summary-trend">
                      <Sprout size={14} /> Fresh
                    </span>
                  </div>
                  <span className="buyer-summary-label">{t.statCrops}</span>
                  <span className="buyer-summary-hint">Fresh harvests across 4 hubs</span>
                </div>

                <div className="buyer-summary-card" onClick={() => setActiveNav('orders')}>
                  <div className="buyer-summary-number-wrap">
                    <span className="buyer-summary-number">3</span>
                    <span className="buyer-summary-trend neutral">
                      <Clock size={14} /> Active
                    </span>
                  </div>
                  <span className="buyer-summary-label">{t.statOrders}</span>
                  <span className="buyer-summary-hint">2 Processing • 1 In Transit</span>
                </div>

                <div className="buyer-summary-card active-transit" onClick={() => setActiveNav('track')}>
                  <div className="buyer-summary-number-wrap">
                    <span className="buyer-summary-number">1</span>
                    <span className="buyer-summary-trend green">
                      <span className="pulse-indicator" /> On Route
                    </span>
                  </div>
                  <span className="buyer-summary-label">{t.statTransit}</span>
                  <span className="buyer-summary-hint">Tata Ace EV • 25 min ETA</span>
                </div>
              </div>

              {/* Active Delivery Spotlight Quick Banner */}
              <div className="buyer-transit-spotlight-card">
                <div className="buyer-transit-spotlight-left">
                  <div className="buyer-transit-icon-box">
                    <Truck size={24} className="buyer-transit-icon animate-bounce-subtle" />
                  </div>
                  <div>
                    <div className="buyer-transit-badge-row">
                      <span className="buyer-live-badge">LIVE TRACKING</span>
                      <span className="buyer-transit-id">Order #NU-2026-00124</span>
                    </div>
                    <h3 className="buyer-transit-title">
                      200 kg Country Tomato is arriving at your kitchen
                    </h3>
                    <p className="buyer-transit-meta">
                      Driver: <strong>Kumar M.</strong> (Tata Ace EV • TN 57 AB 1234) • Near Samayanallur Bypass
                    </p>
                  </div>
                </div>
                <div className="buyer-transit-spotlight-right">
                  <div className="buyer-eta-pill">
                    <span className="buyer-eta-sub">ESTIMATED ARRIVAL</span>
                    <span className="buyer-eta-val">25 min (09:45 AM)</span>
                  </div>
                  <button
                    type="button"
                    className="buyer-btn-primary"
                    onClick={() => setActiveNav('track')}
                  >
                    <span>{lang === 'en' ? 'Track Live Map' : 'வரைபடத்தில் பார்க்க'}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* Quick Fresh Arrivals Section */}
              <div className="buyer-section-block">
                <div className="buyer-section-header">
                  <div>
                    <h2 className="buyer-section-heading">
                      {lang === 'en' ? "Today's Hub Fresh Arrivals" : 'இன்றைய புதிய விளைபொருட்கள்'}
                    </h2>
                    <p className="buyer-section-sub">
                      Harvested this morning, quality certified at hub. Direct wholesale prices.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="buyer-link-btn"
                    onClick={() => setActiveNav('crops')}
                  >
                    <span>{lang === 'en' ? 'View All Crops' : 'அனைத்து பயிர்களையும் பார்க்க'}</span>
                    <ArrowRight size={15} />
                  </button>
                </div>

                {/* 3 Featured Cards */}
                <div className="buyer-crop-grid featured-row">
                  {filteredCrops.slice(0, 3).map((crop) => (
                    <CropCard
                      key={crop.id}
                      crop={crop}
                      lang={lang}
                      t={t}
                      onAccept={() => handleOpenAccept(crop)}
                      onDecline={() => setDeclineModalCrop(crop)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              SECTION 5 & 6: AVAILABLE CROPS (MAIN MARKETPLACE SECTION)
              ================================================================ */}
          {activeNav === 'crops' && (
            <div className="buyer-view-container animate-fade-in">
              <div className="buyer-view-header">
                <div>
                  <h1 className="buyer-view-title">{t.navCrops}</h1>
                  <p className="buyer-view-subtitle">
                    {lang === 'en'
                      ? 'Fresh produce currently available at the hub. Filter by quality grade, price, or crop category.'
                      : 'கொள்முதல் மையத்தில் தற்போது கிடைக்கும் புதிய விளைபொருட்கள்.'}
                  </p>
                </div>
                <div className="buyer-total-stock-badge">
                  <Scale size={15} />
                  <span>{crops.reduce((acc, c) => acc + c.availableKg, 0)} kg Total Stock</span>
                </div>
              </div>

              {/* Crops Search Bar (Moved from Topbar to Below Available Crops) */}
              <div className="buyer-crops-search-bar">
                <Search size={18} className="buyer-crops-search-icon" />
                <input
                  type="text"
                  className="buyer-crops-search-input"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="buyer-crops-search-clear-btn"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Filters & Sorting Bar */}
              <div className="buyer-filter-toolbar">
                {/* Category Filter Chips */}
                <div className="buyer-filter-chips">
                  <button
                    type="button"
                    className={`buyer-chip ${selectedCategory === 'all' ? 'active' : ''}`}
                    onClick={() => setSelectedCategory('all')}
                  >
                    {t.filterAll}
                  </button>
                  <button
                    type="button"
                    className={`buyer-chip ${selectedCategory === 'vegetables' ? 'active' : ''}`}
                    onClick={() => setSelectedCategory('vegetables')}
                  >
                    {t.filterVegetables}
                  </button>
                  <button
                    type="button"
                    className={`buyer-chip ${selectedCategory === 'fruits' ? 'active' : ''}`}
                    onClick={() => setSelectedCategory('fruits')}
                  >
                    {t.filterFruits}
                  </button>
                  <button
                    type="button"
                    className={`buyer-chip ${selectedCategory === 'grade_a' ? 'active' : ''}`}
                    onClick={() => setSelectedCategory('grade_a')}
                  >
                    {t.filterGradeA}
                  </button>
                  <button
                    type="button"
                    className={`buyer-chip ${selectedCategory === 'grade_b' ? 'active' : ''}`}
                    onClick={() => setSelectedCategory('grade_b')}
                  >
                    {t.filterGradeB}
                  </button>
                </div>

                {/* Sort By Dropdown */}
                <div className="buyer-sort-wrap">
                  <label htmlFor="crop-sort-select" className="buyer-sort-label">
                    {lang === 'en' ? 'Sort by:' : 'வரிசைப்படுத்து:'}
                  </label>
                  <div className="buyer-select-wrapper">
                    <select
                      id="crop-sort-select"
                      className="buyer-select-input"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="recent">{t.sortRecent}</option>
                      <option value="price_low">{t.sortPriceLow}</option>
                      <option value="price_high">{t.sortPriceHigh}</option>
                      <option value="qty_high">{t.sortQtyHigh}</option>
                    </select>
                    <ChevronDown size={14} className="buyer-select-arrow" />
                  </div>
                </div>
              </div>

              {/* Crops Grid (Desktop 3-4, Tablet 2, Mobile 1) */}
              {filteredCrops.length > 0 ? (
                <div className="buyer-crop-grid">
                  {filteredCrops.map((crop) => (
                    <CropCard
                      key={crop.id}
                      crop={crop}
                      lang={lang}
                      t={t}
                      onAccept={() => handleOpenAccept(crop)}
                      onDecline={() => setDeclineModalCrop(crop)}
                    />
                  ))}
                </div>
              ) : (
                /* EMPTY STATE (Section 17) */
                <div className="buyer-empty-state-card">
                  <div className="buyer-empty-icon-circle">
                    <Sprout size={32} />
                  </div>
                  <h3 className="buyer-empty-title">
                    {lang === 'en' ? 'No crops are available right now.' : 'தற்போது பயிர்கள் எதுவும் கிடைக்கவில்லை.'}
                  </h3>
                  <p className="buyer-empty-sub">
                    {lang === 'en'
                      ? 'New produce will appear here when it is added to the hub by local growers.'
                      : 'உள்ளூர் விவசாயிகள் விளைபொருட்களை மையத்தில் சேர்க்கும்போது அவை இங்கே தோன்றும்.'}
                  </p>
                  <button
                    type="button"
                    className="buyer-btn-outline"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setDeclinedCropIds([]);
                    }}
                  >
                    <RotateCcw size={15} />
                    <span>{lang === 'en' ? 'Reset Filters & Refresh' : 'வடிகட்டிகளை மீட்டமைக்க'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================================================================
              SECTION 10, 11, 12, 13: ORDER TRACKING & LIVE LOGISTICS MAP
              ================================================================ */}
          {activeNav === 'track' && (
            <div className="buyer-view-container animate-fade-in">
              <div className="buyer-view-header">
                <div>
                  <h1 className="buyer-view-title">
                    {lang === 'en' ? 'Track Your Delivery' : 'உங்கள் டெலிவரியை கண்காணிக்கவும்'}
                  </h1>
                  <p className="buyer-view-subtitle">
                    {lang === 'en'
                      ? 'Live GPS telemetry and route status from supply hub to your loading bay.'
                      : 'கொள்முதல் மையத்திலிருந்து உங்கள் நிறுவனத்திற்கான நேரடி GPS கண்காணிப்பு.'}
                  </p>
                </div>

                {/* Active Tracking Order Switcher */}
                <div className="buyer-active-order-picker">
                  <span className="buyer-picker-label">{lang === 'en' ? 'Tracking Order:' : 'கண்காணிப்பு:'}</span>
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

              {/* 5-STAGE STATUS INDICATOR (Section 10) */}
              <div className="buyer-tracking-stepper-card">
                <div className="buyer-stepper-inner">
                  <div className="buyer-step completed">
                    <div className="buyer-step-circle">
                      <Check size={14} />
                    </div>
                    <span className="buyer-step-title">{lang === 'en' ? 'Order Confirmed' : 'ஆர்டர் உறுதி'}</span>
                    <span className="buyer-step-time">08:30 AM</span>
                  </div>

                  <div className="buyer-step-line completed" />

                  <div className="buyer-step completed">
                    <div className="buyer-step-circle">
                      <Check size={14} />
                    </div>
                    <span className="buyer-step-title">{lang === 'en' ? 'Preparing' : 'தயாராகிறது'}</span>
                    <span className="buyer-step-time">08:45 AM</span>
                  </div>

                  <div className="buyer-step-line completed" />

                  <div className="buyer-step completed">
                    <div className="buyer-step-circle">
                      <Check size={14} />
                    </div>
                    <span className="buyer-step-title">{lang === 'en' ? 'Vehicle Assigned' : 'வாகனம் ஒதுக்கீடு'}</span>
                    <span className="buyer-step-time">09:05 AM</span>
                  </div>

                  <div className="buyer-step-line active" />

                  <div className="buyer-step active">
                    <div className="buyer-step-circle pulse-circle">
                      <Truck size={15} />
                    </div>
                    <span className="buyer-step-title active">{lang === 'en' ? 'On the Way' : 'வழியில் உள்ளது'}</span>
                    <span className="buyer-step-time">{trackingOrder.liveTracking.estimatedMinutes} min ETA</span>
                  </div>

                  <div className="buyer-step-line pending" />

                  <div className="buyer-step pending">
                    <div className="buyer-step-circle">
                      <MapPin size={14} />
                    </div>
                    <span className="buyer-step-title">{lang === 'en' ? 'Delivered' : 'டெலிவரி'}</span>
                    <span className="buyer-step-time">Est. 09:45 AM</span>
                  </div>
                </div>
              </div>

              {/* LIVE MAP & TELEMETRY SPLIT LAYOUT (Section 11, 12, 13) */}
              <div className="buyer-map-tracking-layout">
                {/* Visual Logistics Map (Realistic SVG Logistics Route) */}
                <div className="buyer-map-container">
                  <div className="buyer-map-header-overlay">
                    <div className="buyer-map-legend">
                      <span className="legend-item"><span className="dot hub" /> Collection Hub</span>
                      <span className="legend-item"><span className="dot vehicle" /> Tata Ace EV</span>
                      <span className="legend-item"><span className="dot destination" /> Buyer Destination</span>
                    </div>
                    <div className="buyer-map-speed-pill">
                      <Zap size={14} /> {trackingOrder.liveTracking.speedKmh} km/h • Battery {trackingOrder.liveTracking.batteryPct}%
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

                      {/* Primary Highway Corridor (NH-44 Dindigul - Madurai Expressway) */}
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

                      {/* Waypoint 2: Intermediate Checkpoint (Kodai Road Toll) */}
                      <g transform="translate(320, 200)">
                        <circle r="5" fill="#64748b" />
                        <text x="12" y="4" className="svg-node-sub">Kodai Road Toll (Cleared)</text>
                      </g>

                      {/* Waypoint 3: Samayanallur Bypass */}
                      <g transform="translate(460, 260)">
                        <circle r="5" fill="#64748b" />
                        <text x="12" y="4" className="svg-node-sub">Samayanallur Bypass</text>
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
                      <g transform="translate(480, 275)" filter="url(#shadowFilter)" className="buyer-ev-marker-group">
                        {/* Radar Pulse ring */}
                        <circle r="26" fill="rgba(16, 185, 129, 0.22)" className="animate-ping-slow" />
                        <rect x="-24" y="-18" width="48" height="36" rx="8" fill="#0f4a30" stroke="#ffffff" strokeWidth="2.5" />
                        {/* Vehicle Icon representation */}
                        <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="16">🚚</text>

                        {/* Floating live tag over vehicle */}
                        <g transform="translate(0, -32)">
                          <rect x="-56" y="-12" width="112" height="24" rx="12" fill="#0f172a" opacity="0.9" />
                          <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="600">
                            EV In Transit • 42 km/h
                          </text>
                        </g>
                      </g>
                    </svg>
                  </div>

                  <div className="buyer-map-footer-bar">
                    <span className="buyer-gps-text">
                      <span className="live-gps-dot" /> Live Telemetry Synced (GPS Accuracy: 2.1m)
                    </span>
                    <button
                      type="button"
                      className="buyer-map-action-btn"
                      onClick={() => setToastMessage({ type: 'info', text: 'Telemetry refreshed. Vehicle is 12.4 km away.' })}
                    >
                      <RotateCcw size={13} /> {lang === 'en' ? 'Refresh GPS' : 'ஜிபிஎஸ் புதுப்பிக்க'}
                    </button>
                  </div>
                </div>

                {/* SIDEBAR TELEMETRY & DRIVER INFORMATION CARDS */}
                <div className="buyer-telemetry-sidebar">
                  {/* Live Status Card (Section 12) */}
                  <div className="buyer-status-card">
                    <div className="buyer-status-card-header">
                      <div className="buyer-radar-pulse">
                        <span className="pulse-dot-inner" />
                      </div>
                      <div>
                        <span className="buyer-status-label">{lang === 'en' ? 'Current Status' : 'தற்போதைய நிலை'}</span>
                        <h4 className="buyer-status-main">{trackingOrder.liveTracking.currentStatus}</h4>
                      </div>
                    </div>

                    <div className="buyer-status-grid">
                      <div className="buyer-status-stat">
                        <span className="stat-label">{lang === 'en' ? 'Current Location' : 'தற்போதைய இடம்'}</span>
                        <span className="stat-val">{trackingOrder.liveTracking.currentLocation}</span>
                      </div>
                      <div className="buyer-status-stat highlight">
                        <span className="stat-label">{lang === 'en' ? 'Estimated Arrival' : 'மதிப்பிடப்பட்ட நேரம்'}</span>
                        <span className="stat-val highlight">{trackingOrder.liveTracking.estimatedMinutes} min</span>
                      </div>
                      <div className="buyer-status-stat">
                        <span className="stat-label">{lang === 'en' ? 'Distance Remaining' : 'மீதமுள்ள தூரம்'}</span>
                        <span className="stat-val">{trackingOrder.liveTracking.distanceKm} km</span>
                      </div>
                      <div className="buyer-status-stat">
                        <span className="stat-label">{lang === 'en' ? 'Last Updated' : 'புதுப்பிக்கப்பட்டது'}</span>
                        <span className="stat-val">{trackingOrder.liveTracking.lastUpdated}</span>
                      </div>
                    </div>
                  </div>

                  {/* Compact Driver Details Card (Section 13) */}
                  <div className="buyer-driver-card">
                    <div className="buyer-driver-card-header">
                      <span className="buyer-driver-heading">{lang === 'en' ? 'Driver Details' : 'ஓட்டுநர் விவரங்கள்'}</span>
                      <span className="buyer-vehicle-tag">Electric Cargo</span>
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
                          <span>840+ deliveries</span>
                        </div>
                      </div>
                    </div>

                    <div className="buyer-driver-vehicle-specs">
                      <div className="buyer-spec-row">
                        <span className="spec-name">{lang === 'en' ? 'Vehicle' : 'வாகனம்'}</span>
                        <span className="spec-value">{trackingOrder.driver.vehicleType}</span>
                      </div>
                      <div className="buyer-spec-row">
                        <span className="spec-name">{lang === 'en' ? 'Registration' : 'வாகன எண்'}</span>
                        <span className="spec-value font-mono">{trackingOrder.driver.vehicleNumber}</span>
                      </div>
                      <div className="buyer-spec-row">
                        <span className="spec-name">{lang === 'en' ? 'Capacity' : 'கொள்ளளவு'}</span>
                        <span className="spec-value">{trackingOrder.driver.capacityKg} kg</span>
                      </div>
                      <div className="buyer-spec-row pin-highlight">
                        <span className="spec-name">{lang === 'en' ? 'Delivery PIN' : 'டெலிவரி PIN'}</span>
                        <span className="spec-value pin-code">{trackingOrder.driver.deliveryPin}</span>
                      </div>
                    </div>

                    <div className="buyer-driver-actions">
                      <a
                        href={`tel:${trackingOrder.driver.phone}`}
                        className="buyer-btn-primary full-width"
                      >
                        <Phone size={15} />
                        <span>{lang === 'en' ? 'Call Driver' : 'ஓட்டுநரை அழைக்க'} ({trackingOrder.driver.phone})</span>
                      </a>
                    </div>
                  </div>

                  {/* Farmer Summary for this dispatched batch */}
                  <div className="buyer-farmer-dispatched-card">
                    <div className="buyer-spec-row">
                      <span className="spec-name">{lang === 'en' ? 'Produce Grower' : 'விவசாயி'}</span>
                      <span className="spec-value">{trackingOrder.farmer.name} ({trackingOrder.farmer.location})</span>
                    </div>
                    <div className="buyer-spec-row">
                      <span className="spec-name">{lang === 'en' ? 'Dispatched From' : 'புறப்பட்ட மையம்'}</span>
                      <span className="spec-value">{trackingOrder.hub}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              SECTION 14: MY ORDERS (HISTORY & STATUSES)
              ================================================================ */}
          {activeNav === 'orders' && (
            <div className="buyer-view-container animate-fade-in">
              <div className="buyer-view-header">
                <div>
                  <h1 className="buyer-view-title">{t.navOrders}</h1>
                  <p className="buyer-view-subtitle">
                    {lang === 'en'
                      ? 'Review active shipments, completed deliveries, and direct farm invoices.'
                      : 'செயலில் உள்ள மற்றும் முடிக்கப்பட்ட அனைத்து ஆர்டர்களின் விவரங்கள்.'}
                  </p>
                </div>
                <div className="buyer-order-tab-pills">
                  <button
                    type="button"
                    className={`buyer-tab-pill ${activeOrderFilter === 'active' ? 'active' : ''}`}
                    onClick={() => setActiveOrderFilter('active')}
                  >
                    {lang === 'en' ? 'Active' : 'செயலில்'} ({orders.filter(o => o.status !== 'delivered').length})
                  </button>
                  <button
                    type="button"
                    className={`buyer-tab-pill ${activeOrderFilter === 'completed' ? 'active' : ''}`}
                    onClick={() => setActiveOrderFilter('completed')}
                  >
                    {lang === 'en' ? 'Completed' : 'முடிக்கப்பட்டது'} ({orders.filter(o => o.status === 'delivered').length})
                  </button>
                  <button
                    type="button"
                    className={`buyer-tab-pill ${activeOrderFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveOrderFilter('all')}
                  >
                    {lang === 'en' ? 'All Orders' : 'அனைத்தும்'} ({orders.length})
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
                              <span>{lang === 'en' ? 'On the Way' : 'வழியில் உள்ளது'}</span>
                            </>
                          )}
                          {order.status === 'preparing' && (
                            <>
                              <Clock size={13} />
                              <span>{lang === 'en' ? 'Preparing at Hub' : 'தயாராகிறது'}</span>
                            </>
                          )}
                          {order.status === 'confirmed' && (
                            <>
                              <CheckCircle2 size={13} />
                              <span>{lang === 'en' ? 'Order Confirmed' : 'உறுதி செய்யப்பட்டது'}</span>
                            </>
                          )}
                          {order.status === 'delivered' && (
                            <>
                              <CheckCircle2 size={13} />
                              <span>{lang === 'en' ? 'Delivered ✓' : 'டெலிவரி செய்யப்பட்டது ✓'}</span>
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
                            <span className="metric-label">{lang === 'en' ? 'Quantity' : 'அளவு'}</span>
                            <span className="metric-val">{order.quantityKg} kg</span>
                          </div>
                          <div className="buyer-metric-item">
                            <span className="metric-label">{lang === 'en' ? 'Rate' : 'விலை'}</span>
                            <span className="metric-val">₹{order.unitPrice} / kg</span>
                          </div>
                          <div className="buyer-metric-item total">
                            <span className="metric-label">{lang === 'en' ? 'Total' : 'மொத்தம்'}</span>
                            <span className="metric-val total">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="buyer-order-card-footer">
                        <div className="buyer-driver-mini">
                          <Truck size={14} />
                          <span>Driver: <strong>{order.driver.name}</strong> ({order.driver.vehicleNumber})</span>
                        </div>
                        <div className="buyer-order-actions">
                          {order.status !== 'delivered' ? (
                            <button
                              type="button"
                              className="buyer-btn-primary small"
                              onClick={() => {
                                setSelectedTrackingOrderId(order.orderId);
                                setActiveNav('track');
                              }}
                            >
                              <Navigation size={14} />
                              <span>{lang === 'en' ? 'Track Delivery' : 'கண்காணிக்க'}</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="buyer-btn-outline small"
                              onClick={() => setToastMessage({ type: 'info', text: `Invoice for ${order.orderId} downloaded.` })}
                            >
                              <span>{lang === 'en' ? 'View Invoice' : 'விலைப்பட்டியல்'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ================================================================
              SECTION: DIRECT MESSAGES WITH GROWER & DRIVER
              ================================================================ */}
          {activeNav === 'messages' && (
            <div className="buyer-view-container animate-fade-in">
              <div className="buyer-view-header">
                <div>
                  <h1 className="buyer-view-title">{t.navMessages}</h1>
                  <p className="buyer-view-subtitle">
                    Direct communications with verified farmers, hub inspectors, and delivery drivers.
                  </p>
                </div>
              </div>

              <div className="buyer-chat-card">
                <div className="buyer-chat-header">
                  <div className="buyer-chat-participant">
                    <div className="buyer-chat-avatar">
                      <Truck size={18} />
                    </div>
                    <div>
                      <h4 className="buyer-chat-name">Active Dispatch Channel (#NU-2026-00124)</h4>
                      <p className="buyer-chat-status">
                        <span className="status-live-beacon" /> Driver Kumar M. & Farmer Ravi Kumar
                      </p>
                    </div>
                  </div>
                </div>

                <div className="buyer-chat-messages">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`buyer-message-bubble ${m.isBuyer ? 'buyer-own' : 'buyer-external'}`}
                    >
                      <div className="buyer-msg-meta">
                        <span className="buyer-msg-sender">{m.sender}</span>
                        <span className="buyer-msg-role">({m.role})</span>
                        <span className="buyer-msg-time">{m.time}</span>
                      </div>
                      <p className="buyer-msg-text">{m.text}</p>
                    </div>
                  ))}
                </div>

                <form className="buyer-chat-input-bar" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    className="buyer-chat-input"
                    placeholder="Type dispatch instructions or reply to driver..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <button type="submit" className="buyer-btn-primary">
                    <Send size={15} />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ================================================================
              SECTION 19: BUYER PROFILE
              ================================================================ */}
          {activeNav === 'profile' && (
            <div className="buyer-view-container animate-fade-in">
              <div className="buyer-view-header">
                <div>
                  <h1 className="buyer-view-title">{t.navProfile}</h1>
                  <p className="buyer-view-subtitle">
                    Commercial buyer procurement credentials and loading bay delivery addresses.
                  </p>
                </div>
              </div>

              <div className="buyer-profile-layout">
                {/* Hidden File Input for Direct Photo Update */}
                <input
                  type="file"
                  ref={photoInputRef}
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handlePhotoUpload}
                />

                <div className="buyer-profile-box">
                  {/* Top Profile Banner with Uploaded Photo & Verification */}
                  <div className="buyer-profile-top-banner">
                    <div className="buyer-profile-photo-wrapper">
                      {profile.photo || profile.photoPreview ? (
                        <img
                          src={profile.photo || profile.photoPreview}
                          alt={profile.shopName || profile.name}
                          className="buyer-profile-photo-large"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="buyer-profile-photo-fallback">
                          <Building2 size={36} />
                        </div>
                      )}
                      {/* Photo Change Badge Button */}
                      <button
                        type="button"
                        className="buyer-profile-photo-change-btn"
                        onClick={() => photoInputRef.current?.click()}
                        title="Upload / Change Photo"
                        aria-label="Change photo"
                      >
                        <Camera size={14} />
                      </button>
                    </div>

                    <div className="buyer-profile-header-text">
                      <div className="buyer-profile-name-row">
                        <h2 className="buyer-profile-firm-name">{profile.shopName || profile.name}</h2>
                        <span className="buyer-verified-badge">
                          <CheckCircle2 size={13} />
                          <span>{lang === 'en' ? 'Verified Buyer' : 'சரிபார்க்கப்பட்டது'}</span>
                        </span>
                      </div>
                      <p className="buyer-profile-firm-sub">
                        👤 {profile.contactPerson || profile.name} • {profile.businessType || 'Commercial Produce Buyer'}
                      </p>
                      <div className="buyer-profile-meta-tags">
                        <span className="buyer-category-pill">
                          {profile.buyerType === 'hotel' && <Building2 size={12} />}
                          {profile.buyerType === 'supermarket' && <ShoppingCart size={12} />}
                          {profile.buyerType === 'retailer' && <Store size={12} />}
                          {profile.buyerType === 'mahal' && <Building2 size={12} />}
                          <span>
                            {profile.buyerType === 'hotel' ? 'Hotel & Commercial Kitchen' : profile.buyerType === 'supermarket' ? 'Supermarket Chain' : profile.buyerType === 'retailer' ? 'Retail Produce Store' : profile.buyerType === 'mahal' ? 'Mandapam / Mahal' : 'Commercial Buyer'}
                          </span>
                        </span>
                        <span className="buyer-id-pill">ID: NU-BYR-2026</span>
                      </div>
                    </div>
                  </div>

                  {/* Complete 8-Field Details Grid (All information from Sign In & Sign Up) */}
                  <div className="buyer-profile-details-grid">
                    {/* 1. Contact Person */}
                    <div className="buyer-detail-item">
                      <span className="detail-label">{lang === 'en' ? 'Contact Person / Full Name' : 'தொடர்பு நபர் / முழு பெயர்'}</span>
                      <span className="detail-value">{profile.contactPerson || profile.name}</span>
                      <span className="detail-subtext">{lang === 'en' ? 'Authorized Procurement Officer' : 'அங்கீகரிக்கப்பட்ட கொள்முதல் அதிகாரி'}</span>
                    </div>

                    {/* 2. Phone Number */}
                    <div className="buyer-detail-item">
                      <span className="detail-label">{lang === 'en' ? 'Mobile / Contact Number' : 'மொபைல் / தொடர்பு எண்'}</span>
                      <span className="detail-value font-mono">{profile.phone}</span>
                      <span className="detail-status-pill green">
                        <Check size={11} /> {lang === 'en' ? 'Verified Mobile' : 'சரிபார்க்கப்பட்டது'}
                      </span>
                    </div>

                    {/* 3. Corporate Email */}
                    <div className="buyer-detail-item">
                      <span className="detail-label">{lang === 'en' ? 'Procurement Email Address' : 'மின்னஞ்சல் முகவரி'}</span>
                      <span className="detail-value">{profile.email}</span>
                      <span className="detail-status-pill green">
                        <Check size={11} /> {lang === 'en' ? 'E-Invoicing Enabled' : 'மின்-விலைப்பட்டியல்'}
                      </span>
                    </div>

                    {/* 4. Shop / Business Name */}
                    <div className="buyer-detail-item">
                      <span className="detail-label">{lang === 'en' ? 'Shop / Commercial Business Name' : 'கடை / நிறுவன பெயர்'}</span>
                      <span className="detail-value font-semibold">{profile.shopName || profile.name}</span>
                      <span className="detail-subtext">{lang === 'en' ? 'Registered Commercial Trade Entity' : 'பதிவு செய்யப்பட்ட வணிக நிறுவனம்'}</span>
                    </div>

                    {/* 5. Commercial Buyer Type */}
                    <div className="buyer-detail-item">
                      <span className="detail-label">{lang === 'en' ? 'Commercial Buyer Category' : 'வாங்குபவர் பிரிவு'}</span>
                      <span className="detail-value">
                        {profile.buyerType === 'hotel' ? 'Hotel, Restaurant & Commercial Kitchen' : profile.buyerType === 'supermarket' ? 'Supermarket & Grocery Retail Chain' : profile.buyerType === 'retailer' ? 'Local Produce Retailer' : profile.buyerType === 'mahal' ? 'Mandapam / Mahal Banquet Facility' : (profile.businessType || 'Commercial Buyer')}
                      </span>
                      <span className="detail-subtext">{lang === 'en' ? 'Direct Farm Gate Bulk Access' : 'நேரடி மொத்த கொள்முதல்'}</span>
                    </div>

                    {/* 6. GSTIN Number */}
                    <div className="buyer-detail-item">
                      <span className="detail-label">{lang === 'en' ? 'GSTIN Tax Identification' : 'வணிக ஜிஎஸ்டி எண்'}</span>
                      <span className="detail-value font-mono">{profile.gstin}</span>
                      <span className="detail-status-pill green">
                        <ShieldCheck size={11} /> {lang === 'en' ? 'Verified GST Portal ✓' : 'ஜிஎஸ்டி சரிபார்க்கப்பட்டது ✓'}
                      </span>
                    </div>

                    {/* 7. Loading Bay Delivery Address */}
                    <div className="buyer-detail-item full-width">
                      <span className="detail-label">{lang === 'en' ? 'Kitchen & Loading Bay Delivery Address' : 'சரக்கு வந்துசேரும் முகவரி'}</span>
                      <span className="detail-value">{profile.address}</span>
                      <span className="detail-subtext">{lang === 'en' ? 'Dedicated unloading gate for Tata Ace EV & cargo transport vehicles' : 'மின்சார சரக்கு வாகனங்களுக்கான இறக்குமிடம்'}</span>
                    </div>

                    {/* 8. KYC Document & Profile Photo Status */}
                    <div className="buyer-detail-item">
                      <span className="detail-label">{lang === 'en' ? 'Uploaded Business Photo / KYC' : 'பதிவேற்றிய புகைப்படம்'}</span>
                      <div className="buyer-doc-preview-chip">
                        {profile.photo || profile.photoPreview ? (
                          <img
                            src={profile.photo || profile.photoPreview}
                            alt="Document Thumbnail"
                            className="buyer-doc-mini-thumb"
                          />
                        ) : (
                          <Building2 size={16} />
                        )}
                        <span>{lang === 'en' ? 'Photo Attached & Verified' : 'புகைப்படம் இணைக்கப்பட்டது'}</span>
                      </div>
                    </div>

                    {/* 9. Hub Allocation & PIN */}
                    <div className="buyer-detail-item">
                      <span className="detail-label">{lang === 'en' ? 'Assigned Hub & Unloading PIN' : 'ஒதுக்கப்பட்ட மையம் & PIN'}</span>
                      <span className="detail-value">Dindigul Central Hub</span>
                      <span className="detail-subtext">Security PIN: <strong>4892</strong></span>
                    </div>
                  </div>

                  {/* Profile Action Buttons */}
                  <div className="buyer-profile-footer-actions">
                    <button
                      type="button"
                      className="buyer-btn-outline"
                      onClick={() => photoInputRef.current?.click()}
                    >
                      <Camera size={15} />
                      <span>{lang === 'en' ? 'Change Photo' : 'புகைப்படம் மாற்ற'}</span>
                    </button>
                    <button
                      type="button"
                      className="buyer-btn-primary"
                      onClick={handleOpenEditProfile}
                    >
                      <Edit3 size={15} />
                      <span>{lang === 'en' ? 'Edit Business Details' : 'விவரங்களை திருத்த'}</span>
                    </button>
                    <button
                      type="button"
                      className="buyer-btn-danger"
                      onClick={() => {
                        if (onLogout) onLogout();
                        else window.location.hash = '#buyer-login';
                      }}
                    >
                      <LogOut size={15} />
                      <span>{lang === 'en' ? 'Sign Out / Logout' : 'வெளியேறுக'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ====================================================================
          EDIT PROFILE MODAL (Update Photo & Business Information)
          ==================================================================== */}
      {editProfileOpen && (
        <div className="buyer-modal-backdrop" onClick={() => setEditProfileOpen(false)}>
          <div className="buyer-modal-panel profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="buyer-modal-header">
              <div className="buyer-modal-icon-wrap green">
                <Edit3 size={20} />
              </div>
              <div>
                <h3 className="buyer-modal-title">
                  {lang === 'en' ? 'Edit Business Profile' : 'வணிக விவரங்களை திருத்து'}
                </h3>
                <p className="buyer-modal-subtitle">
                  {lang === 'en'
                    ? 'Update your commercial entity credentials, contact information, and business photo.'
                    : 'உங்கள் வணிக விவரங்கள், தொடர்பு எண் மற்றும் புகைப்படத்தை புதுப்பிக்கவும்.'}
                </p>
              </div>
              <button
                type="button"
                className="buyer-modal-close-btn"
                onClick={() => setEditProfileOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div className="buyer-modal-body">
                {/* Photo Update Section */}
                <div className="buyer-edit-photo-row">
                  <div className="buyer-edit-photo-wrap">
                    {editFormData.photo || editFormData.photoPreview ? (
                      <img
                        src={editFormData.photo || editFormData.photoPreview}
                        alt="Profile preview"
                        className="buyer-edit-photo-img"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <Building2 size={32} />
                    )}
                  </div>
                  <div className="buyer-edit-photo-info">
                    <span className="buyer-edit-photo-title">
                      {lang === 'en' ? 'Profile & Store Photo' : 'சுயவிவரப் படம்'}
                    </span>
                    <p className="buyer-edit-photo-desc">
                      {lang === 'en'
                        ? 'Appears in top right navigation & supplier orders'
                        : 'டாஷ்போர்டின் மேல் வலது மூலையில் தோன்றும்'}
                    </p>
                    <label className="buyer-btn-outline buyer-btn-xs buyer-upload-label">
                      <Camera size={13} />
                      <span>{lang === 'en' ? 'Upload New Photo' : 'புகைப்படம் பதிவேற்ற'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            setEditFormData((prev) => ({
                              ...prev,
                              photo: ev.target.result,
                              photoPreview: ev.target.result
                            }));
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="buyer-edit-grid">
                  <div className="buyer-form-group">
                    <label className="buyer-field-label">
                      {lang === 'en' ? 'Contact Person / Full Name' : 'தொடர்பு நபர்'}
                    </label>
                    <input
                      type="text"
                      className="buyer-text-input"
                      value={editFormData.contactPerson || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, contactPerson: e.target.value })}
                      required
                    />
                  </div>

                  <div className="buyer-form-group">
                    <label className="buyer-field-label">
                      {lang === 'en' ? 'Shop / Commercial Business Name' : 'கடை / நிறுவன பெயர்'}
                    </label>
                    <input
                      type="text"
                      className="buyer-text-input"
                      value={editFormData.shopName || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, shopName: e.target.value, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="buyer-form-group">
                    <label className="buyer-field-label">
                      {lang === 'en' ? 'Mobile Number' : 'மொபைல் எண்'}
                    </label>
                    <input
                      type="tel"
                      className="buyer-text-input"
                      value={editFormData.phone || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="buyer-form-group">
                    <label className="buyer-field-label">
                      {lang === 'en' ? 'Procurement Email' : 'மின்னஞ்சல்'}
                    </label>
                    <input
                      type="email"
                      className="buyer-text-input"
                      value={editFormData.email || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="buyer-form-group">
                    <label className="buyer-field-label">
                      {lang === 'en' ? 'Commercial Buyer Category' : 'வாங்குபவர் பிரிவு'}
                    </label>
                    <select
                      className="buyer-text-input"
                      value={editFormData.buyerType || 'hotel'}
                      onChange={(e) => setEditFormData({ ...editFormData, buyerType: e.target.value })}
                    >
                      <option value="hotel">{lang === 'en' ? 'Hotel & Commercial Kitchen' : 'ஹோட்டல்'}</option>
                      <option value="supermarket">{lang === 'en' ? 'Supermarket Chain' : 'சூப்பர் மார்க்கெட்'}</option>
                      <option value="retailer">{lang === 'en' ? 'Retail Produce Store' : 'சில்லறை விற்பனையாளர்'}</option>
                      <option value="mahal">{lang === 'en' ? 'Mandapam / Function Hall' : 'திருமண மண்டபம்'}</option>
                    </select>
                  </div>

                  <div className="buyer-form-group">
                    <label className="buyer-field-label">
                      {lang === 'en' ? 'GSTIN Tax Identification' : 'ஜிஎஸ்டி எண்'}
                    </label>
                    <input
                      type="text"
                      className="buyer-text-input font-mono"
                      value={editFormData.gstin || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, gstin: e.target.value.toUpperCase() })}
                      required
                    />
                  </div>

                  <div className="buyer-form-group full-width">
                    <label className="buyer-field-label">
                      {lang === 'en' ? 'Loading Bay Delivery Address' : 'டெலிவரி முகவரி'}
                    </label>
                    <textarea
                      rows={2}
                      className="buyer-text-input"
                      value={editFormData.address || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="buyer-modal-footer">
                <button
                  type="button"
                  className="buyer-btn-outline"
                  onClick={() => setEditProfileOpen(false)}
                >
                  {lang === 'en' ? 'Cancel' : 'ரத்து செய்க'}
                </button>
                <button
                  type="submit"
                  className="buyer-btn-primary"
                >
                  <CheckCircle2 size={16} />
                  <span>{lang === 'en' ? 'Save Changes' : 'மாற்றங்களை சேமிக்கவும்'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          SECTION 7: DECLINE CONFIRMATION MODAL
          ==================================================================== */}
      {declineModalCrop && (
        <div className="buyer-modal-backdrop" onClick={() => setDeclineModalCrop(null)}>
          <div className="buyer-modal-panel decline-modal" onClick={(e) => e.stopPropagation()}>
            <div className="buyer-modal-header">
              <div className="buyer-modal-icon-wrap amber">
                <AlertCircle size={22} />
              </div>
              <div>
                <h3 className="buyer-modal-title">
                  {lang === 'en' ? 'Decline this crop?' : 'இந்த விளைபொருளை மறுக்கவா?'}
                </h3>
                <p className="buyer-modal-subtitle">
                  {lang === 'en'
                    ? `Are you sure you don't want to accept ${declineModalCrop.name}?`
                    : `${declineModalCrop.name} பயிரை நிராகரிக்க விரும்புகிறீர்களா?`}
                </p>
              </div>
              <button
                type="button"
                className="buyer-modal-close-btn"
                onClick={() => setDeclineModalCrop(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="buyer-modal-body">
              <div className="buyer-decline-crop-preview">
                <img
                  src={declineModalCrop.image}
                  alt={declineModalCrop.name}
                  className="buyer-decline-img"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80';
                  }}
                />
                <div>
                  <h4 className="buyer-preview-name">{declineModalCrop.name}</h4>
                  <p className="buyer-preview-meta">
                    {declineModalCrop.grade} • ₹{declineModalCrop.pricePerKg} / kg • Available: {declineModalCrop.availableKg} kg
                  </p>
                  <p className="buyer-preview-sub">
                    {lang === 'en'
                      ? 'Declining will remove this crop from your today list so you can focus on other produce.'
                      : 'நிராகரித்தால் இது இன்றைய பட்டியலில் இருந்து நீக்கப்படும்.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="buyer-modal-footer">
              <button
                type="button"
                className="buyer-btn-outline"
                onClick={() => setDeclineModalCrop(null)}
              >
                {lang === 'en' ? 'Cancel' : 'ரத்து செய்க'}
              </button>
              <button
                type="button"
                className="buyer-btn-danger"
                onClick={handleConfirmDecline}
              >
                {lang === 'en' ? 'Decline Crop' : 'மறுக்க'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          SECTION 7: ACCEPT PRODUCE CONFIRMATION PANEL
          ==================================================================== */}
      {acceptModalCrop && (
        <div className="buyer-modal-backdrop" onClick={() => setAcceptModalCrop(null)}>
          <div className="buyer-modal-panel accept-modal" onClick={(e) => e.stopPropagation()}>
            <div className="buyer-modal-header">
              <div className="buyer-modal-icon-wrap green">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <h3 className="buyer-modal-title">
                  {lang === 'en' ? `Accept ${acceptModalCrop.name}` : `${acceptModalCrop.name} ஏற்றுக்கொள்க`}
                </h3>
                <p className="buyer-modal-subtitle">
                  {lang === 'en'
                    ? 'Specify your desired quantity and review wholesale pricing.'
                    : 'தேவையான அளவை தேர்வு செய்து மொத்த விலையை சரிபார்க்கவும்.'}
                </p>
              </div>
              <button
                type="button"
                className="buyer-modal-close-btn"
                onClick={() => setAcceptModalCrop(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="buyer-modal-body">
              <div className="buyer-accept-produce-summary">
                <img
                  src={acceptModalCrop.image}
                  alt={acceptModalCrop.name}
                  className="buyer-accept-img"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="buyer-accept-details">
                  <div className="buyer-accept-tags">
                    <span className="buyer-grade-badge green">{acceptModalCrop.grade} ✓</span>
                    <span className="buyer-hub-loc-tag">{acceptModalCrop.hubName}</span>
                  </div>
                  <h4 className="buyer-accept-name">{acceptModalCrop.name}</h4>
                  <div className="buyer-accept-price-row">
                    <span className="buyer-accept-price">₹{acceptModalCrop.pricePerKg}</span>
                    <span className="buyer-accept-unit">/ kg (Direct Wholesale)</span>
                  </div>
                  <p className="buyer-accept-stock">
                    {lang === 'en' ? 'Available Hub Stock:' : 'கிடைக்கும் இருப்பு:'} <strong>{acceptModalCrop.availableKg} kg</strong>
                  </p>
                </div>
              </div>

              {/* Quantity Slider & Presets */}
              <div className="buyer-quantity-picker-box">
                <div className="buyer-picker-header">
                  <label htmlFor="quantity-input" className="buyer-picker-title">
                    {lang === 'en' ? 'Select Quantity (kg):' : 'தேவையான அளவு (கிலோ):'}
                  </label>
                  <div className="buyer-qty-input-wrap">
                    <input
                      id="quantity-input"
                      type="number"
                      min={acceptModalCrop.minOrderKg}
                      max={acceptModalCrop.availableKg}
                      step={10}
                      className="buyer-qty-numeric-input"
                      value={acceptedQuantity}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setAcceptedQuantity(Math.min(acceptModalCrop.availableKg, Math.max(acceptModalCrop.minOrderKg, val)));
                      }}
                    />
                    <span className="buyer-qty-unit-label">kg</span>
                  </div>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min={acceptModalCrop.minOrderKg}
                  max={acceptModalCrop.availableKg}
                  step={10}
                  className="buyer-range-slider"
                  value={acceptedQuantity}
                  onChange={(e) => setAcceptedQuantity(Number(e.target.value))}
                />

                {/* Quick Presets */}
                <div className="buyer-qty-presets">
                  {[50, 100, 200, 300, acceptModalCrop.availableKg].filter(q => q <= acceptModalCrop.availableKg).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      className={`buyer-preset-btn ${acceptedQuantity === preset ? 'active' : ''}`}
                      onClick={() => setAcceptedQuantity(preset)}
                    >
                      {preset === acceptModalCrop.availableKg ? `All (${preset} kg)` : `${preset} kg`}
                    </button>
                  ))}
                </div>

                {/* Calculated Estimated Total */}
                <div className="buyer-calc-total-banner">
                  <div>
                    <span className="buyer-calc-label">{lang === 'en' ? 'Estimated Total' : 'மதிப்பிடப்பட்ட தொகை'}</span>
                    <span className="buyer-calc-sub">({acceptedQuantity} kg × ₹{acceptModalCrop.pricePerKg}/kg)</span>
                  </div>
                  <span className="buyer-calc-val">₹{(acceptedQuantity * acceptModalCrop.pricePerKg).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="buyer-modal-footer">
              <button
                type="button"
                className="buyer-btn-outline"
                onClick={() => setAcceptModalCrop(null)}
              >
                {lang === 'en' ? 'Cancel' : 'ரத்து செய்க'}
              </button>
              <button
                type="button"
                className="buyer-btn-primary"
                onClick={handleProceedToFarmer}
              >
                <span>{lang === 'en' ? 'Accept Crop & View Farmer' : 'ஏற்றுக்கொள்க & உழவர் விவரம்'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          SECTION 8 & 9: FARMER DETAILS & ORDER CONFIRMATION PANEL
          (Farmer details shown ONLY after accept!)
          ==================================================================== */}
      {farmerDetailsCrop && (
        <div className="buyer-modal-backdrop" onClick={() => setFarmerDetailsCrop(null)}>
          <div className="buyer-modal-panel farmer-modal" onClick={(e) => e.stopPropagation()}>
            <div className="buyer-modal-header">
              <div className="buyer-modal-icon-wrap green">
                <ShieldCheck size={22} />
              </div>
              <div>
                <span className="buyer-badge-tag green">✓ Crop Accepted</span>
                <h3 className="buyer-modal-title">
                  {lang === 'en' ? 'Farmer Details & Order Review' : 'உழவர் விவரங்கள் & ஆர்டர் சரிபார்ப்பு'}
                </h3>
              </div>
              <button
                type="button"
                className="buyer-modal-close-btn"
                onClick={() => setFarmerDetailsCrop(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="buyer-modal-body">
              {/* Farmer Information Card (Section 8) */}
              <div className="buyer-farmer-dossier-card">
                <div className="buyer-dossier-header">
                  <div className="buyer-farmer-avatar-wrap">
                    <User size={26} />
                  </div>
                  <div className="buyer-farmer-names">
                    <h4 className="buyer-farmer-fullname">👤 {farmerDetailsCrop.farmer.name}</h4>
                    <span className="buyer-farmer-location">📍 {farmerDetailsCrop.farmer.village}</span>
                    <span className="buyer-grower-id">ID: {farmerDetailsCrop.farmer.farmerId}</span>
                  </div>
                  <div className="buyer-farmer-call-box">
                    <a
                      href={`tel:${farmerDetailsCrop.farmer.phone}`}
                      className="buyer-call-farmer-btn"
                      title="Direct telephone connect"
                    >
                      <Phone size={15} />
                      <span>{lang === 'en' ? 'Call Farmer' : 'அழைக்க'}</span>
                    </a>
                  </div>
                </div>

                <div className="buyer-farmer-specs-grid">
                  <div className="buyer-fspec-item">
                    <span className="fspec-label">{lang === 'en' ? 'Crop' : 'பயிர்'}</span>
                    <span className="fspec-val">{farmerDetailsCrop.name}</span>
                  </div>
                  <div className="buyer-fspec-item">
                    <span className="fspec-label">{lang === 'en' ? 'Grade' : 'தரம்'}</span>
                    <span className="fspec-val font-semibold">{farmerDetailsCrop.grade}</span>
                  </div>
                  <div className="buyer-fspec-item">
                    <span className="fspec-label">{lang === 'en' ? 'Accepted Quantity' : 'ஏற்றுக்கொண்ட அளவு'}</span>
                    <span className="fspec-val">{farmerDetailsCrop.selectedQty} kg</span>
                  </div>
                  <div className="buyer-fspec-item">
                    <span className="fspec-label">{lang === 'en' ? 'Contact Number' : 'தொடர்பு எண்'}</span>
                    <span className="fspec-val font-mono">{farmerDetailsCrop.farmer.phone}</span>
                  </div>
                </div>
              </div>

              {/* Order Summary (Section 9) */}
              <div className="buyer-order-summary-box">
                <h4 className="buyer-summary-box-title">
                  {lang === 'en' ? 'Order Summary' : 'ஆர்டர் சுருக்கம்'}
                </h4>
                <div className="buyer-summary-lines">
                  <div className="buyer-sline">
                    <span>{lang === 'en' ? 'Produce' : 'விளைபொருள்'}</span>
                    <span className="font-semibold">{farmerDetailsCrop.name} ({farmerDetailsCrop.grade})</span>
                  </div>
                  <div className="buyer-sline">
                    <span>{lang === 'en' ? 'Quantity' : 'அளவு'}</span>
                    <span>{farmerDetailsCrop.selectedQty} kg</span>
                  </div>
                  <div className="buyer-sline">
                    <span>{lang === 'en' ? 'Wholesale Price' : 'மொத்த விலை'}</span>
                    <span>₹{farmerDetailsCrop.pricePerKg} / kg</span>
                  </div>
                  <div className="buyer-sline">
                    <span>{lang === 'en' ? 'Middleman Commission' : 'இடைத்தரகர் கமிஷன்'}</span>
                    <span className="text-green-700 font-semibold">₹0 (Zero Brokerage)</span>
                  </div>
                  <div className="buyer-sline-divider" />
                  <div className="buyer-sline total">
                    <span>{lang === 'en' ? 'Estimated Total' : 'மதிப்பிடப்பட்ட மொத்தம்'}</span>
                    <span className="buyer-sline-total-val">₹{farmerDetailsCrop.estimatedTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="buyer-modal-footer">
              <button
                type="button"
                className="buyer-btn-outline"
                onClick={() => setFarmerDetailsCrop(null)}
              >
                {lang === 'en' ? 'Cancel' : 'ரத்து செய்க'}
              </button>
              <button
                type="button"
                className="buyer-btn-primary"
                onClick={handleConfirmOrder}
              >
                <CheckCircle2 size={16} />
                <span>{lang === 'en' ? 'Confirm Order & Schedule Dispatch' : 'ஆர்டரை உறுதிப்படுத்துக'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          SECTION 9: ORDER CONFIRMED MODAL (SUCCESS STATE)
          ==================================================================== */}
      {orderConfirmationData && (
        <div className="buyer-modal-backdrop">
          <div className="buyer-modal-panel success-modal">
            <div className="buyer-success-card">
              <div className="buyer-success-icon-badge">
                <Check size={36} />
              </div>
              <span className="buyer-success-sub-badge">✓ Order Confirmed</span>
              <h2 className="buyer-success-heading">
                {lang === 'en' ? 'Order Confirmed Successfully!' : 'ஆர்டர் வெற்றிகரமாக உறுதி செய்யப்பட்டது!'}
              </h2>
              <p className="buyer-success-message">
                {lang === 'en'
                  ? `Your order for ${orderConfirmationData.quantityKg} kg of ${orderConfirmationData.cropName} is scheduled for immediate vehicle dispatch.`
                  : `${orderConfirmationData.cropName} (${orderConfirmationData.quantityKg} kg) வாகனம் உடனடியாக புறப்பட தயாராகிறது.`}
              </p>

              <div className="buyer-confirmed-meta-box">
                <div className="buyer-cmeta-row">
                  <span className="cmeta-label">Order ID:</span>
                  <span className="cmeta-val font-mono">{orderConfirmationData.orderId}</span>
                </div>
                <div className="buyer-cmeta-row">
                  <span className="cmeta-label">Status:</span>
                  <span className="cmeta-val green">Preparing for Dispatch</span>
                </div>
                <div className="buyer-cmeta-row">
                  <span className="cmeta-label">Estimated Total:</span>
                  <span className="cmeta-val font-bold">₹{orderConfirmationData.totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="buyer-success-actions">
                <button
                  type="button"
                  className="buyer-btn-primary full-width"
                  onClick={() => handleGoToTracking(orderConfirmationData.orderId)}
                >
                  <Truck size={17} />
                  <span>{lang === 'en' ? 'Track Delivery Live' : 'டெலிவரியை கண்காணிக்கவும்'}</span>
                </button>
                <button
                  type="button"
                  className="buyer-btn-outline full-width"
                  onClick={() => {
                    setOrderConfirmationData(null);
                    setActiveNav('crops');
                  }}
                >
                  <span>{lang === 'en' ? 'Browse More Produce' : 'மேலும் பயிர்களை பார்க்க'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          SECTION 15: MOBILE BOTTOM NAVIGATION BAR
          ==================================================================== */}
      <nav className="buyer-mobile-bottom-nav">
        <button
          type="button"
          className={`buyer-mb-item ${activeNav === 'home' ? 'active' : ''}`}
          onClick={() => handleNavSelect('home')}
        >
          <Sprout size={18} />
          <span>{lang === 'en' ? 'Home' : 'முகப்பு'}</span>
        </button>

        <button
          type="button"
          className={`buyer-mb-item ${activeNav === 'crops' ? 'active' : ''}`}
          onClick={() => handleNavSelect('crops')}
        >
          <ShoppingBag size={18} />
          <span>{lang === 'en' ? 'Crops' : 'பயிர்கள்'}</span>
        </button>

        <button
          type="button"
          className={`buyer-mb-item ${activeNav === 'orders' ? 'active' : ''}`}
          onClick={() => handleNavSelect('orders')}
        >
          <PackageCheck size={18} />
          <span>{lang === 'en' ? 'Orders' : 'ஆர்டர்கள்'}</span>
        </button>

        <button
          type="button"
          className={`buyer-mb-item ${activeNav === 'track' ? 'active' : ''}`}
          onClick={() => handleNavSelect('track')}
        >
          <Truck size={18} />
          <span>{lang === 'en' ? 'Track' : 'ட்ராக்'}</span>
          <span className="buyer-mb-dot" />
        </button>

        <button
          type="button"
          className={`buyer-mb-item ${activeNav === 'messages' ? 'active' : ''}`}
          onClick={() => handleNavSelect('messages')}
        >
          <MessageSquare size={18} />
          <span>{lang === 'en' ? 'Chat' : 'செய்தி'}</span>
          <span className="buyer-mb-badge">2</span>
        </button>

        <button
          type="button"
          className={`buyer-mb-item ${activeNav === 'profile' ? 'active' : ''}`}
          onClick={() => handleNavSelect('profile')}
        >
          <User size={18} />
          <span>{lang === 'en' ? 'Profile' : 'சுயவிவரம்'}</span>
        </button>
      </nav>

      {/* TOAST NOTIFICATION POPUP */}
      {toastMessage && (
        <div className={`buyer-toast-notification ${toastMessage.type}`}>
          {toastMessage.type === 'success' && <CheckCircle2 size={16} />}
          {toastMessage.type === 'info' && <Info size={16} />}
          <span>{toastMessage.text}</span>
          <button type="button" onClick={() => setToastMessage(null)} className="toast-close">
            <X size={13} />
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * REUSABLE CROP CARD COMPONENT (Section 6 & Section 16)
 * Strict responsive card: 3-4 on desktop, 2 on tablet, 1 on mobile
 */
function CropCard({ crop, _lang, t, onAccept, onDecline }) {
  return (
    <div className="buyer-crop-card">
      {/* Real Crop Image with harvest time badge */}
      <div className="buyer-crop-img-wrap">
        <img
          src={crop.image}
          alt={crop.name}
          className="buyer-crop-img"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80';
          }}
        />
        <span className="buyer-crop-harvest-badge">
          <Clock size={11} /> {crop.harvestTime}
        </span>
        {crop.grade === 'Grade A' && (
          <span className="buyer-crop-grade-tag grade-a">Grade A ✓</span>
        )}
        {crop.grade === 'Grade B' && (
          <span className="buyer-crop-grade-tag grade-b">Grade B</span>
        )}
      </div>

      {/* Card Content */}
      <div className="buyer-crop-card-body">
        {/* Title & Hub Row */}
        <div className="buyer-crop-title-group">
          <h3 className="buyer-crop-name">{crop.name}</h3>
          <span className="buyer-crop-tamil-name">{crop.tamilName}</span>
        </div>

        {/* Price with strong visual hierarchy */}
        <div className="buyer-crop-price-box">
          <span className="buyer-price-currency">₹</span>
          <span className="buyer-price-number">{crop.pricePerKg}</span>
          <span className="buyer-price-unit">{t.perKg}</span>
        </div>

        {/* Quantity & Hub details */}
        <div className="buyer-crop-meta-rows">
          <div className="buyer-meta-item">
            <span className="meta-label">{t.available}</span>
            <span className="meta-value font-semibold">{crop.availableKg} kg</span>
          </div>
          <div className="buyer-meta-item">
            <span className="meta-label">{t.hub}</span>
            <span className="meta-value hub-name">
              <MapPin size={12} /> {crop.hubName}
            </span>
          </div>
        </div>

        {/* Action Buttons: Accept (Deep Green Filled) & Decline (Neutral Outlined) */}
        <div className="buyer-crop-card-actions">
          <button
            type="button"
            className="buyer-btn-accept"
            onClick={onAccept}
          >
            {t.btnAccept}
          </button>
          <button
            type="button"
            className="buyer-btn-decline"
            onClick={onDecline}
          >
            {t.btnDecline}
          </button>
        </div>
      </div>
    </div>
  );
}

