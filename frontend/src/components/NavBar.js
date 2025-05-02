import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const { user, setUser } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">My Restaurant</div>
        <nav className="nav">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/contact">Contact</Link></li>

            {user 
              ? (
                <>
                  {(user.role === 'staff' || user.role === 'admin') && (
                    <>
                      <li><Link to="/menu-management">Manage Menu</Link></li>
                      <li><Link to="/orders">Order Management</Link></li>
                    </>
                  )}
                 {user.role === 'admin' && (
                        <li><Link to="/create-user">Create User</Link></li>
                      )}
                  <li>
                    <button onClick={handleLogout} className="logout-button">
                      Logout
                    </button>
                  </li>
                </>
              )
              : <li><Link to="/login">Login</Link></li>
            }
          </ul>
        </nav>
      </div>
    </header>
  );
}
