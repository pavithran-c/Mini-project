import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Authen';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    // Add class to body on mount
    document.body.classList.add('login-page');

    // Cleanup function to remove class on unmount
    return () => {
      document.body.classList.remove('login-page');
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!username || !password) {
      setMessage('Please enter both username and password.');
      return;
    }

    setLoading(true); // Set loading state
    setMessage(''); // Clear previous messages

    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });

      if (response.data.message) {
        setMessage(response.data.message);
        login(); // Set the user as authenticated
        navigate('/home'); // Navigate to the home page
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed. Please try again.';
      setMessage(errorMsg);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="login-container">
      <div className="box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="inputBox">
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <span>Username</span>
          </div>
          <div className="inputBox">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span>Password</span>
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {message && <p className={`message ${loading ? 'loading' : ''}`}>{message}</p>}
      </div>
    </div>
  );
};

export default Login;
