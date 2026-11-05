import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger d-inline-block p-4 shadow-sm">
          <i className="bi bi-shield-lock-fill fs-1 text-danger d-block mb-3"></i>
          <h4>Access Denied</h4>
          <p className="mb-0">You do not have administrative permissions to view this section.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
