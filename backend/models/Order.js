// models/Order.js - Schema for buyer orders and live EV cargo consignments
// Viva Note: Ties a Buyer to a purchased Crop, records the server-calculated total price,
// and separates order approval status from EV driver delivery milestones.
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Buyer',
      required: true
    },
    crop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop',
      required: true
    },
    cropDetails: {
      name: { type: String, default: '' },
      nameTa: { type: String, default: '' },
      grade: { type: String, default: 'Grade A' },
      image: { type: String, default: '' },
      pricePerKg: { type: Number, default: 0 },
      farmerName: { type: String, default: '' },
      hub: { type: String, default: '' }
    },
    quantityKg: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1 kg']
    },
    totalPrice: {
      type: Number,
      required: true
    },
    // Order Status: PENDING_FARMER_APPROVAL -> CONFIRMED (or REJECTED / CANCELLED)
    orderStatus: {
      type: String,
      enum: ['PENDING_FARMER_APPROVAL', 'CONFIRMED', 'REJECTED', 'CANCELLED'],
      default: 'PENDING_FARMER_APPROVAL'
    },
    // Delivery Status: NOT_ASSIGNED -> READY_FOR_PICKUP -> PICKED_UP -> IN_TRANSIT -> DELIVERED
    deliveryStatus: {
      type: String,
      enum: ['NOT_ASSIGNED', 'READY_FOR_PICKUP', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'],
      default: 'NOT_ASSIGNED'
    },
    // Retain legacy status field for backwards compatibility
    status: {
      type: String,
      default: 'PENDING_FARMER_APPROVAL'
    },
    driver: {
      name: { type: String, default: 'Kumar M.' },
      vehicle: { type: String, default: 'Tata Ace EV Cargo (TN 57 AB 1234)' },
      phone: { type: String, default: '+91 94432 11098' },
      deliveryPin: { type: String, default: '4892' }
    },
    deliveryAddress: {
      type: String,
      required: true,
      trim: true
    },
    preferredDeliveryDate: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Order', orderSchema);
