require('dotenv').config({ path: __dirname + '/../.env' });
const express = require('express');
const cors    = require('cors');

const app = express();

app.use(cors({
    origin: '*',                     // or your exact frontend URL
    allowedHeaders: ['Content-Type','Authorization']
  }));
app.use(express.json());

app.use('/api/users',   require('./routes/users'));
app.use('/api/menu',    require('./routes/menu'));
app.use('/api/admin',   require('./routes/admin'));
app.use('/api/orders',  require('./routes/orders'));
app.use('/api/delivery',require('./routes/delivery'));
app.use('/api/stripe',  require('./routes/payment'));

app.get('/', (req, res) => {
  res.send('Welcome to the Restaurant Ordering System API!');
});

module.exports = app;
