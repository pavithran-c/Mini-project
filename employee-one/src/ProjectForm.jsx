import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddProjectModal from './AddProjectModel';
import OngoingProjectsList from './Ongoing';
import './ProjectForm.css';

const ProjectForm = () => {
  const [employees, setEmployees] = useState([]);
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [doneProjects, setDoneProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Projects and Employees on component mount
  useEffect(() => {
    fetchProjects();
    fetchEmployees();
  }, []);

  // Fetch all projects from the server
  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/projects');
      const ongoing = response.data.filter((project) => project.status === 'Ongoing');
      console.log(ongoing);
      const done = response.data.filter((project) => project.status === 'Done');
      setOngoingProjects(ongoing);
      setDoneProjects(done);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  // Fetch all employees from the server
  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  // Add a new project
  const handleAddProject = async (projectData) => {
    try {
      await axios.post('http://localhost:5000/projects', {
        ...projectData,
        employeeIds: projectData.employees,  // Ensure this is the array of employee IDs
      });
      fetchProjects(); // Refresh both ongoing and done projects
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding new project:', error);
    }
  };

  // Mark a project as done
  const handleMarkProjectAsDone = async (id) => {
    try {
      await axios.put(`http://localhost:5000/projects/${id}`, { status: 'Done' });
      fetchProjects();
    } catch (error) {
      console.error('Error marking project as done:', error);
    }
  };

  return (
    <div className="project-form-container">
      <h2>Projects</h2>
      <button onClick={() => setIsModalOpen(true)} className="add-project-button">
        Add Project
      </button>
      <AddProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddProject={handleAddProject}
        employees={employees}  // Ensure employees list is passed
      />
      <OngoingProjectsList
        ongoingProjects={ongoingProjects}
        doneProjects={doneProjects}
        onMarkAsDone={handleMarkProjectAsDone}
      />
    </div>
  );
};

export default ProjectForm;
