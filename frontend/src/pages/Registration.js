// src/RegistrationPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Registration.css';
import '../css/app.css';

function RegistrationPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    //prevent the page from refreshing 
    e.preventDefault();
    try {
      const response = await fetch('https://restaurant-ordering-system-1.onrender.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      setMessage('Registration successful! Please log in.');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="registration-page">
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
      
      <div className="registration-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Phone:</label>
            <input 
              type="text" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
            />
          </div>
          <button type="submit" className="register-button">Register</button>
        </form>
        {message && <p className="message">{message}</p>}
        <p className="login-link">
          Already have an account? <Link to="/login">Log in here</Link>.
        </p>
      </div>
      
      <footer className="footer">
        <p>© 2025 My Restaurant. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default RegistrationPage;
