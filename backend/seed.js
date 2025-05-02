require('dotenv').config({ path: __dirname + '/../.env' });
console.log("MongoDB URI:", process.env.MONGODB_URI); // For debugging
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem'); 

const menuItems = [
  {
    name: 'Test',
    description: 'Grilled chicken glazed with teriyaki sauce, served with steamed rice and vegetables.',
    price: 12.99,
    imageUrl: '/images/ID.jpg',
    category: 'Main'
  },
  {
    name: 'Veggie Ramen',
    description: 'A flavorful broth with noodles, mixed vegetables, and tofu.',
    price: 10.99,
    imageUrl: '',
    category: 'Starter'
  },
  {
    name: 'Beef Bulgogi',
    description: 'Thinly sliced beef marinated in a savory sauce, served with rice and kimchi.',
    price: 14.99,
    imageUrl: '',
    category: 'Main'
  },
  {
    name: 'Spring Rolls',
    description: 'Crispy spring rolls filled with vegetables, served with a sweet chili dipping sauce.',
    price: 6.99,
    imageUrl: '',
    category: 'Starter'
  }
];

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('Connected to MongoDB Atlas, seeding menu items...');
    
    await MenuItem.deleteMany({});
    
    // Insert default menu items
    await MenuItem.insertMany(menuItems);
    console.log('Seeding complete!');
    
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
