// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/Login';
import RegistrationPage from './pages/Registration';
import MenuPage from './pages/Menu';
import AdminCreateUser from './pages/CreateUser'; // Your admin page for creating users
import AdminRoute from './components/AdminRoute'; // The protected route we just created

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/menu" element={<MenuPage />} />
        {/* Protect the admin page */}
        <Route
          path="/create-user"
          element={
            <AdminRoute>
              <AdminCreateUser />
            </AdminRoute>
          }
        />
        {/* Other routes */}
      </Routes>
    </Router>
  );
}

export default App;
