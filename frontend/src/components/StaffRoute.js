import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function StaffRoute({ children }) {
  const { user } = useAuth();
  if (user?.role === 'admin' || user?.role === 'staff') {
    return children;
  }
  return <Navigate to="/login" replace />;
}
