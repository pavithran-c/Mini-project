import React from "react";
import { AuthProvider } from "./Authen"; // Ensure this is imported correctly
import Layout from "./components/Layout/Layout";
import Login from "./components/Layout/Login";
import { useAuth } from "./Authen"; // Correct import for useAuth

function App() {
  const { isAuthenticated } = useAuth(); // Get authentication status

  return isAuthenticated ? <Layout /> : <Login />;
}

export default function Root() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
