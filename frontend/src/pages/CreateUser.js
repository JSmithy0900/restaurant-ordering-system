import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import '../css/CreateUser.css';
import '../css/app.css';

function AdminCreateUser() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', role: 'staff' });
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://restaurant-ordering-system-qbfz.onrender.com/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'User creation failed');
      setSuccess(true);
      setMessage('User created successfully!');
      setFormData({ name: '', email: '', password: '', phone: '', role: 'staff' });
    } catch (err) {
      setSuccess(false);
      setMessage(err.message);
    }
  };

  return (
    <div className="create-user-page">
      <NavBar />
      <div className="create-user-center">
        <div className="create-user-card">
          <h1>Create user</h1>
          <p className="auth-subtitle">Add a new staff or admin account</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Jane Smith" required />
            </div>
            <div className="form-group">
              <label>Email address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="jane@restaurant.com" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
            </div>
            <div className="form-group">
              <label>Phone number</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="07700 000000" />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" className="create-user-btn">Create account</button>
          </form>

          {message && (
            <p className={`create-user-message${success ? ' success' : ''}`}>{message}</p>
          )}
        </div>
      </div>
      <footer className="footer">
        <p>© 2025 My Restaurant. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default AdminCreateUser;
