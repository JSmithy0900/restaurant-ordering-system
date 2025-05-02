import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
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
      const response = await fetch('https://restaurant-ordering-system-qbfz.onrender.com/api/users/register', {
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
      <NavBar />
      
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
