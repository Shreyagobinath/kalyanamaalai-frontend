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
  const [filter, setFilter] = useState("all");

  // Store selected user for modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch user full details for modal
  const handleViewUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await API.get(`/admin/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedUser(data);
      setShowModal(true);
    } catch (err) {
      console.error("Error loading user:", err);
    }
  };

  // Fetch notifications for dashboard
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await API.get("/admin/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(data || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "approved") return n.form_status?.toLowerCase() === "approved";
    if (filter === "rejected") return n.form_status?.toLowerCase() === "rejected";
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
        {/* Top Bar */}
        {/* Top Bar */}
<div className="flex justify-end items-center p-4 bg-white shadow-md border-b relative">
  <button
    onClick={handleLogout}
    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
  >
    Logout
  </button>
</div>


        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === "dashboard" && (
            <div>
              <h1 className="text-3xl font-bold mb-6 text-indigo-600">Welcome, Admin</h1>

              {/* Filter Tabs */}
              <div className="flex space-x-4 mb-6">
                {["all", "approved", "rejected"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-4 py-2 rounded-md font-medium capitalize transition ${
                      filter === tab
                        ? "bg-indigo-600 text-white"
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
              ) : filteredNotifications.length ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredNotifications.map((note, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-5 shadow border">
                      <h2 className="font-semibold text-lg">{note.user_name}</h2>
                      <p className="text-sm"><strong>Email:</strong> {note.user_email}</p>
                      <p className="text-sm">
                        <strong>Form Submitted At:</strong> {new Date(note.form_submitted_at).toLocaleString()}
                      </p>
                      <p className="text-sm">
                        <strong>Status:</strong>{" "}
                        <span
                          className={`font-semibold ${
                            note.form_status === "Approved"
                              ? "text-green-600"
                              : note.form_status === "Rejected"
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {note.form_status}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">No data found</p>
              )}
            </div>
          )}

          {activeTab === "pendingUsers" && <AdminForms onViewUser={handleViewUser} />}
          {activeTab === "allUsers" && <AllUsers onViewUser={handleViewUser} />}
          {activeTab === "pendingConnections" && (
            <PendingConnections onViewUser={handleViewUser} />
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-indigo-600">User Details</h2>

            {Object.keys(selectedUser).length === 0 ? (
              <p>No details available.</p>
            ) : (
              Object.entries(selectedUser).map(([key, value]) => (
                <p key={key} className="text-sm mb-1">
                  <strong>{key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}:</strong>{" "}
                  {value || "—"}
                </p>
              ))
            )}

            <div className="mt-5 text-right">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
