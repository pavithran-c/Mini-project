import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProjectForm = () => {
  const [projectData, setProjectData] = useState({
    name: '',
    startTime: '',
    endTime: '',
    status: 'Ongoing',
    employees: [], // This will store employee IDs
  });
  const [employees, setEmployees] = useState([]);
  const [ongoingProjects, setOngoingProjects] = useState([]);

  useEffect(() => {
    fetchOngoingProjects();
    fetchEmployees();
  }, []);

  const fetchOngoingProjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/projects');
      setOngoingProjects(response.data.filter((project) => project.status === 'Ongoing'));
    } catch (error) {
      console.error('Error fetching ongoing projects:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/employees');
      setEmployees(response.data); // Assuming the employee data contains '_id' as the employee identifier
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure projectData.employees contains an array of employee IDs
      const response = await axios.post('http://localhost:5000/projects', {
        ...projectData,
        employeeIds: projectData.employees, // Use employeeIds when submitting the form
      });

      setProjectData({ name: '', startTime: '', endTime: '', status: 'Ongoing', employees: [] });
      fetchOngoingProjects(); // Refresh the list of ongoing projects
    } catch (error) {
      console.error('Error adding new project:', error);
    }
  };

  const markProjectAsDone = async (id) => {
    try {
      await axios.put(`http://localhost:5000/projects/${id}`, { status: 'Done' });
      fetchOngoingProjects(); // Refresh the list of ongoing projects
    } catch (error) {
      console.error('Error marking project as done:', error);
    }
  };

  const handleEmployeeSelection = (e) => {
    const selectedEmployees = Array.from(e.target.selectedOptions, (option) => option.value);
    setProjectData((prevData) => ({
      ...prevData,
      employees: selectedEmployees, // Store the employee IDs in the state
    }));
  };

  return (
    <div className="project-form-container">
      <h2>Add New Project</h2>
      <form onSubmit={handleSubmit} className="project-form">
        <input
          type="text"
          name="name"
          placeholder="Project Name"
          value={projectData.name}
          onChange={handleChange}
          required
        />
        <input
          type="datetime-local"
          name="startTime"
          value={projectData.startTime}
          onChange={handleChange}
          required
        />
        <input
          type="datetime-local"
          name="endTime"
          value={projectData.endTime}
          onChange={handleChange}
          required
        />
        <select
          multiple
          name="employees"
          value={projectData.employees}
          onChange={handleEmployeeSelection}
          required
          size={employees.length} // Adjust the size based on the number of employees
        >
          {employees.map((employee) => (
            <option key={employee._id} value={employee._id}>
              {employee.name}
            </option>
          ))}
        </select>

        <div>
          <strong>Selected Employees: </strong>
          {projectData.employees.length > 0
            ? projectData.employees
                .map((id) => employees.find((employee) => employee._id === id)?.name)
                .join(', ')
            : 'No employees selected'}
        </div>

        <button type="submit">Add Project</button>
      </form>

      <section className="ongoing-projects-section">
        <h3>Ongoing Projects</h3>
        <ul className="ongoing-projects-list">
          {ongoingProjects.length > 0 ? (
            ongoingProjects.map((project) => (
              <li key={project._id} className="project-item">
                <div>
                  <strong>{project.name}</strong>
                  <p>Start: {project.startTime}</p>
                  <p>End: {project.endTime}</p>
                  <p>
                    Employees:{' '}
                    {Array.isArray(project.employeeIds) && project.employeeIds.length > 0
                      ? project.employeeIds
                          .map((employee) => employee.name) // Map to extract employee names
                          .join(', ')
                      : 'No employees assigned'}
                  </p>
                </div>
                <button onClick={() => markProjectAsDone(project._id)} className="mark-done-button">
                  Mark as Done
                </button>
              </li>
            ))
          ) : (
            <p>No ongoing projects.</p>
          )}
        </ul>
      </section>
    </div>
  );
};

export default ProjectForm;
