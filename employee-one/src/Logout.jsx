import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Authen'; // Import the custom hook

const Logout = () => {
  const { logout } = useAuth(); // Get the logout function from the AuthContext
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call the logout function
    localStorage.removeItem('authToken'); // Optionally clear auth token from localStorage
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="logout-container">
      <h1>Are you sure you want to log out?</h1>
      <button onClick={handleLogout} className="btn-logout">Logout</button>
    </div>
  );
};

export default Logout;
