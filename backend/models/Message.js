// models/Message.js - Schema for buyer communication with hub managers and delivery drivers
// Viva Note: Stores direct communications for dispatch coordination.
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Buyer',
      required: true
    },
    sender: {
      type: String,
      enum: ['buyer', 'hub', 'driver'],
      required: true
    },
    text: {
      type: String,
      required: [true, 'Message text is required'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Message', messageSchema);
