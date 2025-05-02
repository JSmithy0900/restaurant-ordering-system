import React, { useState, useEffect } from 'react';
import { useCart }           from '../context/CartContext';
import { Link }              from 'react-router-dom';
import NavBar                from '../components/NavBar';
import '../css/Menu.css';
import '../css/app.css';

export default function MenuPageWithCart() {
  const [menuItems, setMenuItems] = useState([]);
  const { cart, setCart } = useCart();

  //Fetch menu items on mount
  useEffect(() => {
    fetch('https://restaurant-ordering-system-qbfz.onrender.com/api/menu')
      .then(res => res.json())
      .then(data => setMenuItems(data))
      .catch(err => console.error('Error fetching menu items:', err));
  }, []);

  //Cart helpers
  const addToCart = item => {
    setCart(prev => {
      const found = prev.find(ci => ci._id === item._id);
      if (found) {
        return prev.map(ci =>
          ci._id === item._id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };
  const increaseQuantity = id =>
    setCart(prev => prev.map(ci => ci._id === id ? { ...ci, quantity: ci.quantity + 1 } : ci));
  const decreaseQuantity = id =>
    setCart(prev =>
      prev
        .map(ci => ci._id === id ? { ...ci, quantity: ci.quantity - 1 } : ci)
        .filter(ci => ci.quantity > 0)
    );
  const total = cart.reduce((sum, ci) => sum + ci.price * ci.quantity, 0);

  //Placeholder for missing images
  const placeholder = '/images/placeholder.png';

  //Group items by category
  const grouped = menuItems.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  //Section order
  const sections = ['Starter','Main','Dessert'];

  return (
    <div className="menu-page">
      <NavBar />

      <div className="menu-content">
  <h1>Our Menu</h1>

  {menuItems.length === 0 ? (
    <p>Loading menu...</p>
  ) : (
    <div className="sections-container">
      {sections.map(section => (
        <section key={section} className="menu-section">
          <h2>{section}s</h2>
          {(!grouped[section] || !grouped[section].length) ? (
            <p>No {section.toLowerCase()}s available.</p>
          ) : (
            <div className="menu-grid">
              {grouped[section].map(item => {
                const src = item.imageUrl?.trim() || placeholder;
                return (
                  <div key={item._id} className="menu-item">
                    <img
                      src={src}
                      alt={item.name}
                      className="menu-item__image"
                      onError={e => { e.target.onerror = null; e.target.src = placeholder; }}
                    />
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <p className="price">£{item.price.toFixed(2)}</p>
                    <button onClick={() => addToCart(item)}>
                      Add to Cart
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      ))}
    </div>
  )}
</div>


      {cart.length > 0 && (
        <aside className="cart-sidebar">
          <h2>Your Basket</h2>
          <ul className="cart-items">
            {cart.map(ci => (
              <li key={ci._id} className="cart-item">
                <span className="item-name">{ci.name}</span>
                <div className="item-controls">
                  <button onClick={() => decreaseQuantity(ci._id)}>-</button>
                  <span className="item-quantity">x {ci.quantity}</span>
                  <button onClick={() => increaseQuantity(ci._id)}>+</button>
                </div>
                <span className="item-price">
                  = £{(ci.price * ci.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <h2>Total: ${total.toFixed(2)}</h2>
          <Link to="/checkout">
            <button className="checkout-button">Proceed to Checkout</button>
          </Link>
        </aside>
      )}
    </div>
  );
}