import React from "react";
import { useNavigate } from "react-router-dom";
import one from "../assets/one.jpg"; 

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Image */}
      <div className="md:w-1/2 w-full">
        <img
          src={one}
          alt="Wedding"
          className="h-90 w-full object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Right Side - Content */}
      <div className="md:w-1/2 w-full flex flex-col items-center justify-center bg-gradient-to-r from-indigo-50 to-indigo-100 p-8">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-700 mb-12 text-center">
          Welcome to KalyanaMalai 💍
        </h1>

        <div className="bg-white border border-gray-300 shadow-xl p-10 flex flex-col items-center space-y-6 w-80 rounded-none">
          <h2 className="text-2xl font-semibold text-gray-800">Get Started</h2>

          <button
            onClick={() => navigate("/login")}
            className="w-full px-6 py-3 bg-indigo-600 text-white font-medium rounded-none hover:bg-indigo-700 transition duration-300"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="w-full px-6 py-3 border border-indigo-600 text-indigo-600 font-medium rounded-none hover:bg-indigo-50 transition duration-300"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
