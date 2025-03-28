const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true }
});

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  orderItems: [OrderItemSchema],
  orderStatus: { type: String, default: 'Pending' },
  orderTotal: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now },
  deliveryAddress: { type: String, required: true },
  latitude: { type: Number },
  longitude: { type: Number },
  ETA: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
