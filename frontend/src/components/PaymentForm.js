import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';

const CARD_ELEMENT_OPTIONS = {
  hidePostalCode: true,
  style: {
    base: {
      color: '#1a1a1a',
      fontFamily: '"Inter", "Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '15px',
      '::placeholder': { color: '#b0aba5' }
    },
    invalid: { color: '#dc2626', iconColor: '#dc2626' }
  }
};

function PaymentForm({ orderId, orderAmount }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const amountInPence = Math.round(orderAmount * 100);

  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (methodError) {
      setError(methodError.message);
      setProcessing(false);
      return;
    }

    setError(null);

    try {
      const response = await fetch('https://restaurant-ordering-system-qbfz.onrender.com/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethodId: paymentMethod.id, amount: amountInPence, orderId }),
      });
      const paymentResponse = await response.json();

      if (!response.ok) throw new Error(paymentResponse.error || 'Payment failed');

      setSuccess(true);
      navigate(`/order/${orderId}/tracking`);
    } catch (serverError) {
      setError('Payment failed: ' + serverError.message);
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="card-element-wrapper">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>
      {error && <div className="payment-error">{error}</div>}
      {success && <div className="payment-success">Payment successful! Redirecting...</div>}
      <button className="pay-btn" type="submit" disabled={!stripe || processing || success}>
        {processing ? 'Processing...' : `Pay £${orderAmount.toFixed(2)}`}
      </button>
      <p className="secure-badge">🔒 Payments secured by Stripe</p>
    </form>
  );
}

export default PaymentForm;
