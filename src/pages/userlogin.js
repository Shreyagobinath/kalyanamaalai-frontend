// pages/userlogin.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/uselogin";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginMutation = useLogin(
    (data) => {
      localStorage.setItem("token", data.token);
      const payload = JSON.parse(atob(data.token.split(".")[1]));
      localStorage.setItem("role",payload.role);
      payload.role === "user"
        ? navigate("/userdashboard")
        : navigate("/admindashboard");
    },
    (err) => alert(err)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="glass-card max-w-md w-full fade-in">
        <h2 className="heading text-center text-emerald-600">User Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />
          <button type="submit" className="btn btn-primary w-full">
            {loginMutation.isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
