import React from "react";
import { Navigate } from "react-router-dom";

const DashboardSelector = () => {
  const role = localStorage.getItem("role"); // "admin" or "user"

  if (role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (role === "user") {
    return <Navigate to="/user/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default DashboardSelector;
