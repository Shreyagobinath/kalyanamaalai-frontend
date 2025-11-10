import React, { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Heart,
  Edit3,
  User,
  LogOut,
  Trash2,
  Bell,
} from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../api/axios";

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

// 🔹 Send connection request
const sendConnectionRequest = async (receiverId) => {
  const res = await API.post("/user/connect", { receiverId });
  return res.data;
};

// 🔹 Mark notifications as read
const markReadNotifications = async () => {
  const res = await API.put("/user/notifications/mark-read");
  return res.data;
};

const UserDashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
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

  // ✅ Mutation to mark notifications as read
  const markReadMutation = useMutation({
    mutationFn: markReadNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  // ✅ Mutation for connection requests
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

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ✅ Handle notification dropdown open/close
  const handleNotifToggle = async () => {
    const newState = !notifOpen;
    setNotifOpen(newState);
    setDropdownOpen(false);

    // Mark all unread notifications as read only when opening
    if (newState && notifications.some((n) => !Number(n.read))) {
      try {
        await markReadMutation.mutateAsync();
      } catch (err) {
        console.error("Failed to mark notifications read:", err);
      }
    }
  };

  // ✅ Unread count for red badge
  const unreadCount = notifications.filter((n) => !Number(n.read)).length;

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

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center relative">
          <h1 className="text-xl font-semibold text-gray-800">
            Welcome to Your Dashboard
          </h1>

          <div className="flex items-center space-x-4 relative">
            {/* 🔔 Notification Icon */}
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

              {/* Dropdown */}
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
                      {notifications.map((note, index) => (
                        <li
                          key={`${note.id}-${index}`}
                          className="p-3 hover:bg-gray-50"
                        >
                          <p className="text-gray-700 text-sm">
                            {note.message}
                          </p>
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

            {/* 👤 Profile Dropdown */}
            <div className="relative">
              <button
                className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition"
                onClick={() => {
                  setDropdownOpen(!dropdownOpen);
                  setNotifOpen(false);
                }}
              >
                <User className="text-gray-600" size={20} />
                <span className="text-gray-700 font-medium">Profile</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50">
                  <div className="px-4 py-2 text-sm text-gray-500 border-b">
                    Profile Actions
                  </div>

                  <Link
                    to="/user/form"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <FileText className="inline-block mr-2" size={16} />
                    Fill Form
                  </Link>

                  <Link
                    to="/user/edit-profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <Edit3 className="inline-block mr-2" size={16} />
                    Edit Profile
                  </Link>

                  <hr />

                  <div className="px-4 py-2 text-sm text-gray-500 border-b">
                    Account
                  </div>

                  <Link
                    to="/user/update-profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Update Profile
                  </Link>

                  <button
                    onClick={() => navigate("/user/delete-profile")}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="inline-block mr-2" size={16} />
                    Delete Profile
                  </button>

                  <hr />

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="inline-block mr-2" size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Approved Members</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : approvedUsers.length === 0 ? (
            <p>No approved users available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {approvedUsers.map((user, index) => (
                <div
                  key={`${user.id}-${index}`}
                  className="bg-gradient-to-r from-indigo-300 to-blue-100 shadow p-4 flex flex-col justify-between"
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
