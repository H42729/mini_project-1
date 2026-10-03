/**
 * Seed data for Buyer Feature: Today's Hub Fresh Produce & Consignments
 */

export const INITIAL_CROPS = [
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
    name: "Tender Lady's Finger (Vendakkai)",
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

export const INITIAL_ORDERS = [
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

export const INITIAL_MESSAGES = [
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
];
