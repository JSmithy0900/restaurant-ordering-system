// routes/orders.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyStaff } = require('../middleware/authMiddleware'); // Middleware to check staff privileges

// Staff-only route to accept an order
router.put('/accept/:orderId', verifyStaff, orderController.acceptOrder);

module.exports = router;
