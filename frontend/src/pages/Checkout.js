import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import GoogleMapComponent from '../components/GoogleMap';
import '../css/app.css';
import '../css/Checkout.css'; // new file for summary styles

function CheckoutPage() {
  const { user } = useAuth();
  const { cart, setCart } = useCart();
  const navigate = useNavigate();
  
  // Form state for checkout details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  // Pre-fill email and phone from user if available
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [eta, setEta] = useState(''); // ETA as a string
  const [deliveryEligible, setDeliveryEligible] = useState(null);

  // Load cart from localStorage on initial mount
  useEffect(() => {
    const storedCartRaw = localStorage.getItem('cart');
    console.log("Stored cart (raw) on Checkout mount:", storedCartRaw);
    const storedCart = storedCartRaw ? JSON.parse(storedCartRaw) : [];
    console.log("Parsed stored cart on Checkout mount:", storedCart);
    setCart(storedCart);
  }, [setCart]);

  // Update localStorage when cart changes.
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const total = cart.reduce((acc, item) => acc + item.quantity * item.price, 0);

  // When the address changes, clear the previous ETA.
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    setEta('');
    setDeliveryEligible(null);
    setMessage('');
  };

  // Function to check delivery eligibility and ETA using your backend.
  const handleCheckDelivery = async () => {
    try {
      const response = await fetch('https://restaurant-ordering-system-qbfz.onrender.com/api/delivery/check-delivery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress: address }),
      });
      const data = await response.json();
      if (!response.ok) {
        setDeliveryEligible(false);
        setMessage(data.error || "Delivery check failed");
        return;
      }
      const distance = data.distance; // in meters
      const deliveryThreshold = 20000; // 20 km = 20,000 meters
      if (distance > deliveryThreshold) {
        setDeliveryEligible(false);
        setEta('');
        setMessage("Sorry, you're too far away for delivery.");
      } else {
        setDeliveryEligible(true);
        setEta(data.totalETA); 
        setMessage("Delivery is available!");
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  // Handle the order placement submission.
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (deliveryEligible === false) {
      setMessage("Cannot place order: delivery not available for your address.");
      return;
    }
    
    // Construct orderData to match the Order model.
    const orderData = {
      items: cart,             // Array of cart items (each should include _id, quantity, price)
      total,                   // Total order amount
      address,                 // Delivery address

      customer: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        contact: phone  
      },

    };
    

    try {
      const response = await fetch('https://restaurant-ordering-system-qbfz.onrender.com/api/orders/checkout', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(orderData)
      });
      const data = await response.json();
      console.log("Payment Response Data:", data);
      if (!response.ok) {
        throw new Error(data.error || 'Order failed');
      }
      
      setMessage('Order placed successfully!');
      setCart([]); // Clear the cart
      localStorage.removeItem('cart');
      
      // Navigate to the order tracking page using the returned order _id.
      navigate(`/payment/${data.order._id}`);
      
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (

    <div className="checkout-page">
      <NavBar />

      {/* Main Content */}
      <main className="checkout-content">
        <h1>Checkout</h1>

        {/* ——— Order Summary ——— */}
        <section className="order-summary">
          <h2>Order Summary</h2>
          {cart.length === 0 ? (
            <p>Your basket is empty.</p>
          ) : (
            <div className="summary-list">
              {cart.map(item => (
                <div key={item._id} className="summary-item">
                  <span className="item-desc">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="item-total">
                    £{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}

              {/* overall total */}
              <div className="summary-total">
                <span>Total:</span>
                <span>£{total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </section>

        {/* Checkout Form */}
        <section className="order-form-section">
          <h2>Delivery Information</h2>
          <form className="order-form" onSubmit={handleSubmit}>
            <label>
              First Name:
              <input 
                type="text" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
                required 
              />
            </label>
            <label>
              Last Name:
              <input 
                type="text" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
                required 
              />
            </label>
            <label>
              Email:
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </label>
            <label>
              Phone Number:
              <input 
                type="text" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                required 
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                value={address}
                onChange={handleAddressChange}
                onBlur={handleCheckDelivery}    // ← run check when they leave the field
                required
              />
            </label>
            {/* Button to trigger delivery eligibility check */}
            <button type="button" onClick={handleCheckDelivery}>
              Check Delivery
            </button>
            {eta && <p>Estimated delivery time: {eta}</p>}
            <button
              type="submit"
              disabled={deliveryEligible !== true}
              title={
                deliveryEligible === null
                  ? "Check delivery availability first"
                  : deliveryEligible === false
                    ? "Outside delivery area"
                    : ""
              }
            >
              Place Order
            </button>
          </form>
          {message && <p className="order-message">{message}</p>}
        </section>
      </main>

    </div>
  );
}

export default CheckoutPage;
