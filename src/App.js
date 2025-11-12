// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import UserForm from "./pages/userform";
import Home from "./pages/home";
import UserDashboard from "./pages/userdashboard";
import AdminDashboard from "./pages/admindashboard"
import AllUsers from "./pages/allusers";
import PendingConnections from "./pages/pendingconnections";

// Auth helpers
const getToken = () => localStorage.getItem("token");
const getRole = () => localStorage.getItem("role");

// Protected route wrapper
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = getToken();
  const role = getRole();

  if (!token) return <Navigate to="/login" replace />;
  if (adminOnly && role !== "admin") return <Navigate to="/login" replace />;

  return children;
};

// Dashboard component that chooses based on role
const Dashboard = () => {
  const role = getRole();
  if (role === "admin") return <AdminDashboard/>;
  return <UserDashboard />;
};

// Simple 404 page
const NotFound = () => (
  <div className="text-center mt-20">
    <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
  </div>
);

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/users" element={
        <ProtectedRoute adminOnly={true}>
          <AllUsers />
        </ProtectedRoute>
      } />

      <Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute adminOnly={true}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/user/dashboard"
  element={
    <ProtectedRoute>
      <UserDashboard />
    </ProtectedRoute>
  }
/>

      {/* Dashboard: dynamically renders user or admin component */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* User Protected Routes */}
      <Route
        path="/user/form"
        element={
          <ProtectedRoute>
            <UserForm />
          </ProtectedRoute>
        }
      />

      {/* Admin Protected Routes */}
      <Route
        path="/admin/connections/pending"
        element={
          <ProtectedRoute adminOnly={true}>
            <PendingConnections />
          </ProtectedRoute>
        }
      />

      {/* 404 Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
