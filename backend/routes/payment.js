const express = require('express');
const router = express.Router();
const stripeHandler = require('../handlers/paymentHandler');

router.post('/create-payment-intent', stripeHandler.createPaymentIntent);

module.exports = router;
