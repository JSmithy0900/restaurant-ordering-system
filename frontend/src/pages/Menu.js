import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Menu.css';
import '../css/app.css';

function MenuPageWithCart() {
  // State for menu items (fetched from your backend)
  const [menuItems, setMenuItems] = useState([]);
  // State for items added to the cart
  const [cart, setCart] = useState([]);

  // Fetch menu items from your backend when the component mounts
  useEffect(() => {
    fetch('https://restaurant-ordering-system-qbfz.onrender.com/api/menu')
      .then((res) => res.json())
      .then((data) => setMenuItems(data))
      .catch((err) => console.error('Error fetching menu items:', err));
  }, []);

  // Function to add an item to the cart
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem._id === item._id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  // Increase quantity of an item in the cart
  const increaseQuantity = (itemId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrease quantity; if quantity goes to zero, remove the item
  const decreaseQuantity = (itemId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item._id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Calculate total price
  const total = cart.reduce((acc, item) => acc + item.quantity * item.price, 0);

  return (
    <div className="menu-page">
      <header className="header">
        <div className="header-container">
          <div className="logo">My Restaurant</div>
          <nav className="nav">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/order">Order</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="menu-content">
        <h1>Our Menu</h1>
        {menuItems.length === 0 ? (
          <p>Loading menu...</p>
        ) : (
          menuItems.map((item) => (
            <div key={item._id} className="menu-item">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>${item.price.toFixed(2)}</p>
              <button onClick={() => addToCart(item)}>Add to Cart</button>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <aside className="cart-sidebar">
          <h2>Your Basket</h2>
          <ul className="cart-items">
            {cart.map((item) => (
              <li key={item._id} className="cart-item">
                <span className="item-name">{item.name}</span>
                <div className="item-controls">
                  <button onClick={() => decreaseQuantity(item._id)}>-</button>
                  <span className="item-quantity">x {item.quantity}</span>
                  <button onClick={() => increaseQuantity(item._id)}>+</button>
                </div>
                <span className="item-price">
                  = ${(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <h2>Total: ${total.toFixed(2)}</h2>
          <button className="checkout-button">Proceed to Checkout</button>
        </aside>
      )}
    </div>
  );
}

export default MenuPageWithCart;
