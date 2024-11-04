import React from 'react';
import axois from 'axios';
import { Link } from 'react-router-dom';
import './Home.css';
const fetch= async() =>{
  const response=await axois.get("https://localhost:5000/home");
  console.log(response);
}
const HomeAfterLogin = () => {
  return (
    <div>
    <div className="home-after-login-container">
      <nav className="navbar">
        <div className="logo">EMS</div>
        <ul>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/employees">Employees</Link></li>
          <li><Link to="/performance">Performance</Link></li>
          <li><Link to="/reports">Reports</Link></li>
          <li><Link to="/logout">Logout</Link></li>
        </ul>
      </nav>

      <header className="home-hero">
        <div className="home-hero-text">
          <h1>Welcome Back!</h1>
          <p>Manage your employees and track performance efficiently.</p>
        </div>
      </header>

      <section className="dashboard-section">
        <h2>Dashboard Overview</h2>
        <div className="dashboard-cards">
          <div className="card">
            <h3>Total Employees</h3>
            <p>150</p>
          </div>
          <div className="card">
            <h3>Active Projects</h3>
            <p>12</p>
          </div>
          <div className="card">
            <h3>Pending Reviews</h3>
            <p>8</p>
          </div>
        </div>
      </section>
    </div>
    <footer className="footer">
        <h4>&copy; 2024 Employee Management System. All Rights Reserved.</h4>
      </footer>
    </div>
  );
};

export default HomeAfterLogin;
