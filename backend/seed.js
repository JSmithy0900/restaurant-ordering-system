require('dotenv').config({ path: __dirname + '/../.env' });
console.log("MongoDB URI:", process.env.MONGODB_URI); // For debugging
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem'); 

const menuItems = [
  {
    name: 'Chicken Teriyaki',
    description: 'Grilled chicken glazed with teriyaki sauce, served with steamed rice and vegetables.',
    price: 12.99,
    imageUrl: 'https://via.placeholder.com/300x200?text=Chicken+Teriyaki'
  },
  {
    name: 'Veggie Ramen',
    description: 'A flavorful broth with noodles, mixed vegetables, and tofu.',
    price: 10.99,
    imageUrl: 'https://via.placeholder.com/300x200?text=Veggie+Ramen'
  },
  {
    name: 'Beef Bulgogi',
    description: 'Thinly sliced beef marinated in a savory sauce, served with rice and kimchi.',
    price: 14.99,
    imageUrl: 'https://via.placeholder.com/300x200?text=Beef+Bulgogi'
  },
  {
    name: 'Spring Rolls',
    description: 'Crispy spring rolls filled with vegetables, served with a sweet chili dipping sauce.',
    price: 6.99,
    imageUrl: 'https://via.placeholder.com/300x200?text=Spring+Rolls'
  }
];

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('Connected to MongoDB Atlas, seeding menu items...');
    
    // Optional: Clear existing menu items before seeding new data
    await MenuItem.deleteMany({});
    
    // Insert default menu items
    await MenuItem.insertMany(menuItems);
    console.log('Seeding complete!');
    
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
