import React from "react";
import { useNavigate } from "react-router-dom";

const HomeUI = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-indigo-700 mb-8">
        Matrimony Portal
      </h1>
      <div className="flex flex-col sm:flex-row gap-6">
        <button
          onClick={() => navigate("/login")}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-indigo-700 transition"
        >
          User Login
        </button>
        <button
          onClick={() => navigate("/adminlogin")}
          className="bg-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-pink-700 transition"
        >
          Admin Login
        </button>
      </div>
    </div>
  );
};

export default HomeUI;
