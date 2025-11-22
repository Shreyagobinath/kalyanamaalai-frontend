// src/pages/AdminDashboard.js
import React, { useEffect, useState } from "react";
import { FaUsers, FaClipboardList, FaHome } from "react-icons/fa";
import AdminForms from "./adminforms";
import AllUsers from "./allusers";
import PendingConnections from "./pendingconnections";
import API from "../api/axios";
import { Loader2 } from "lucide-react";

const AdminDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [filter, setFilter] = useState("all"); // all | approved | rejected

  // Fetch recent user submissions
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

  // Filter notifications
  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "approved") return n.message?.toLowerCase().includes("approved");
    if (filter === "rejected") return n.message?.toLowerCase().includes("rejected");
    return true;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
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
          <div className="relative">
            <img
              src="https://i.pravatar.cc/40"
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-indigo-500"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />

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
          {/* Dashboard Section */}
          {activeTab === "dashboard" && (
            <div>
              <h1 className="text-3xl font-bold mb-4 text-indigo-600">
                Welcome, Admin
              </h1>

              <h2 className="text-2xl font-semibold mb-5">
                User Form Requests
              </h2>

              {/* Filter Tabs */}
              <div className="flex space-x-4 mb-6">
                {["all", "approved", "rejected"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-4 py-2 rounded-md font-medium capitalize transition ${
                      filter === tab
                        ? "bg-indigo-600 text-white shadow"
                        : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="animate-spin text-gray-500" size={32} />
                </div>
              ) : filteredNotifications.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredNotifications.map((note, idx) => (
                    <div
                      key={idx}
                      className="bg-white shadow-md hover:shadow-lg transition-all rounded-xl p-5 border border-gray-200"
                    >
                      <div className="flex flex-col space-y-2">
                        <h2 className="font-semibold text-gray-900 text-lg">
                          {note.title || "User Form Request"}
                        </h2>

                        <p
                          className={`text-sm font-medium ${
                            note.message?.includes("approved")
                              ? "text-green-600"
                              : note.message?.includes("rejected")
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {note.message || "Status: pending"}
                        </p>

                        <p className="text-sm text-gray-500">
                          {note.email || "No email"}
                        </p>

                        <p className="text-xs text-gray-400 italic">
                          {note.date
                            ? new Date(note.date).toLocaleString()
                            : "No date"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic text-center mt-10">
                  No {filter} requests found.
                </p>
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
