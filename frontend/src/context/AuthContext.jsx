import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is cached in localStorage
    const savedUser = localStorage.getItem('hotelpro_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem('hotelpro_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      const userData = response.data.data;
      setUser(userData);
      localStorage.setItem('hotelpro_user', JSON.stringify(userData));
      return userData;
    }
  };

  const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.success) {
      const newUser = response.data.data;
      setUser(newUser);
      localStorage.setItem('hotelpro_user', JSON.stringify(newUser));
      return newUser;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hotelpro_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isStaffOrAdmin: ['staff', 'admin'].includes(user?.role),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
