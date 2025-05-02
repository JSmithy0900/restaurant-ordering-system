require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const app      = require('./app');

const MONGO_URI = process.env.MONGODB_URI;
const PORT      = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
