// src/components/ProtectedUserDashboard.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../api/axios";

const ProtectedUserDashboard = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let mounted = true;
    const verify = async () => {
      try {
        const res = await API.get("/auth/form-status");
        const { isApproved, hasForm } = res.data || {};

        // allow only if user has submitted form AND is approved
        if (mounted && hasForm && isApproved === true) {
          setAllowed(true);
        } else {
          setAllowed(false);
        }
      } catch (err) {
        // if error, block access
        setAllowed(false);
      } finally {
        if (mounted) setChecking(false);
      }
    };

    verify();
    return () => (mounted = false);
  }, []);

  if (checking) {
    // show a small loading placeholder while verifying
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!allowed) {
    // not allowed → send to thank-you (if form submitted) or to form
    return <Navigate to="/thank-you" replace />;
  }

  return children;
};

export default ProtectedUserDashboard;
