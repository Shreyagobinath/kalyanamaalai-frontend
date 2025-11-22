// src/pages/ThankYou.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const ThankYou = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState("");

  // Auto-check approval once
  useEffect(() => {
    let mounted = true;

    const checkOnce = async () => {
      try {
        const res = await API.get("/auth/form-status");
        if (mounted && res?.data?.isApproved === 1) {
          navigate("/user/dashboard");
        }
      } catch (err) {
        // ignore - user stays here
      }
    };

    checkOnce();
    return () => (mounted = false);
  }, [navigate]);

  // Go Home button
  const handleGoHome = () => {
    navigate("/");
  };

  // Logout button
  const handleLogout = () => {
    localStorage.clear(); // clear token, role, status, form
    navigate("/login");
  };

  // Check approval when pressing "Go to Dashboard"
  const handleGoDashboard = async () => {
    try {
      setChecking(1);
      setMessage("");

      const res = await API.get("/auth/form-status");
      const { isApproved, hasForm } = res.data || {};

      if (isApproved === 1) {
        navigate("/user/dashboard");
      } else if (hasForm === 1 && isApproved !== 1) {
        setMessage(
          "Your application is still pending admin approval. Please wait — you will be notified once approved."
        );
      } else {
        setMessage(
          "No submitted form found. Please complete the application first."
        );
      }
    } catch (err) {
      console.error("Status check error:", err);
      setMessage("Unable to check status right now. Try again later.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-orange-50 p-6">
      <div className="max-w-2xl bg-white shadow-xl rounded-lg p-10 text-center">

        <h1 className="text-4xl font-bold text-orange-600 mb-6">
          Thank You! 💍
        </h1>

        <p className="text-lg text-gray-700 mb-3">
          Your profile form has been successfully submitted to{" "}
          <strong>Kalyanamalai</strong>.
        </p>

        <p className="text-lg text-gray-700 mb-6">
          Our admin will review your details. You will be notified once your
          application is approved.
        </p>

        {message && (
          <div className="mb-4 text-center text-sm text-gray-700">
            {message}
          </div>
        )}

        <div className="flex gap-4 justify-center mt-4">
          {/* Go Home Button */}
          <button
            onClick={handleGoHome}
            className="px-6 py-3 bg-orange-600 text-white rounded-md shadow hover:bg-orange-700 transition"
          >
            Go to Home
          </button>

          {/* Dashboard Button */}
          <button
            onClick={handleGoDashboard}
            disabled={checking}
            className={`px-6 py-3 rounded-md shadow text-white transition ${
              checking
                ? "bg-gray-400 cursor-wait"
                : "bg-gray-800 hover:bg-gray-900"
            }`}
          >
            {checking ? "Checking…" : "Go to Dashboard"}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-600 text-white rounded-md shadow hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
