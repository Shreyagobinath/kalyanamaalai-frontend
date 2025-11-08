import React from "react";
import {Navigate} from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
    const token = localStorage.getItem("token");
    const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;

    if (!token) return <Navigate to="/userlogin" replace />;
    if (role && payload.role !== role) return <Navigate to="/" replace />;

    return children;
};

export default ProtectedRoute;