import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../components/PaymentForm';
import NavBar from '../components/NavBar';
import '../css/Payment.css';
import '../css/app.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function PaymentPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://restaurant-ordering-system-qbfz.onrender.com/api/orders/${orderId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch order');
        setOrder(data.order);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (error) return (
    <div className="payment-page">
      <NavBar />
      <div className="payment-content">
        <p style={{ color: '#dc2626' }}>Error: {error}</p>
      </div>
    </div>
  );

  if (!order) return (
    <div className="payment-page">
      <NavBar />
      <div className="payment-content"><p>Loading order details...</p></div>
    </div>
  );

  return (
    <div className="payment-page">
      <NavBar />
      <div className="payment-content">
        <h1>Payment</h1>
        <p className="payment-subtitle">Order #{orderId}</p>

        <div className="payment-summary-card">
          <span className="label">Amount due</span>
          <span className="amount">£{order.total.toFixed(2)}</span>
        </div>

        <div className="payment-form-card">
          <h2>Card details</h2>
          <Elements stripe={stripePromise}>
            <PaymentForm orderId={orderId} orderAmount={order.total} />
          </Elements>
        </div>
      </div>
      <footer className="footer">
        <p>© 2025 My Restaurant. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default PaymentPage;
