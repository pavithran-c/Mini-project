import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './Authen'; // Import AuthProvider
import HomeAfterLogin from './Home';
import Login from './Login'; 
import Welcome from './Welcome';
import Logout from './Logout';
import EmployeeList from './Employees';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<PrivateHomeRoute />} />
          <Route path='/logout' element={<PrivateLogoutRoute/>}/>
          <Route path='/employees' element={<PrivateEmployee/>}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function PrivateHomeRoute() {
  const { isAuthenticated } = useAuth(); 

  return isAuthenticated ? <HomeAfterLogin /> : <Navigate to="/login" />;
}
function PrivateLogoutRoute(){
  const {isAuthenticated}=useAuth();
  return isAuthenticated?<Logout/> : <Navigate to="/login"/>
}
function PrivateEmployee(){
  const {isAuthenticated}=useAuth();
  return isAuthenticated ? <EmployeeList/> :<Navigate to="/login"/>
}
export default App;
