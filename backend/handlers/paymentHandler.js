require('dotenv').config({ path: __dirname + '/../.env' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { sendSMS } = require('../utils/twilioNotifier');
const Order     = require('../models/Orders');  

exports.createPaymentIntent = async (req, res) => {
  try {
    const { paymentMethodId, amount, orderId } = req.body;
    
    // Create a PaymentIntent using Stripe.
    const paymentIntent = await stripe.paymentIntents.create({
      amount,          
      currency: 'gbp',
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
      metadata: { orderId },
      return_url: "http://localhost:3000/",
    });

    if (paymentIntent.status === 'succeeded') {
      const order = await Order.findByIdAndUpdate(
        orderId,
        { status: 'Pending' },
        { new: true }
      );
      if (order) {
        await sendSMS(
          order.customerInfo.phone,
          `Hi ${order.customerInfo.firstName}, your payment succeeded and your order is now confirmed!`
        );
      }
    }
    
    // return the actual PaymentIntent back to the client
    res.json({ paymentIntent });
  } catch (err) {
    console.error("Error in createPaymentIntent:", err);
    res.status(400).json({ error: err.message });
  }
};