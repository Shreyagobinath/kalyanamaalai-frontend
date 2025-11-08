import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/uselogin";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginMutation = useLogin(
    (data) => {
      localStorage.setItem("token", data.token);

      const payload = JSON.parse(atob(data.token.split(".")[1]));

      if (payload.role === "admin") {
        navigate("/admindashboard");
      } else {
        alert("Access denied — admin credentials required");
      }
    },
    (errorMsg) => alert(errorMsg)
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    loginMutation.mutate({
      email,
      password,
      endpoint: "/auth/admin/login",
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen hero-bg">
      <div className="glass-card max-w-md w-full">
        <h2 className="heading text-center">Admin Portal</h2>
        <p className="subheading text-center">Login with admin credentials 🔑</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Admin Email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn-primary w-full" disabled={loginMutation.isLoading}>
            {loginMutation.isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
