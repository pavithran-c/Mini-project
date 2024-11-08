import express from 'express';
import mysql from 'mysql';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import bodyParser from 'body-parser';
const app = express();
const port = 5002;
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      
  password: '06456943',     
  database: 'login',
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected...');
});

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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
