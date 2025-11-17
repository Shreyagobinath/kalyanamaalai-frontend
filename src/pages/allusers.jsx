import React, { useEffect, useState } from "react";
import API from "../api/axios";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all, active, inactive

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on tab
  const filteredUsers = users.filter((user) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return user.status === "active";
    if (activeTab === "inactive") return user.status === "inactive";
    return true;
  });

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading users...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">

      {/* Tabs */}
      <div className="flex space-x-4 bg-gray-100 px-6 py-3 border-b border-gray-200">
        {["all", "active", "inactive"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1 rounded-sm font-medium transition ${
              activeTab === tab
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab === "all" ? "All" : tab === "active" ? "Active" : "Inactive"}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm text-gray-700">
          <thead className="bg-indigo-100 text-indigo-900">
            <tr>
              <th className="py-3 px-4 text-left font-medium border-b">No</th>
              <th className="py-3 px-4 text-left font-medium border-b">Name</th>
              <th className="py-3 px-4 text-left font-medium border-b">Email</th>
              <th className="py-3 px-4 text-left font-medium border-b">Gender</th>
              {/* Status removed */}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4 border-b">{index + 1}</td>
                  <td className="py-3 px-4 border-b font-medium">{user.name}</td>
                  <td className="py-3 px-4 border-b">{user.email}</td>
                  <td className="py-3 px-4 border-b capitalize">
                    {user.gender || "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="py-6 text-center text-gray-500 italic border-b"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
