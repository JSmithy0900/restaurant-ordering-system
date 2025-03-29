// src/MenuPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Menu.css';
import '../css/app.css';

function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('https://restaurant-ordering-system-1.onrender.com/menu');
        if (!response.ok) {
          throw new Error('Error fetching menu');
        }
        const data = await response.json();
        setMenuItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (loading) {
    return (
      <div className="menu-page">
        <p>Loading menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu-page">
        <p>Error: {error}</p>
      </div>
    );
  }

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

      <main className="menu-content">
        <h1>Our Menu</h1>
        <div className="menu-grid">
          {menuItems.map((item) => (
            <div key={item._id} className="menu-item">
              <img
                src={item.imageUrl || 'https://via.placeholder.com/300x200'}
                alt={item.name}
              />
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p className="price">${item.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="footer">
        <p>© 2025 My Restaurant. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default MenuPage;
