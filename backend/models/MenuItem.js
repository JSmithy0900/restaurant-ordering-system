const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String },
  price:       { type: Number, required: true },
  imageUrl:    { type: String },
  category: {
    type: String,
    enum: ['Starter','Main','Dessert'],
    default: 'Main',
    required: true
  }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
