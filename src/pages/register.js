import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: async ({ name, email, password }) => {
      const res = await API.post("/auth/register", { name, email, password });
      return res.data;
    },
    onSuccess: (data) => {
      alert(data.message || "Signup successful! Please log in.");
      navigate("/userlogin");
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Signup failed");
    },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    registerMutation.mutate({
      name: form.name,
      email: form.email,
      password: form.password,
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="glass-card max-w-md w-full fade-in">
        <h2 className="heading text-center text-emerald-600">Create Your Account</h2>
        <p className="subheading text-center">Join our trusted community</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition"
          >
            {registerMutation.isPending ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/userlogin" className="text-emerald-600 font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
