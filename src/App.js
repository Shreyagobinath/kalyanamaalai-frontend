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

// 🔥 IMPORTANT — NEW COMPONENT
import ProtectedUserDashboard from "./components/ProtectedUserDashboard";  

// Existing protected route (token only)
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

      {/* ============================
          ADMIN PROTECTED ROUTES
         ============================ */}
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

      {/* ============================================
          USER ROUTES — RESTRICTED BY APPROVAL STATUS
         ============================================ */}

      {/* ✔ User Dashboard must check approval BEFORE opening */}
      <Route
        path="/user/dashboard"
        element={
          <ProtectedUserDashboard>
            <UserDashboard />
          </ProtectedUserDashboard>
        }
      />

      {/* User form can be accessed if logged in */}
      <Route
        path="/user/form"
        element={
          <ProtectedRoute>
            <UserForm />
          </ProtectedRoute>
        }
      />

      {/* Thank You page after form submit */}
      <Route
        path="/thank-you"
        element={
          <ProtectedRoute>
            <ThankYou />
          </ProtectedRoute>
        }
      />

      {/* Dashboard redirect logic */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardSelector />
          </ProtectedRoute>
        }
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
