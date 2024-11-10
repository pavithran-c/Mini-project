import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';

const HomeAfterLogin = () => {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState(0);

  useEffect(() => {
    // Fetch data for the dashboard cards and ongoing projects
    const fetchDashboardData = async () => {
      try {
        // Fetch employees data
        const employeesResponse = await axios.get('http://localhost:5000/employees');
        setEmployeeCount(employeesResponse.data.length);

        // Fetch projects data
        const projectsResponse = await axios.get('http://localhost:5000/projects');
        const ongoing = projectsResponse.data.filter(project => project.status === 'Ongoing');
        setOngoingProjects(ongoing);
        setCompletedProjects(projectsResponse.data.filter(project => project.status === 'Done').length);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Employee Management Dashboard</h2>
      <div className="dashboard-cards">
        <div className="card">
          <h3>Total Employees</h3>
          <p>{employeeCount}</p>
        </div>
        <div className="card">
          <h3>Ongoing Projects</h3>
          <p>{ongoingProjects.length}</p>
        </div>
        <div className="card">
          <h3>Completed Projects</h3>
          <p>{completedProjects}</p>
        </div>
      </div>

      <section className="ongoing-projects-section">
        <h3>Ongoing Projects</h3>
        <table className="project-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Start Time</th>
              <th>End Time</th>
            </tr>
          </thead>
          <tbody>
              {ongoingProjects.length > 0 ? (
                ongoingProjects.map((project, index) => (
                <React.Fragment key={project.id || `project-${index}`}>
              <tr>
                <td>{project.name}</td>
                <td>{project.startTime}</td>
                <td>{project.endTime}</td>
              </tr>
            </React.Fragment>
                ))
                ) : (
              <tr>
              <td colSpan="3">No ongoing projects found.</td>
            </tr>
              )}
              </tbody>

        </table>
      </section>
    </div>
  );
};

export default HomeAfterLogin;
