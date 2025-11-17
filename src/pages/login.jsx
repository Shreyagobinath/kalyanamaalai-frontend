// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios"; // Axios instance with baseURL

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/login", { email, password });

      // Save token and role in localStorage
      const { token, role } = res.data; // backend should return role too
      localStorage.setItem("token", token);
      localStorage.setItem("role", role); // "user" or "admin"

      // Redirect based on role
      if (role === "admin") {
        navigate("/admin/dashboard"); // Admin will see Admindashboard
      } else {
        navigate("/user/dashboard"); // User will see UserDashboard
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white shadow-xl rounded-lg p-10 w-96">
        <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">
          Login
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

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
