// src/pages/UserDashboard.jsx
import React, { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Heart,
  LogOut,
  Bell,
  User as UserIcon, // ✅ Default icon
} from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../api/axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// 🔹 Fetch notifications
const fetchNotifications = async () => {
  const res = await API.get("/user/notifications");
  return res.data;
};

// 🔹 Fetch approved users
const fetchApprovedUsers = async () => {
  const res = await API.get("/user/approved");
  return res.data;
};

// 🔹 Mark notifications as read
const markReadNotifications = async () => {
  const res = await API.put("/user/notifications/mark-read");
  return res.data;
};

// 🔹 Fetch user profile (for uploaded profile photo)
const fetchUserProfile = async () => {
  const token = localStorage.getItem("token");
  const res = await API.get("/user/account-details", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const UserDashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ✅ Fetch approved users
  const { data: approvedUsers = [], isLoading } = useQuery({
    queryKey: ["approvedUsers"],
    queryFn: fetchApprovedUsers,
  });

  // ✅ Fetch notifications
  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  });

  // ✅ Fetch profile photo from backend
  useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    onSuccess: (data) => {
      if (data?.profile_photo) {
        setProfilePhoto(`${BASE_URL}/uploads/profile_photos/${data.profile_photo}`);
      } else {
        setProfilePhoto(null); // No photo → use default icon
      }
    },
    onError: () => {
      setProfilePhoto(null);
    },
  });

  // ✅ Mark notifications as read
  const markReadMutation = useMutation({
    mutationFn: markReadNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  // ✅ Send connection request
  const connectionMutation = useMutation({
    mutationFn: (receiverId) => API.post("/user/connect", { receiverId }),
    onSuccess: () => {
      alert("Request sent to admin for approval!");
      queryClient.invalidateQueries(["approvedUsers"]);
    },
    onError: (error) => {
      alert("Failed to send request: " + error.message);
    },
  });

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ✅ Toggle notifications dropdown
  const handleNotifToggle = async () => {
    const newState = !notifOpen;
    setNotifOpen(newState);
    setDropdownOpen(false);

    if (newState && notifications.some((n) => !Number(n.is_read))) {
      try {
        await markReadMutation.mutateAsync();
      } catch (err) {
        console.error("Failed to mark notifications read:", err);
      }
    }
  };

  const unreadCount = notifications.filter((n) => !Number(n.is_read)).length;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col fixed h-full">
        <div className="px-6 py-6 text-2xl font-bold text-indigo-600 border-b">
          User Panel
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link
            to="/user/dashboard"
            className="flex items-center p-3 rounded-lg hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition"
          >
            <LayoutDashboard className="mr-3" size={20} />
            Dashboard
          </Link>

          <Link
            to="/user/search"
            className="flex items-center p-3 rounded-lg hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition"
          >
            <Heart className="mr-3" size={20} />
            Search Matches
          </Link>
        </nav>
      </aside>

      {/* Main Section */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center relative">
          <h1 className="text-xl font-semibold text-gray-800">
            Welcome to Your Dashboard
          </h1>

          <div className="flex items-center space-x-4 relative">
            {/* 🔔 Notifications */}
            <div className="relative">
              <button
                onClick={handleNotifToggle}
                className="relative bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition"
              >
                <Bell className="text-gray-600" size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border max-h-80 overflow-y-auto z-50">
                  <div className="p-3 border-b text-gray-800 font-semibold">
                    Notifications
                  </div>
                  {notifications.length === 0 ? (
                    <p className="p-3 text-gray-500 text-sm">
                      No new notifications
                    </p>
                  ) : (
                    <ul className="divide-y divide-gray-100">
                      {notifications.map((note,idx) => (
                        <li key={`${note.id}-${idx}`} className="p-3 hover:bg-gray-50">
                          <p className="text-gray-700 text-sm">{note.message}</p>
                          <span className="text-xs text-gray-400">
                            {new Date(note.created_at).toLocaleString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* 👤 Profile (Uploaded or Default) */}
            <div className="relative">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="w-10 h-10 rounded-full cursor-pointer border-2 border-indigo-500 object-cover"
                  onClick={() => {
                    setDropdownOpen(!dropdownOpen);
                    setNotifOpen(false);
                  }}
                />
              ) : (
                <button
                  onClick={() => {
                    setDropdownOpen(!dropdownOpen);
                    setNotifOpen(false);
                  }}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border-2 border-indigo-500"
                >
                  <UserIcon className="text-gray-500" size={22} />
                </button>
              )}

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50">
                  <Link
                    to="/user/form"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <FileText className="mr-2" size={16} />
                    Fill Form
                  </Link>

                  <hr className="my-1" />

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                  >
                    <LogOut className="mr-2" size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Approved Members</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : approvedUsers.length === 0 ? (
            <p>No approved users available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {approvedUsers.map((user,idx) => (
                <div
                  key={`${user.id}-${idx}`}
                  className="bg-gradient-to-r from-indigo-300 to-blue-100 shadow p-4 flex flex-col justify-between rounded-xl"
                >
                  <div>
                    <h3 className="font-bold text-indigo-700 text-lg">
                      {user.name}
                    </h3>
                    <p className="text-gray-600">Age: {user.age}</p>
                    <p className="text-gray-600">Location: {user.city}</p>
                  </div>
                  <button
                    onClick={() => connectionMutation.mutate(user.id)}
                    className="mt-3 bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition"
                  >
                    Send Connection Request
                  </button>
                </div>
              ))}
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
