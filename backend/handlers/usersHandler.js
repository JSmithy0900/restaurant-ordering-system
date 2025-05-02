const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/Users'); 

const saltRounds = 10;

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user 
    const newUser = new User({
      name,
      email,
      passwordHash: hashedPassword,
      phone,
      role: 'customer',
    });

    await newUser.save();

    res.status(201).json({ message: 'Registration successful', user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Log in an existing user and generate a JWT token
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create a payload for the token with relevant user details
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    // Sign the token with the secret from your .env file and set an expiration time
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return the token and user information (excluding sensitive data)
    res.status(200).json({ message: 'Login successful', token, user: payload });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
