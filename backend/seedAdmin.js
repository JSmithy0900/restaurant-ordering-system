// backend/seedAdmin.js
require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/Users'); // Ensure this path is correct

const saltRounds = 10;

const adminUser = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'adminpassword', // Plain password to hash
  phone: '1234567890',
  role: 'admin'
};

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('Connected to MongoDB Atlas, seeding admin user...');
    // Optionally remove existing admin user if one exists:
    await User.deleteOne({ email: adminUser.email });

    // Hash the admin's password
    const hashedPassword = await bcrypt.hash(adminUser.password, saltRounds);
    adminUser.passwordHash = hashedPassword;

    // Create the admin user with role 'admin'
    const newAdmin = new User({
      name: adminUser.name,
      email: adminUser.email,
      passwordHash: adminUser.passwordHash,
      phone: adminUser.phone,
      role: 'admin'
    });

    await newAdmin.save();
    console.log('Admin user seeded successfully:', newAdmin);
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
