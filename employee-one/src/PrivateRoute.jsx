import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Authen'; // Import the custom hook

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Check if user is authenticated

  return isAuthenticated ? children : <Navigate to="/login" />; // Redirect to login if not authenticated
};

export default PrivateRoute;
