// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  phone: String,
  isGuest: { type: Boolean, default: false },
  defaultAddress: String,
  role: { 
    type: String, 
    enum: ['customer', 'staff', 'admin'], 
    default: 'customer' 
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
