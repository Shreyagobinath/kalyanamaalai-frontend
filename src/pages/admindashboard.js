import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {jwtDecode} from "jwt-decode";
import API from "../api/axios";
import Navbar from "../components/layouts/navbar";
import Footer from "../components/layouts/footer";

const fetchAdminData = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const decoded = jwtDecode(token);
  if (decoded.role !== "admin") throw new Error("Unauthorized access");

  const res = await API.get("/admin/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: fetchAdminData,
    retry: false,
    onError: (err) => {
      alert(err.message);
      localStorage.removeItem("token");
      navigate("/adminlogin");
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/adminlogin");
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen text-xl text-pink-600 font-semibold">
        Loading Admin Dashboard...
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center h-screen text-red-600 font-semibold">
        {error.message || "Failed to load admin data"}
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-pink-50">
      <Navbar userType="admin" onLogout={handleLogout} />

      <main className="flex-grow p-6">
        <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-md shadow-lg rounded-3xl p-8">
          <h2 className="text-3xl font-bold text-pink-700 mb-4">
            Admin Dashboard 👩‍💻
          </h2>
          <p className="text-gray-600 mb-6">
            Manage users, monitor activity, and keep the community safe.
          </p>

          {/* Admin User Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow rounded-lg">
              <thead className="bg-pink-100 text-pink-700 text-sm">
                <tr>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.users?.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-pink-50 transition border-b"
                  >
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {user.isActive ? "Active" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
