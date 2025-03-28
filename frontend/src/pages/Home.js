// src/Home.js
import React from 'react';
import { useAuth } from '../context/AuthContext'; // Ensure correct path to your AuthContext
import { Link } from 'react-router-dom';
import '../css/Home.css';
import '../css/app.css';

function Home() {
  const { user } = useAuth();

  return (
    <div className="homepage">
      <header className="header">
        <div className="header-container">
          <div className="logo">My Restaurant</div>
          <nav className="nav">
            <ul>
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/order">Order</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/login">Login</Link></li>
              {user && user.role === 'admin' && (
                <li><Link to="/create-user">Create User</Link></li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      <section className="banner">
        <div className="banner-content">
          <h1>Welcome to My Restaurant</h1>
          <p>Fresh, modern cuisine served daily</p>
          <Link className="order-button" to="/order">Order Now</Link>
        </div>
      </section>

      <section className="featured">
        <h2>Our Specialties</h2>
        <div className="featured-grid">
          {/* ... your dish items ... */}
        </div>
      </section>

      {/* Show the currently logged-in user (if any) */}
      <section className="user-info">
        {user ? (
          <p>You are logged in as <strong>{user.name}</strong> (Role: {user.role})</p>
        ) : (
          <p>You are not logged in.</p>
        )}
      </section>

      <footer className="footer">
        <p>© 2025 My Restaurant. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
