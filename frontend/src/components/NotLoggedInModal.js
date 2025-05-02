import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/NotLoggedIn.css'; 

const NotLoggedInModal = () => {
  const navigate = useNavigate();

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Access Denied</h2>
        <p>You must be logged in to access this page.</p>
        <div className="modal-buttons">
          <button onClick={() => navigate('/menu')}>Go to Menu</button>
          <button onClick={() => navigate('/login')}>Log In</button>
          <button onClick={() => navigate('/register')}>Register</button>
        </div>
      </div>
    </div>
  );
};

export default NotLoggedInModal;
