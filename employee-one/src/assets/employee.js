import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import mysql from 'mysql';
import bcrypt from 'bcryptjs';
import bodyParser from 'body-parser';
const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection for login system
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '06456943',  // Update your MySQL password here
  database: 'login',     // MySQL database name for user credentials
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected...');
});

// MongoDB connection for employee, attendance, and project management
mongoose.connect('mongodb://localhost:27017/employeeDB')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Employee Schema and Model
const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  name: String,
  position: String,
  basicPay: { type: Number, required: true },
  allowances: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  totalSalary: { type: Number, default: 0 },  // Store the calculated total salary
  hoursWorked: { type: Number, default: 0 },  // Field to store total hours worked
});

// Helper function to calculate total salary
const calculateTotalSalary = (employee) => {
  // You can also add a per hour rate if needed
  const hourlyRate = 50;  // Example hourly rate, adjust as necessary
  const totalSalary = employee.basicPay + employee.allowances - employee.deductions + (hourlyRate * employee.hoursWorked);
  return totalSalary;
};
const Employee = mongoose.model('Employee', employeeSchema);

// Attendance Schema and Model
const attendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: Date, required: true },
  entryTimes: [{ type: Date }], // Array to hold multiple entry times
  exitTimes: [{ type: Date }],  // Array to hold multiple exit times
  hoursWorked: { type: Number, default: 0 },
  activeEntry: { type: Boolean, default: false } // Track if an active entry exists
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

// Helper function to update hours worked in Employee collection based on attendance
const updateEmployeeHoursWorked = async (employeeId) => {
  try {
    // Sum hoursWorked from all attendance records for this employee
    const totalHoursWorked = await Attendance.aggregate([
      { $match: { employeeId: new mongoose.Types.ObjectId(employeeId) } },
      { $group: { _id: null, totalHours: { $sum: "$hoursWorked" } } },
    ]);

    const hoursWorked = totalHoursWorked[0] ? totalHoursWorked[0].totalHours : 0;

    // Update hoursWorked in Employee collection
    await Employee.findByIdAndUpdate(employeeId, { hoursWorked }, { new: true });
  } catch (error) {
    console.error("Failed to update hours worked for employee:", error);
  }
};

// MySQL Login API
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      res.json({ message: 'Login successful' });
    });
  });
});

// API to get all employees
app.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching employees' });
  }
});

// Add a new employee
app.post('/employees', async (req, res) => {
  try {
    const newEmployeeData = req.body;
    const totalSalary = calculateTotalSalary(newEmployeeData);
    
    // Add total salary to the employee object
    const newEmployee = new Employee({ ...newEmployeeData, totalSalary });
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ error: 'Error adding employee' });
  }
});

// Update an employee
app.put('/employees/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid Employee ID' });
  }

  const updatedData = req.body;

  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Calculate the total salary after update
    const totalSalary = calculateTotalSalary({ ...employee.toObject(), ...updatedData });

    // Update employee record
    const updatedEmployee = await Employee.findByIdAndUpdate(id, { ...updatedData, totalSalary }, { new: true });
    res.json(updatedEmployee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Error updating employee' });
  }
});

// Delete an employee
app.delete('/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting employee' });
  }
});

// Start attendance - records entry time
app.post('/attendance/start', async (req, res) => {
  const { employeeId } = req.body;
  if (!employeeId) {
    return res.status(400).json({ message: 'employeeId is required.' });
  }

  const currentDate = new Date();
  const startOfDay = new Date(currentDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(currentDate);
  endOfDay.setHours(23, 59, 59, 999);

  try {
    const employeeExists = await Employee.exists({ _id: employeeId });
    if (!employeeExists) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    let attendance = await Attendance.findOne({
      employeeId,
      date: { $gte: startOfDay, $lt: endOfDay },
    });

    if (attendance && attendance.activeEntry) {
      return res.status(400).json({ message: 'Entry already marked for today. Please mark exit first.' });
    }

    if (!attendance) {
      attendance = new Attendance({ employeeId, date: currentDate });
    }

    attendance.entryTimes.push(currentDate);
    attendance.activeEntry = true;
    await attendance.save();

    res.status(201).json(attendance);
  } catch (error) {
    console.error('Error starting attendance:', error);
    res.status(500).json({ message: 'Failed to start attendance.' });
  }
});

// End attendance - records exit time and calculates hours worked
app.put('/attendance/end', async (req, res) => {
  const { employeeId } = req.body;
  if (!employeeId) {
    return res.status(400).json({ message: 'employeeId is required.' });
  }

  const currentDate = new Date();
  const startOfDay = new Date(currentDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(currentDate);
  endOfDay.setHours(23, 59, 59, 999);

  try {
    const attendance = await Attendance.findOne({
      employeeId,
      date: { $gte: startOfDay, $lt: endOfDay },
    });

    if (!attendance || !attendance.activeEntry) {
      return res.status(400).json({ message: 'No active entry found for today. Please mark entry first.' });
    }

    attendance.exitTimes.push(currentDate);

    // Calculate hours worked if both entry and exit times exist
    const entryTime = attendance.entryTimes[attendance.entryTimes.length - 1];
    const exitTime = currentDate;
    const hoursWorked = (exitTime - entryTime) / (1000 * 60 * 60); // Convert milliseconds to hours

    attendance.hoursWorked += hoursWorked;
    attendance.activeEntry = false;
    await attendance.save();

    // Update employee's total hours worked
    await updateEmployeeHoursWorked(employeeId);

    // Recalculate total salary
    const employee = await Employee.findById(employeeId);
    const totalSalary = calculateTotalSalary(employee);

    // Update employee's total salary
    await Employee.findByIdAndUpdate(employeeId, { totalSalary }, { new: true });

    res.json(attendance);
  } catch (error) {
    console.error('Error marking exit time:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// API to get attendance records for a date range or specific employee
app.get('/attendance', async (req, res) => {
  const { startDate, endDate, employeeId } = req.query;

  const filter = {};
  if (employeeId) filter.employeeId = employeeId;
  if (startDate && endDate) {
    filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  try {
    const attendanceRecords = await Attendance.find(filter).populate('employeeId', 'name position');
    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve attendance records.' });
  }
});

// API for project management
const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startTime: [{ type: Date }], // Array to hold multiple entry times
  endTime: [{ type: Date }],
  status: { type: String, enum: ['Ongoing', 'completed', 'paused'], default: 'ongoing' },
  employeeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }]
});

const Project = mongoose.model('Project', projectSchema);

// Add a project
app.post('/projects', async (req, res) => {
  const { name, startTime,endTime, status, employeeIds } = req.body;

  try {
    console.log(employeeIds);
    const newProject = new Project({ name, startTime,endTime , status, employeeIds });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: 'Error adding project' });
    console.log(error);
  }
});

// Fetch all projects
app.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().populate('employeeIds', 'name');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching projects' });
  }
});

// Update a project
app.put('/projects/:id', async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(updatedProject);
  } catch (error) {
    console.error('Error adding project:', error);
    res.status(500).json({ error: 'Error adding project', details: error.message });
  }  
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
