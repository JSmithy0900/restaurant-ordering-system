require('dotenv').config({ path: '../.env' });
console.log("MongoDB URI:", process.env.MONGODB_URI); // For debugging
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

const db = mongoose.connection;
db.on('error', err => console.error('Mongoose connection error:', err));
db.once('open', () => console.log('Mongoose connected to MongoDB Atlas'));


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const menuRoutes = require('./routes/menu');
app.use('/api/menu', menuRoutes);

const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Restaurant Ordering System API!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
