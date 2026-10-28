// seed.js - Database initialization script for Naam Uzhavar
// Viva Note: Clears old test collections and seeds production-grade agricultural data
// including regional crops, a demo buyer account, sample EV orders, and chat messages.
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const Buyer = require('./models/Buyer');
const Crop = require('./models/Crop');
const Order = require('./models/Order');
const Message = require('./models/Message');

const SEED_CROPS = [
  {
    name: 'Country Tomato',
    nameTa: 'நாட்டு தக்காளி',
    category: 'vegetables',
    grade: 'Grade A',
    pricePerKg: 32,
    quantityKg: 500,
    farmerName: 'Ravi Kumar (Siluvathur)',
    hub: 'Dindigul Central',
    distanceKm: 12,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Oddanchatram Fresh Salad Tomatoes',
    nameTa: 'நாட்டு தக்காளி',
    category: 'vegetables',
    grade: 'Grade A',
    pricePerKg: 27,
    quantityKg: 650,
    farmerName: 'P. Murugesan (Oddanchatram)',
    hub: 'Oddanchatram',
    distanceKm: 28,
    image: 'https://images.unsplash.com/photo-1561136594-7f68413baa99?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: "Tender Lady's Finger (Vendakkai)",
    nameTa: 'வெண்டைக்காய்',
    category: 'vegetables',
    grade: 'Grade C',
    pricePerKg: 30,
    quantityKg: 250,
    farmerName: 'T. Meenakshi (Batlagundu)',
    hub: 'Batlagundu',
    distanceKm: 32,
    image: 'https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Kodaikanal Sweet Crisp Carrots',
    nameTa: 'மலை கேரட்',
    category: 'vegetables',
    grade: 'Grade A',
    pricePerKg: 34,
    quantityKg: 520,
    farmerName: 'K. Selvam (Poombarai)',
    hub: 'Kodaikanal',
    distanceKm: 45,
    image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Oddanchatram Sambar Veggie Pack',
    nameTa: 'சாம்பார் காய்கறி தொகுப்பு',
    category: 'vegetables',
    grade: 'Grade B',
    pricePerKg: 21,
    quantityKg: 800,
    farmerName: 'S. Velumani (Kallimanthayam)',
    hub: 'Oddanchatram',
    distanceKm: 28,
    image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Small Shallots (Chinna Vengayam)',
    nameTa: 'சின்ன வெங்காயம்',
    category: 'vegetables',
    grade: 'Grade A',
    pricePerKg: 58,
    quantityKg: 400,
    farmerName: 'P. Murugesan (Oddanchatram)',
    hub: 'Oddanchatram',
    distanceKm: 28,
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Palani Farm Red Onions Lot',
    nameTa: 'பெரிய வெங்காயம்',
    category: 'vegetables',
    grade: 'Grade B',
    pricePerKg: 38,
    quantityKg: 700,
    farmerName: 'M. Ramasamy (Ayakudi)',
    hub: 'Palani',
    distanceKm: 38,
    image: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Farm Bulk Gravy Tomatoes',
    nameTa: 'நாட்டு தக்காளி (கிரேடு C)',
    category: 'vegetables',
    grade: 'Grade C',
    pricePerKg: 20,
    quantityKg: 750,
    farmerName: 'M. Chinnasamy (Reddiarchatram)',
    hub: 'Dindigul Central',
    distanceKm: 14,
    image: 'https://images.unsplash.com/photo-1546470427-e26264be0b11?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Nilakottai Fresh Green Produce',
    nameTa: 'பச்சை காய்கறி கலவை',
    category: 'vegetables',
    grade: 'Grade A',
    pricePerKg: 42,
    quantityKg: 480,
    farmerName: 'A. Ganesan (Nilakottai)',
    hub: 'Nilakottai',
    distanceKm: 24,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Batlagundu Gravy Potato & Onion Lot',
    nameTa: 'உருளை & வெங்காயம்',
    category: 'vegetables',
    grade: 'Grade B',
    pricePerKg: 25,
    quantityKg: 900,
    farmerName: 'T. Meenakshi (Batlagundu)',
    hub: 'Batlagundu',
    distanceKm: 32,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Hill Country Carrots',
    nameTa: 'மலை கேரட்',
    category: 'vegetables',
    grade: 'Grade A',
    pricePerKg: 45,
    quantityKg: 350,
    farmerName: 'K. Selvam (Poombarai)',
    hub: 'Kodaikanal',
    distanceKm: 45,
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Dindigul Round Brinjal (Kathirikkai)',
    nameTa: 'நாட்டு கத்திரிக்காய் (கிரேடு C)',
    category: 'vegetables',
    grade: 'Grade C',
    pricePerKg: 24,
    quantityKg: 450,
    farmerName: 'S. Alagarsamy (Oddanchatram)',
    hub: 'Oddanchatram',
    distanceKm: 26,
    image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Samba Green Chillies',
    nameTa: 'பச்சை மிளகாய்',
    category: 'vegetables',
    grade: 'Grade A',
    pricePerKg: 62,
    quantityKg: 180,
    farmerName: 'A. Ganesan (Nilakottai)',
    hub: 'Nilakottai',
    distanceKm: 24,
    image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Nilakottai Sambar Drumsticks',
    nameTa: 'முருங்கைக்காய் (கிரேடு C)',
    category: 'vegetables',
    grade: 'Grade C',
    pricePerKg: 35,
    quantityKg: 320,
    farmerName: 'R. Dharmaraj (Nilakottai)',
    hub: 'Nilakottai',
    distanceKm: 22,
    image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Palani Fresh Potatoes',
    nameTa: 'உருளைக்கிழங்கு',
    category: 'vegetables',
    grade: 'Grade B',
    pricePerKg: 28,
    quantityKg: 800,
    farmerName: 'M. Ramasamy (Ayakudi)',
    hub: 'Palani',
    distanceKm: 38,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Commercial Bellary Onions',
    nameTa: 'பெரிய வெங்காயம் (கிரேடு C)',
    category: 'vegetables',
    grade: 'Grade C',
    pricePerKg: 26,
    quantityKg: 950,
    farmerName: 'V. Ramanathan (Oddanchatram)',
    hub: 'Oddanchatram',
    distanceKm: 28,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Oddanchatram Fresh Cabbage',
    nameTa: 'முட்டைக்கோஸ்',
    category: 'vegetables',
    grade: 'Grade B',
    pricePerKg: 22,
    quantityKg: 600,
    farmerName: 'S. Velumani (Kallimanthayam)',
    hub: 'Oddanchatram',
    distanceKm: 28,
    image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Sambar Yellow Pumpkin (Parangikai)',
    nameTa: 'பரங்கிக்காய் (கிரேடு C)',
    category: 'vegetables',
    grade: 'Grade C',
    pricePerKg: 18,
    quantityKg: 500,
    farmerName: 'G. Natarajan (Palani Rural)',
    hub: 'Palani',
    distanceKm: 35,
    image: 'https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Sirumalai Green Capsicum',
    nameTa: 'குடைமிளகாய்',
    category: 'vegetables',
    grade: 'Grade B',
    pricePerKg: 48,
    quantityKg: 300,
    farmerName: 'V. Senthil (Sirumalai)',
    hub: 'Sirumalai',
    distanceKm: 22,
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Sirumalai Hill Bananas',
    nameTa: 'சிறுமலை வாழை',
    category: 'vegetables',
    grade: 'Grade C',
    pricePerKg: 36,
    quantityKg: 650,
    farmerName: 'N. Balakrishnan (Natham)',
    hub: 'Natham',
    distanceKm: 36,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Vadamadurai Red Pomegranates',
    nameTa: 'மாதுளை',
    category: 'vegetables',
    grade: 'Grade C',
    pricePerKg: 95,
    quantityKg: 220,
    farmerName: 'C. Muthuraj (Vadamadurai)',
    hub: 'Vadamadurai',
    distanceKm: 18,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80'
  }
];

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/naam-uzhavar';
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB');

    // 1. Clear old data
    console.log('Clearing old collections...');
    await Promise.all([
      Crop.deleteMany({}),
      Buyer.deleteMany({}),
      Order.deleteMany({}),
      Message.deleteMany({})
    ]);
    console.log('✓ Cleaned existing collections');

    // 2. Insert Crops
    console.log(`Seeding ${SEED_CROPS.length} produce consignments...`);
    const insertedCrops = await Crop.insertMany(SEED_CROPS);
    console.log(`✓ Inserted ${insertedCrops.length} crops`);

    // 3. Create Demo Commercial Buyer
    console.log('Creating demo buyer account (demo@naamuzhavar.com)...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('demo1234', salt);

    const demoBuyer = await Buyer.create({
      businessName: 'Grand Palace Luxury Dining',
      email: 'demo@naamuzhavar.com',
      password: hashedPassword,
      phone: '+91 98401 23456',
      gstin: '33AAAAA0000A1Z5',
      address: 'Grand Palace Luxury Dining, Bypass Road, Madurai - 625016',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=300&auto=format&fit=crop&q=80'
    });
    console.log(`✓ Created demo buyer: ${demoBuyer.email}`);

    // 4. Create sample orders linked to demo buyer
    console.log('Creating initial demo orders...');
    const tomatoCrop = insertedCrops[0];
    const onionCrop = insertedCrops[1];
    const carrotCrop = insertedCrops[2];

    await Order.create([
      {
        orderId: 'NU-2026-00124',
        buyer: demoBuyer._id,
        crop: tomatoCrop._id,
        quantityKg: 200,
        totalPrice: tomatoCrop.pricePerKg * 200,
        status: 'on_the_way',
        driver: {
          name: 'Kumar M.',
          vehicle: 'Tata Ace EV Cargo (TN 57 AB 1234)',
          phone: '+91 94432 11098'
        },
        deliveryAddress: demoBuyer.address
      },
      {
        orderId: 'NU-2026-00119',
        buyer: demoBuyer._id,
        crop: onionCrop._id,
        quantityKg: 150,
        totalPrice: onionCrop.pricePerKg * 150,
        status: 'preparing',
        driver: {
          name: 'S. Arumugam',
          vehicle: 'Mahindra Zor Grand EV (TN 45 EF 5678)',
          phone: '+91 98423 44556'
        },
        deliveryAddress: demoBuyer.address
      },
      {
        orderId: 'NU-2026-00098',
        buyer: demoBuyer._id,
        crop: carrotCrop._id,
        quantityKg: 100,
        totalPrice: carrotCrop.pricePerKg * 100,
        status: 'delivered',
        driver: {
          name: 'V. Prakash',
          vehicle: 'Tata Ace EV Cargo (TN 43 CD 9012)',
          phone: '+91 97890 88990'
        },
        deliveryAddress: demoBuyer.address
      }
    ]);
    console.log('✓ Created 3 sample EV delivery orders');

    // 5. Create initial chat messages
    console.log('Creating initial chat messages...');
    await Message.create([
      {
        buyer: demoBuyer._id,
        sender: 'driver',
        text: 'Good morning sir, produce picked from Dindigul Central. Crossed Samayanallur Bypass. Expected arrival at Kitchen Gate 2 in 25 minutes.'
      },
      {
        buyer: demoBuyer._id,
        sender: 'hub',
        text: 'Vanakkam sir, today harvest is premium Grade A country tomatoes, crate packed carefully. Thank you for direct acceptance.'
      }
    ]);
    console.log('✓ Created initial thread messages');

    console.log('\n======================================================');
    console.log('🌱 Naam Uzhavar Database Seed Completed Successfully!');
    console.log('Demo Credentials:');
    console.log('  Email:    demo@naamuzhavar.com');
    console.log('  Password: demo1234');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
}

seed();
