const express = require('express');
const router = express.Router();
const deliveryHandler = require('../handlers/deliveryHandler');

router.post('/check-delivery', deliveryHandler.checkDelivery);

module.exports = router;
