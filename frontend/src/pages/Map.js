import React from 'react';
import GoogleMapComponent from '../components/GoogleMap';
import { Link } from 'react-router-dom';

function MapPage() {
  return (
    <div className="map-page">
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

      <main className="main-content">
        <h1>Our Location</h1>
        <GoogleMapComponent />
      </main>

      <footer className="footer">
        <p>© 2025 My Restaurant. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default MapPage;
