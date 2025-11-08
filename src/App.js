import React from "react";
import {Routes,Route}from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages/home";
import Login from "./pages/userlogin";
import AdminLogin from "./pages/adminlogin";
import Register from "./pages/register";
import UserDashboard from "./pages/userdashboard";
import AdminDashboard from "./pages/admindashboard";
import AdminForms from "./pages/adminforms";
import UserForms from "./pages/forms";
import EditProfile from "./pages/editprofiles";
import { Navigate } from "react-router-dom";

// ✅ Initialize TanStack Query client
const queryClient = new QueryClient();

// ✅ Protected route wrapper
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const payload = token ? JSON.parse(atob(token.split(".")[1])):null;

  if (!token) {
    return <Navigate to="/userlogin" replace />;
  }

  // Optional role-based restriction (admin/user)
  if (role && payload.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Routes>
      <Route>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/userlogin" element={<Login />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/userdashboard"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admindashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminforms"
          element={
            <ProtectedRoute role="admin">
              <AdminForms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forms"
          element={
            <ProtectedRoute role="user">
              <UserForms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editprofiles"
          element={
            <ProtectedRoute role="user">
              <EditProfile />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  </QueryClientProvider>
);

export default App;
