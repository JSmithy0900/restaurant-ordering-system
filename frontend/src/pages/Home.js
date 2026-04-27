import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import '../css/Home.css';
import '../css/app.css';

function Home() {
  return (
    <div className="homepage">
      <NavBar />

      <section className="banner">
        <div className="banner-content">
          <h1>Fresh food,<br />delivered to your door</h1>
          <p>Handcrafted dishes made with quality ingredients, ready when you are.</p>
          <Link className="order-button" to="/menu">Order Now</Link>
        </div>
      </section>

      <section className="featured">
        <h2>Our Specialties</h2>
        <p>A taste of what's waiting for you</p>
        <div className="featured-grid">
          <div className="specialty-card">
            <img src="/images/beefburger.png" alt="Signature Burger" />
            <h3>Signature Burger</h3>
          </div>
          <div className="specialty-card">
            <img src="/images/margheritapizza.png" alt="Wood-Fired Pizza" />
            <h3>Wood-Fired Pizza</h3>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How it works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-icon">🍽️</div>
            <h3>Browse the menu</h3>
            <p>Choose from starters, mains and desserts</p>
          </div>
          <div className="step">
            <div className="step-icon">🛒</div>
            <h3>Add to basket</h3>
            <p>Build your order at your own pace</p>
          </div>
          <div className="step">
            <div className="step-icon">💳</div>
            <h3>Pay securely</h3>
            <p>Checkout with Stripe in seconds</p>
          </div>
          <div className="step">
            <div className="step-icon">🚗</div>
            <h3>Track delivery</h3>
            <p>Watch your order status in real time</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2025 My Restaurant. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
