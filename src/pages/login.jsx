// src/pages/Login.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const NotificationPopup = ({ message }) => {
  if (!message) return null;
  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-xl z-50">
      {message}
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");

  const checkFormStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await API.get("/auth/check-form-status", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      localStorage.setItem("hasSubmittedForm", data.hasForm ? 1 : 0);
      localStorage.setItem("isApproved", data.isApproved ? 1 : 0);

      if (data.hasForm && !data.isApproved) navigate("/thank-you");
      else if (data.isApproved) navigate("/user/dashboard");
      else navigate("/user/form");
    } catch (err) {
      console.error("Error checking form status:", err);
      alert("Unable to check status right now. Try again later.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      if (role === "admin") navigate("/admin/dashboard");
      else checkFormStatus();
    }
  }, [navigate]);

  useEffect(() => {
    socket.on("notification", (msg) => {
      setNotification(msg);
      setTimeout(() => setNotification(""), 3000);
    });
    return () => socket.off("notification");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/login", { email, password });
      const { token, role, user } = res.data || {};

      if (!token || !user) return setError("Login failed: invalid server response");

      // Use full_name_en if name is undefined
      const username = user.name || user.full_name_en || "User";

      localStorage.setItem("token", token);
      localStorage.setItem("role", role || "user");
      localStorage.setItem("username", username);
      localStorage.setItem("hasSubmittedForm", user.hasSubmittedForm || 0);
      localStorage.setItem("form_completed", user.form_completed || 0);
      localStorage.setItem("isApproved", user.isApproved || 0);

      setNotification(`💍 ${username} logged successfully in Kalyanamalai`);
      setTimeout(() => setNotification(""), 3000);

      setTimeout(() => {
        if (role === "admin") navigate("/admin/dashboard");
        else checkFormStatus();
      }, 800);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <NotificationPopup message={notification} />

      <div className="bg-white shadow-xl rounded-lg p-10 w-96">
        <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">
          Login
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-sm p-2"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-sm p-2"
            required
          />

          <button
            type="submit"
            className="bg-orange-400 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-orange-500 cursor-pointer font-semibold"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
