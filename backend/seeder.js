import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Room from './models/Room.js';
import Booking from './models/Booking.js';
import Payment from './models/Payment.js';

dotenv.config();
connectDB();

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@hotelpro.com',
    password: 'password123',
    role: 'admin',
    phone: '+1-555-0101',
  },
  {
    name: 'Front Desk Staff',
    email: 'staff@hotelpro.com',
    password: 'password123',
    role: 'staff',
    phone: '+1-555-0102',
  },
  {
    name: 'John Guest',
    email: 'guest@hotelpro.com',
    password: 'password123',
    role: 'guest',
    phone: '+1-555-0103',
  },
];

const sampleRooms = [
  {
    roomNumber: '101',
    type: 'Single',
    pricePerNight: 85,
    maxOccupancy: 1,
    description: 'A cozy and modern single room equipped with a plush bed, ergonomic work desk, and high-speed internet.',
    amenities: ['WiFi', 'Air Conditioning', 'LED TV', 'Coffee Maker'],
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
  },
  {
    roomNumber: '102',
    type: 'Double',
    pricePerNight: 140,
    maxOccupancy: 2,
    description: 'Spacious double room featuring two queen-sized beds, ambient lighting, and panoramic city views.',
    amenities: ['WiFi', 'Air Conditioning', 'LED TV', 'Mini Bar', 'Breakfast Included'],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
  },
  {
    roomNumber: '201',
    type: 'Deluxe',
    pricePerNight: 220,
    maxOccupancy: 3,
    description: 'Luxury deluxe room with king bed, marble bathroom, private balcony, and 24/7 concierge service.',
    amenities: ['WiFi', 'Air Conditioning', 'Smart TV', 'Balcony', 'Mini Bar', 'Bathtub'],
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
  },
  {
    roomNumber: '301',
    type: 'Suite',
    pricePerNight: 380,
    maxOccupancy: 4,
    description: 'Executive presidential suite featuring private living room, dining area, jacuzzi, and sea-view terrace.',
    amenities: ['High-speed WiFi', 'Central Climate Control', 'Home Theater', 'Jacuzzi', 'Terrace', 'Private Butler'],
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
  },
  {
    roomNumber: '103',
    type: 'Single',
    pricePerNight: 90,
    maxOccupancy: 1,
    description: 'Comfortable single room near the quiet courtyard, perfect for solo travelers and business trips.',
    amenities: ['WiFi', 'Air Conditioning', 'Work Desk'],
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
  },
  {
    roomNumber: '202',
    type: 'Double',
    pricePerNight: 155,
    maxOccupancy: 2,
    description: 'Modern double room with contemporary artwork, walk-in shower, and soundproof windows.',
    amenities: ['WiFi', 'Air Conditioning', 'LED TV', 'Mini Fridge'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'available',
  },
];

const importData = async () => {
  try {
    await Booking.deleteMany();
    await Payment.deleteMany();
    await Room.deleteMany();
    await User.deleteMany();

    console.log('[Seeder] Existing records cleared.');

    // Create users individually to trigger the pre('save') password hashing middleware
    for (const u of sampleUsers) {
      await User.create(u);
    }
    console.log('[Seeder] Default users created.');

    await Room.insertMany(sampleRooms);
    console.log('[Seeder] Sample rooms loaded.');

    console.log('[Seeder] Database successfully seeded! 🎉');
    process.exit();
  } catch (error) {
    console.error(`[Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Booking.deleteMany();
    await Payment.deleteMany();
    await Room.deleteMany();
    await User.deleteMany();

    console.log('[Seeder] All data wiped.');
    process.exit();
  } catch (error) {
    console.error(`[Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
