const Order = require('../models/Orders');
const { sendSMS } = require('../utils/twilioNotifier'); 

exports.createOrder = async (req, res) => {
  try {
    const { items, address, total, customer } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty.' });
    }

    // Transform each cart item to match the required order item structure.
    const transformedItems = items.map(item => ({
      menuItem: item._id || item.id,  // using a fallback
      quantity: item.quantity,
      price: item.price,
    }));

    // Create a new order with customer details, using the transformed items.
    const order = new Order({
      user: req.user ? req.user.id : null,
      items: transformedItems,
      total,
      address,
      contact: customer.contact, // assuming a contact field exists
      customerInfo: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
      },
      status: 'PendingPayment' 
    });

    await order.save();


    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.menuItem');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json({ order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
   const orders = await Order
     .find({})
     .sort({ createdAt: -1 })
     .populate('items.menuItem', 'name'); // pull in just the name field

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params; // the order's id passed as a URL parameter
    const { currentStatus } = req.body; // the current status sent from the frontend

    // Define the status order
    const statuses = ['Pending', 'Confirmed', 'Preparing', 'Delivered'];
    
    // Find the index of the current status
    const currentIndex = statuses.indexOf(currentStatus);
    
    // If currentStatus is not found or already at the final stage, return an error
    if (currentIndex === -1) {
      return res.status(400).json({ error: 'Invalid current status provided.' });
    }
    if (currentIndex === statuses.length - 1) {
      return res.status(400).json({ error: 'Order is already in the final stage.' });
    }
    
    // Calculate the new status (next stage)
    const newStatus = statuses[currentIndex + 1];
    
    // Update the order in the database
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: newStatus },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    
    if (newStatus === 'Delivered') {
      const message = `Hi ${order.customerInfo.firstName}, your order has been delivered. Enjoy your meal!`;
      await sendSMS(order.customerInfo.phone, message);
    }
    res.status(200).json({ message: 'Order updated successfully', order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};