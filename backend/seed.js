require('dotenv').config({ path: __dirname + '/../.env' });
console.log("MongoDB URI:", process.env.MONGODB_URI); // For debugging
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem'); 

const menuItems = [
  {
    name: 'Classic Beef Burger',
    description: 'Juicy grilled beef patty, lettuce, tomato, red onion, pickles & your choice of sauce on a toasted brioche bun.',
    price: 8.99,
    imageUrl: '/images/beefburger.png',
    category: 'Main'
  },
  {
    name: 'Chicken Burger',
    description: 'Crispy fried chicken breast, slaw, and house mayo on a soft sesame seed bun.',
    price: 7.99,
    imageUrl: '/images/chickenburger.png',
    category: 'Main'
  },
  {
    name: 'Margherita Pizza',
    description: 'Classic Neapolitan—tomato sauce, fresh mozzarella, basil, and extra-virgin olive oil.',
    price: 9.49,
    imageUrl: '/images/margheritapizza.png',
    category: 'Main'
  },
  {
    name: 'Pepperoni Pizza',
    description: 'Tomato sauce, mozzarella, and loads of spicy pepperoni.',
    price: 10.99,
    imageUrl: '/images/pepperonipizza.png',
    category: 'Main'
  },
  {
    name: 'Garlic Bread',
    description: 'Toasted baguette slices brushed with garlic butter and sprinkled with parsley.',
    price: 3.99,
    imageUrl: '/images/garlicbread.png',
    category: 'Starter'
  },
  {
    name: 'Mozzarella Sticks',
    description: 'Golden-fried mozzarella cheese sticks served with a side of marinara dipping sauce.',
    price: 5.49,
    imageUrl: '/images/mozzarellasticks.png',
    category: 'Starter'
  },
  {
    name: 'Chocolate Brownie',
    description: 'Warm chocolate brownie topped with vanilla ice cream and chocolate sauce.',
    price: 4.99,
    imageUrl: '/images/chocolatebrownie.png',
    category: 'Dessert'
  },
  {
    name: 'Ice Cream Sundae',
    description: 'Three scoops of ice cream with hot fudge, whipped cream, nuts & a cherry on top.',
    price: 4.49,
    imageUrl: '/images/icecream.png',
    category: 'Dessert'
  },
  {
    name: 'Apple Pie',
    description: 'Classic apple pie with a flaky crust, served warm with a scoop of ice cream.',
    price: 4.75,
    imageUrl: '/images/applepie.png',
    category: 'Dessert'
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
