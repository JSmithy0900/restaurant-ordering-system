const Order = require('../models/Order');

exports.acceptOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    // Update the order to reflect that a staff member has accepted it
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: 'Accepted by staff' },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
