import React from 'react';
import { useAuth } from '../context/AuthContext';
import NotLoggedInModal from './NotLoggedInModal';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  const isEmptyUser = !user || (typeof user === 'object' && Object.keys(user).length === 0);

  if (isEmptyUser) {
    return <NotLoggedInModal />;
  }

  return children;
};

export default ProtectedRoute;
