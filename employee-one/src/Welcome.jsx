import React from 'react';
import { Link } from 'react-router-dom';
import './Wel.css';
const Welcome = () => {
  return (
    <div className="welcome-container">
      <nav className="navbar">
        <div className="logo">EMS</div>
      </nav>

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
