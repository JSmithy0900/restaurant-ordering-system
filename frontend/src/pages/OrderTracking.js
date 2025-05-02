import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';

function OrderTrackingPage() {
  const { orderId } = useParams(); 
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  // Function to fetch order details from the backend
  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://restaurant-ordering-system-qbfz.onrender.com/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Failed to fetch order.');
      } else {
        setOrder(data.order);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchOrder();
    //poll every 10 seconds to update the status
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (error) {
    return (
      <div className="order-tracking">
        <h1>Order Tracking</h1>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-tracking">
        <h1>Order Tracking</h1>
        <p>Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="order-tracking">
        <NavBar />
      <h1>Order Tracking</h1>
      <div className="order-info">
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Customer:</strong> {order.customerInfo.firstName} {order.customerInfo.lastName}</p>
        <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
        <p><strong>Delivery Address:</strong> {order.address}</p>
        <p><strong>Status:</strong> {order.status}</p>
      </div>
      <div className="status-progress">
        {order.status === 'Pending' && <p>Order is pending...</p>}
        {order.status === 'Confirmed' && <p>Order is confirmed. Preparing now...</p>}
        {order.status === 'Preparing' && <p>Your food is being prepared...</p>}
        {order.status === 'Delivered' && <p>Your order has been delivered!</p>}
      </div>
    </div>
  );
}

export default OrderTrackingPage;
