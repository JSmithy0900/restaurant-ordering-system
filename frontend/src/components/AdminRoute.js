// src/components/AdminRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // A custom hook that provides user info

function AdminRoute({ children }) {
  const { user } = useAuth(); // Assume this hook returns an object with a `user` property

  // If there's no user or the user's role isn't 'admin', redirect them to the home page (or login page)
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the protected component
  return children;
}

export default AdminRoute;
