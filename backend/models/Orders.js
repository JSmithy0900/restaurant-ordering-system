const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'MenuItem', 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  }
});


const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  items: [orderItemSchema],
  total: { 
    type: Number, 
    required: true 
  },
  address: { 
    type: String, 
    required: true 
  },
  contact: { 
    type: String, 
    required: true 
  },
  customerInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  status: {
    type: String,
    enum: ['PendingPayment', 'Pending', 'Confirmed', 'Preparing', 'Delivered', 'Cancelled'],
    default: 'PendingPayment'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
