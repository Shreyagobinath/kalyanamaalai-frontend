// src/pages/Register.js
import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

// Popup Notification Component
const NotificationPopup = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50">
      {message}
    </div>
  );
};

const Register = () => {
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");

  // Backend notifications (optional)
  useEffect(() => {
    socket.on("notification", (msg) => {
      setNotification(msg);
      setTimeout(() => setNotification(""), 3000);
    });
    return () => socket.off("notification");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Map frontend "name" to backend "full_name_en"
      const payload = { ...form, full_name_en: form.name };
      await API.post("/auth/register", payload);

      setNotification(`💍 ${form.name} registered successfully!`);
      setTimeout(() => setNotification(""), 3000);

      // Redirect to login after short delay
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <NotificationPopup message={notification} />

      <div className="w-full max-w-sm mx-auto mt-20 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center text-orange-500">
          Register
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-sm p-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-sm p-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded-sm p-2"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-300"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
