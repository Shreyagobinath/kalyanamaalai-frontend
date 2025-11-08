import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layouts/navbar";
import Footer from "../components/layouts/footer";

const UserDashboard = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  // ✅ Protect route: redirect if no token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/userlogin");
      return;
    }

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, [navigate]);

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/userlogin");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-blue-100">
      <Navbar user={user} userType="user" onLogout={handleLogout} />

      <main className="flex-grow flex flex-col items-center justify-center p-8">
        <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-lg text-center w-full max-w-lg">
          <h2 className="text-3xl font-semibold text-indigo-700 mb-3">
            Welcome, {user.name || "User"} 👋
          </h2>
          <p className="text-gray-600 mb-6">
            Explore your matches, update your profile, and connect with people who share your dreams.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/editprofiles")}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
            >
              Edit Profile
            </button>
            <button
              onClick={() => navigate("/forms")}
              className="px-5 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
            >
              Submit Form
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="mt-6 px-5 py-2 border border-gray-400 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;
