import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layouts/navbar";
import Footer from "../components/layouts/footer";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar userType="guest" />

      <main className="flex-grow flex flex-col items-center justify-center text-center px-6">
        <div className="bg-white/80 backdrop-blur-md shadow-lg p-10 rounded-3xl max-w-2xl">
          <h1 className="text-4xl font-extrabold text-indigo-700 mb-3">
            Welcome to Kalyanamalai 💍
          </h1>
          <p className="text-gray-600 mb-8">
            Find your perfect match with love, trust, and technology.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              to="/userlogin"
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              User Login
            </Link>
            <Link
              to="/adminlogin"
              className="bg-pink-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-pink-700 transition"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
