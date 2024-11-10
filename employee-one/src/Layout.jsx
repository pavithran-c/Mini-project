// Layout.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Layout.css'; // Ensure to create this CSS file for the layout styles

const Layout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(true); // State to manage sidebar collapse

  const toggleSidebar = () => {
    setIsCollapsed(prevState => !prevState);
  };

  return (
    <div className={`layout-container ${isCollapsed ? 'collapsed' : ''}`}>
      <nav className={`navbar ${isCollapsed ? 'collapsed' : ''}`}>
        <ul>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/employees">Employees</Link></li>
          <li><Link to="/attendance">Attendance</Link></li>
          <li><Link to="/projects">Reports</Link></li>
          <li><Link to="/logout">Logout</Link></li>
        </ul>
      </nav>

      <div className={`toggle-btn ${isCollapsed ? 'collapsed' : ''}`} onClick={toggleSidebar}>
        {isCollapsed ? '>' : '<'}
      </div>

      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default Layout;
