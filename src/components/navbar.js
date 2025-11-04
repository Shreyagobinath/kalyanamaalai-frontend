import React, { useState } from "react";
import { Menu, X } from "lucide-react"; 
import { useNavigate } from "react-router-dom";

const Navbar = ({ user }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Brand */}
        <h1
          onClick={() => navigate("/dashboard")}
          className="text-2xl font-bold text-indigo-600 cursor-pointer"
        >
          💍 Matrimony Portal
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <p className="text-gray-700 font-medium">
            Hi, <span className="text-indigo-600">{user?.name || user?.email}</span>
          </p>
          <button
            onClick={handleLogout}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Logout
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-200 py-3 px-5">
          <p className="text-gray-700 mb-2">
            Hi, <span className="text-indigo-600">{user?.name || user?.email}</span>
          </p>
          <button
            onClick={handleLogout}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
