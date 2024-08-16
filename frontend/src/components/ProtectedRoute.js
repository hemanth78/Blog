// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, requiredRole }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const location = useLocation();

  if (!token) {
    // If no token, redirect to login
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (requiredRole && role !== requiredRole) {
    // If role does not match, redirect to login
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // Render the protected component
  return Component;
};

export default ProtectedRoute;
