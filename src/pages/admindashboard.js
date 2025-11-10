// src/pages/AdminDashboard.js
import React, { useState } from "react";
import { FaUsers, FaClipboardList, FaHome } from "react-icons/fa";
import AdminForms from "./adminforms"; // Pending forms page
import AllUsers from "./allusers"; // You can create this component to list all users
//import Profile from "./profile"; // Optional profile component

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

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
            <FaClipboardList /> Pending Connections
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
        <div className="flex justify-end items-center p-4 bg-white shadow-md border-b">
          <div className="relative">
            <img
              src="https://i.pravatar.cc/40"
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer"
            />
            {/* Optional dropdown menu */}
            {/* <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded">
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Profile</button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
            </div> */}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === "dashboard" && (
            <div>
              <h1 className="text-3xl font-bold mb-4 text-indigo-600">
                Welcome, Admin
              </h1>
              <p>Select a menu option to manage users and forms.</p>
            </div>
          )}
          {activeTab === "pendingUsers" && <AdminForms />}
          {activeTab === "allUsers" && <AllUsers />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
