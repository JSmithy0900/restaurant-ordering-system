import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PaymentForm from '../components/PaymentForm';
import NavBar from '../components/NavBar';
import '../css/app.css';

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
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch order');
        }
        setOrder(data.order);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (error) return <div>Error: {error}</div>;
  if (!order) return <div>Loading order details...</div>;

  return (
    <div className="payment-page">
      <NavBar />

      <main className="payment-content">
        <h1>Payment Information</h1>
        <p>Your Order ID: {orderId}</p>
        <p>Amount to charge: ${(order.total).toFixed(2)}</p> 
        <PaymentForm orderId={orderId} orderAmount={order.total} />
      </main>

      <footer className="footer">
        <p>© 2025 My Restaurant. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default PaymentPage;
