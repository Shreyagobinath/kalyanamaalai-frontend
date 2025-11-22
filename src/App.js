// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/register";
import UserForm from "./pages/userform";
import Home from "./pages/home";
import UserDashboard from "./pages/userdashboard";
import AdminDashboard from "./pages/admindashboard";
import AllUsers from "./pages/allusers";
import PendingConnections from "./pages/pendingconnections";
import ThankYou from "./pages/thankyou";

// ⬇️ YOU ALREADY HAVE THIS — KEEP IT
import ProtectedUserDashboard from "./components/ProtectedUserDashboard";

const getToken = () => localStorage.getItem("token");

const ProtectedRoute = ({ children }) => {
  if (!getToken()) return <Navigate to="/login" replace />;
  return children;
};

const DashboardSelector = () => {
  const role = localStorage.getItem("role");
  if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (role === "user") return <Navigate to="/user/dashboard" replace />;
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <AllUsers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/connections/pending"
        element={
          <ProtectedRoute>
            <PendingConnections />
          </ProtectedRoute>
        }
      />

      {/* User Dashboard with approval logic */}
      <Route
        path="/user/dashboard"
        element={
          <ProtectedUserDashboard>
            <UserDashboard />
          </ProtectedUserDashboard>
        }
      />

      {/* User Form */}
      <Route
        path="/user/form"
        element={
          <ProtectedRoute>
            <UserForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/thank-you"
        element={
          <ProtectedRoute>
            <ThankYou />
          </ProtectedRoute>
        }
      />

      {/* Auto redirect */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardSelector />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<div>404 Page Not Found</div>} />
    </Routes>
  );
}

export default App;
