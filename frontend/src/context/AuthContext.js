// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

// In AuthContext.js
export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
      // Try to fetch the stored user from localStorage when initializing state.
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    });
  
    // Whenever user changes, update localStorage.
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }, []);
      
      useEffect(() => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          localStorage.removeItem('user');
        }
      }, [user]);
      
  
    return (
      <AuthContext.Provider value={{ user, setUser }}>
        {children}
      </AuthContext.Provider>
    );
  }
  

// Custom hook for accessing auth context
export function useAuth() {
  return useContext(AuthContext);
}