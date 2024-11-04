import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state
  const [newEmployee, setNewEmployee] = useState({
    employeeId: '',
    name: '',
    position: '',
    basicPay: '',
    allowances: '',
    deductions: '',
    hoursWorked: ''
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/employees');
      console.log('Fetched Employees:', response.data); // Debugging log
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to fetch employees'); // Set error message
    } finally {
      setLoading(false); // Set loading to false when done
    }
  };

  const addEmployee = async (e) => {
    e.preventDefault();

    // Convert values to numbers and check for NaN
    const basicPay = Number(newEmployee.basicPay);
    const hoursWorked = Number(newEmployee.hoursWorked);
    const allowances = Number(newEmployee.allowances);
    const deductions = Number(newEmployee.deductions);
    
    if (isNaN(basicPay) || isNaN(hoursWorked) || isNaN(allowances) || isNaN(deductions)) {
      alert('Please enter valid numbers for salary components.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/employees', { ...newEmployee, basicPay, hoursWorked, allowances, deductions });
      fetchEmployees();
      setNewEmployee({ employeeId: '', name: '', position: '', basicPay: '', allowances: '', deductions: '', hoursWorked: '' });
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/employees/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  if (loading) {
    return <div>Loading employees...</div>; // Loading state
  }

  if (error) {
    return <div>{error}</div>; // Error message
  }

  return (
    <div>
      <h2>Employee List</h2>
      {employees.length === 0 ? ( // Conditional rendering for empty list
        <p>No employees found.</p>
      ) : (
        <ul>
          {employees.map(employee => (
            <li key={employee._id}>
              {employee.employeeId} - {employee.name} - {employee.position} - Salary: ${employee.totalSalary}
              <button onClick={() => deleteEmployee(employee._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      <h3>Add New Employee</h3>
      <form onSubmit={addEmployee}>
        <input type="text" name="employeeId" value={newEmployee.employeeId} onChange={e => setNewEmployee({ ...newEmployee, employeeId: e.target.value })} placeholder="Employee ID" required />
        <input type="text" name="name" value={newEmployee.name} onChange={e => setNewEmployee({ ...newEmployee, name: e.target.value })} placeholder="Name" required />
        <input type="text" name="position" value={newEmployee.position} onChange={e => setNewEmployee({ ...newEmployee, position: e.target.value })} placeholder="Position" required />
        <input type="number" name="basicPay" value={newEmployee.basicPay} onChange={e => setNewEmployee({ ...newEmployee, basicPay: e.target.value })} placeholder="Basic Pay" required />
        <input type="number" name="allowances" value={newEmployee.allowances} onChange={e => setNewEmployee({ ...newEmployee, allowances: e.target.value })} placeholder="Allowances" required />
        <input type="number" name="deductions" value={newEmployee.deductions} onChange={e => setNewEmployee({ ...newEmployee, deductions: e.target.value })} placeholder="Deductions" required />
        <input type="number" name="hoursWorked" value={newEmployee.hoursWorked} onChange={e => setNewEmployee({ ...newEmployee, hoursWorked: e.target.value })} placeholder="Hours Worked" required />
        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
};

export default EmployeeList;
