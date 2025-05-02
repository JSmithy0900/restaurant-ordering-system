import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';


const CARD_ELEMENT_OPTIONS = {
  hidePostalCode: true,
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": { color: "#a0aec0" }
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  }
};

function PaymentForm({ orderId, orderAmount }) {  // orderAmount comes as a prop
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
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });
    
    if (error) {
      setError(error.message);
      setProcessing(false);
      return;
    }
    
    setError(null);
    console.log("PaymentMethod created:", paymentMethod);
    
    try {
      const response = await fetch('https://restaurant-ordering-system-qbfz.onrender.com/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          amount: amountInPence,  // Now using the amount from props
          orderId: orderId        // Pass the orderId from props
        }),
      });
      const paymentResponse = await response.json();
      console.log("Payment Intent response:", paymentResponse);
      
      if (!response.ok) {
        throw new Error(paymentResponse.error || 'Payment failed');
      }
      
      setSuccess(true);
      navigate(`/order/${orderId}/tracking`);
    } catch (serverError) {
      setError("Payment failed: " + serverError.message);
    }
    
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={CARD_ELEMENT_OPTIONS} />
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
      <button type="submit" disabled={!stripe || processing || success}>
        {processing ? "Processing…" : "Pay Now"}
      </button>
      {success && <div style={{ color: 'green', marginTop: 10 }}>Payment Successful!</div>}
    </form>
  );
}

export default PaymentForm;
