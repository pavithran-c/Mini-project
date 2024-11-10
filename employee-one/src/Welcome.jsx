import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Wel.css';

const Welcome = () => {
  useEffect(() => {
    // Add class to body on mount
    document.body.classList.add('welcome-page');

    // Cleanup function to remove class on unmount
    return () => {
      document.body.classList.remove('welcome-page');
    };
  }, []);

  return (
    <div className="welcome-container">
      <div className="hero-section">
        <div className="hero-text">
          <h1>Welcome to Employee Management System</h1>
          <p>Manage employee details, track performance, and improve productivity efficiently.</p>
          <Link to="/login" className="btn">Get Started</Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
