// models/Crop.js - Schema for fresh farm harvest consignments available at regional hubs
// Viva Note: Represents agricultural produce directly listed from Tamil Nadu farmers.
const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Crop name in English is required'],
      trim: true
    },
    nameTa: {
      type: String,
      default: '',
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required (e.g. vegetables, fruits)'],
      default: 'vegetables'
    },
    grade: {
      type: String,
      enum: ['Grade A', 'Grade B', 'Grade C'],
      default: 'Grade A'
    },
    pricePerKg: {
      type: Number,
      required: [true, 'Wholesale price per kg is required'],
      min: [1, 'Price per kg must be greater than zero']
    },
    quantityKg: {
      type: Number,
      required: [true, 'Available quantity in kg is required'],
      min: [0, 'Available quantity cannot be negative']
    },
    farmerName: {
      type: String,
      required: [true, 'Farmer name is required'],
      trim: true
    },
    hub: {
      type: String,
      required: [true, 'Regional collection hub name is required'],
      trim: true
    },
    distanceKm: {
      type: Number,
      default: 0
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Crop', cropSchema);
