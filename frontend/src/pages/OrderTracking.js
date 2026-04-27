import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import '../css/OrderTracking.css';
import '../css/app.css';

const STEPS = ['Pending', 'Confirmed', 'Preparing', 'Delivered'];
const STEP_ICONS = ['🕐', '✅', '👨‍🍳', '🚗'];

function OrderTrackingPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://restaurant-ordering-system-qbfz.onrender.com/api/orders/${orderId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) setError(data.error || 'Failed to fetch order.');
      else setOrder(data.order);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [orderId]);

  const currentIndex = order ? STEPS.indexOf(order.status) : -1;

  const statusMessage = {
    Pending: 'Your order has been received and is awaiting confirmation.',
    Confirmed: 'Your order is confirmed — the kitchen has been notified.',
    Preparing: 'Your food is being freshly prepared.',
    Delivered: 'Your order has been delivered. Enjoy your meal!',
  };

  return (
    <div className="order-tracking">
      <NavBar />
      <main>
        <h1>Order Tracking</h1>

        {error && <p style={{ color: '#dc2626' }}>{error}</p>}
        {!order && !error && <p>Loading order details...</p>}

        {order && (
          <>
            <div className="order-info">
              <div className="order-info-row">
                <span className="label">Order ID</span>
                <span className="value">{order._id}</span>
              </div>
              <div className="order-info-row">
                <span className="label">Customer</span>
                <span className="value">{order.customerInfo.firstName} {order.customerInfo.lastName}</span>
              </div>
              <div className="order-info-row">
                <span className="label">Total</span>
                <span className="value">£{order.total.toFixed(2)}</span>
              </div>
              <div className="order-info-row">
                <span className="label">Delivery address</span>
                <span className="value">{order.address}</span>
              </div>
            </div>

            <div className="status-progress">
              <h2>Status</h2>
              <div className="progress-steps">
                {STEPS.map((step, i) => {
                  const isDone = i < currentIndex;
                  const isActive = i === currentIndex;
                  return (
                    <div
                      key={step}
                      className={`progress-step${isDone ? ' done' : ''}${isActive ? ' active' : ''}`}
                    >
                      <div className="step-dot">{isDone ? '✓' : STEP_ICONS[i]}</div>
                      <span className="step-label">{step}</span>
                    </div>
                  );
                })}
              </div>
              {order.status in statusMessage && (
                <p className="tracking-message">{statusMessage[order.status]}</p>
              )}
            </div>
          </>
        )}
      </main>
      <footer className="footer">
        <p>© 2025 My Restaurant. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default OrderTrackingPage;
