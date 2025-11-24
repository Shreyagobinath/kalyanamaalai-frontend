// src/components/ProtectedUserDashboard.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../api/axios";

const ProtectedUserDashboard = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [route, setRoute] = useState(null);

  useEffect(() => {
    let mounted = true;

    const verify = async () => {
      console.log("[Dashboard] Checking user form status...");

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const res = await API.get("/user/form/status", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("[Dashboard] API response:", res.data);

        if (!mounted) return;

        const { hasForm, isApproved } = res.data || {};

        if (!hasForm) {
          console.log("[Dashboard] User has not filled the form → redirect to /user/form");
          setRoute("/user/form");
        } 
        else if (hasForm && !isApproved) {
          console.log("[Dashboard] Form submitted but not approved → redirect to /thank-you");
          setRoute("/thank-you");
        } 
        else if (hasForm && isApproved) {
          console.log("[Dashboard] User approved → allow dashboard");
          setRoute("ALLOW");
        } 
        else {
          console.log("[Dashboard] Unknown status → redirect to /login");
          setRoute("/login");
        }

      } catch (err) {
        console.error("[Dashboard] Error verifying user:", err);
        setRoute("/thank-you");
      } finally {
        if (mounted) {
          setChecking(false);
          console.log("[Dashboard] Finished checking");
        }
      }
    };

    verify();
    return () => (mounted = false);
  }, []);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading user dashboard...</div>
      </div>
    );
  }

  if (route && route !== "ALLOW") {
    console.log("[Dashboard] Redirecting to:", route);
    return <Navigate to={route} replace />;
  }

  return children;
};

export default ProtectedUserDashboard;
