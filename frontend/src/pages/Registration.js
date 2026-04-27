import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import '../css/Registration.css';
import '../css/app.css';

function RegistrationPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://restaurant-ordering-system-qbfz.onrender.com/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');
      setSuccess(true);
      setMessage('Account created! You can now log in.');
    } catch (err) {
      setSuccess(false);
      setMessage(err.message);
    }
  };

  return (
    <div className="registration-page">
      <NavBar />
      <div className="auth-center">
        <div className="registration-container">
          <h1>Create account</h1>
          <p className="auth-subtitle">Join us to start ordering</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Smith"
                required
              />
            </div>
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
            <div className="form-group">
              <label>Phone number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="07700 000000"
              />
            </div>
            <button type="submit" className="register-button">Create account</button>
          </form>

          {message && (
            <p className={`message${success ? ' success' : ''}`}>{message}</p>
          )}

          <p className="login-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
      <footer className="footer">
        <p>© 2025 My Restaurant. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default RegistrationPage;
