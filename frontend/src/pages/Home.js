import React from 'react';
import { useAuth } from '../context/AuthContext'; 
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import '../css/Home.css';
import '../css/app.css';

function Home() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // Function to log the user out.
  const handleLogout = () => {
    // Remove user data and token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    
    navigate('/login');
  };

  return (
    <div className="homepage">
            <NavBar />

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
        </div>
      </section>

      <footer className="footer">
        <p>© 2025 My Restaurant. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
