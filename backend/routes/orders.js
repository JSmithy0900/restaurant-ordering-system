const express = require('express');
const router = express.Router();
const orderHandler = require('../handlers/ordersHandler');
const { verifyToken, verifyStaffOrAdmin } = require('../middleware/authMiddleware');


router.get('/all-orders', verifyToken, verifyStaffOrAdmin, orderHandler.getAllOrders);
router.post('/checkout', verifyToken, orderHandler.createOrder);

router.get('/:id', verifyToken, orderHandler.getOrder);
router.put('/:orderId/status', verifyToken, verifyStaffOrAdmin, orderHandler.updateOrderStatus);


module.exports = router;
