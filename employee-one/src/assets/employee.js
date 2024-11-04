import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/employeeDB')
 .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  name: String,
  position: String,
  basicPay: { type: Number, required: true },
  allowances: { type: Number, default: 0 }, // Provide default values
  deductions: { type: Number, default: 0 }, // Provide default values
  hoursWorked: { type: Number, required: true },
  totalWorkingHoursInMonth: { type: Number, default: 160 },  // Default to 160 hours per month
  totalSalary: Number,
});

// Employee Model
const Employee = mongoose.model('Employee', employeeSchema);

const calculateTotalSalary = (basicPay, hoursWorked, totalWorkingHoursInMonth = 160, allowances = 0, deductions = 0) => {
  // Ensure values are valid numbers
  if (isNaN(basicPay) || isNaN(hoursWorked) || isNaN(totalWorkingHoursInMonth) || isNaN(allowances) || isNaN(deductions)) {
    throw new Error('Invalid input for salary calculation');
  }

  const hourlyRate = basicPay / totalWorkingHoursInMonth;
  const salaryForWorkedHours = hourlyRate * hoursWorked;
  return salaryForWorkedHours + allowances - deductions;
};

// API Routes
app.post('/employees', async (req, res) => {
  const { employeeId, name, position, basicPay, allowances = 0, deductions = 0, hoursWorked, totalWorkingHoursInMonth = 160 } = req.body;

  // Ensure required fields are valid
  if (!basicPay || !hoursWorked) {
    return res.status(400).json({ message: 'Missing or invalid fields for salary calculation' });
  }

  try {
    const totalSalary = calculateTotalSalary(basicPay, hoursWorked, totalWorkingHoursInMonth, allowances, deductions);
    const newEmployee = new Employee({
      employeeId,
      name,
      position,
      basicPay,
      allowances,
      deductions,
      hoursWorked,
      totalWorkingHoursInMonth,
      totalSalary,
    });
    await newEmployee.save();
    res.json(newEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/employees', async (req, res) => {
  try {
      const employees = await Employee.find();
      res.json(employees);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
