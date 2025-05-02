// controllers/adminController.js
const bcrypt = require('bcryptjs');
const User = require('../models/Users');
const saltRounds = 10;

exports.createStaffUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      name,
      email,
      passwordHash: hashedPassword,
      phone,
      role: 'staff',
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error in createStaffUser:", error);
    res.status(400).json({ error: error.message });
  }
};
