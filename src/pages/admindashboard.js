// src/pages/AdminDashboard.js
import React, { useEffect, useState } from "react";
import { FaUsers, FaClipboardList, FaHome } from "react-icons/fa";
import AdminForms from "./adminforms";
import AllUsers from "./allusers";
import PendingConnections from "./pendingconnections";
import API from "../api/axios";

const AdminDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch recent notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/admin/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // redirect to login
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-600 text-white flex flex-col">
        <div className="text-2xl font-bold p-6 border-b border-indigo-500">
          Admin Panel
        </div>

        <nav className="flex-1 px-2 py-4 space-y-2">
          <button
            className={`flex items-center gap-3 px-4 py-2 rounded hover:bg-indigo-500 w-full text-left ${
              activeTab === "dashboard" ? "bg-indigo-500" : ""
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <FaHome /> Dashboard
          </button>
          <button
            className={`flex items-center gap-3 px-4 py-2 rounded hover:bg-indigo-500 w-full text-left ${
              activeTab === "pendingUsers" ? "bg-indigo-500" : ""
            }`}
            onClick={() => setActiveTab("pendingUsers")}
          >
            <FaClipboardList /> Pending Forms
          </button>
          <button
            className={`flex items-center gap-3 px-4 py-2 rounded hover:bg-indigo-500 w-full text-left ${
              activeTab === "pendingConnections" ? "bg-indigo-500" : ""
            }`}
            onClick={() => setActiveTab("pendingConnections")}
          >
            <FaUsers /> Pending Connections
          </button>
          <button
            className={`flex items-center gap-3 px-4 py-2 rounded hover:bg-indigo-500 w-full text-left ${
              activeTab === "allUsers" ? "bg-indigo-500" : ""
            }`}
            onClick={() => setActiveTab("allUsers")}
          >
            <FaUsers /> All Users
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex justify-end items-center p-4 bg-white shadow-md border-b relative">
          {/* Profile photo */}
          <div className="relative">
            <img
              src="https://i.pravatar.cc/40"
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-indigo-500"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border border-gray-200 z-50">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => alert("Profile clicked")}
                >
                  Profile
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => alert("Account details clicked")}
                >
                  Account Details
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === "dashboard" && (
            <div>
              <h1 className="text-3xl font-bold mb-4 text-indigo-600">
                Welcome, Admin
              </h1>

              <h2 className="text-2xl font-semibold mb-3">Recent Notifications</h2>
              {loading ? (
                <p className="text-gray-500">Loading notifications...</p>
              ) : notifications.length > 0 ? (
                <ul className="space-y-2">
                  {notifications.map((notif, index) => (
                    <li
                      key={index}
                      className="bg-gray-100 p-3 rounded-md border-l-4 border-indigo-500"
                    >
                      <p className="text-gray-800">{notif.message}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(notif.created_at).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No recent notifications</p>
              )}
            </div>
          )}
          {activeTab === "pendingUsers" && <AdminForms />}
          {activeTab === "allUsers" && <AllUsers />}
          {activeTab === "pendingConnections" && <PendingConnections />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
