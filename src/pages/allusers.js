import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import API from "../api/axios";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // "all", "active", "inactive"

  // Fetch all users
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

  // Fetch single user details
  const fetchUserDetails = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/admin/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedUser(res.data);
      setModalOpen(true);
    } catch (err) {
      console.error("Error fetching user details:", err);
      setSelectedUser(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleViewDetails = (user) => {
    fetchUserDetails(user.id);
  };

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
            className={`px-4 py-2 rounded-md font-medium transition ${
              activeTab === tab
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab === "all"
              ? "All"
              : tab === "active"
              ? "Active"
              : "Inactive"}
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
              <th className="py-3 px-4 text-left font-medium border-b">Status</th>
              <th className="py-3 px-4 text-center font-medium border-b">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4 border-b">{index + 1}</td>
                  <td className="py-3 px-4 border-b font-medium">{user.name}</td>
                  <td className="py-3 px-4 border-b">{user.email}</td>
                  <td className="py-3 px-4 border-b capitalize">{user.gender || "N/A"}</td>
                  <td className="py-3 px-4 border-b capitalize">{user.status || "N/A"}</td>
                  <td className="py-3 px-4 border-b text-center">
                    <button
                      onClick={() => handleViewDetails(user)}
                      className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-500 italic border-b">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-11/12 md:w-96 max-h-[80vh] overflow-y-auto p-6 relative transform transition-all">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold text-indigo-600 mb-4 border-b pb-2">
              {selectedUser.name}'s Details
            </h3>

            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Full Name:</strong> {selectedUser.full_name_en || "N/A"}</p>
              <p><strong>Gender:</strong> {selectedUser.gender || "N/A"}</p>
              <p><strong>DOB:</strong> {selectedUser.dob || "N/A"}</p>
              <p><strong>Email:</strong> {selectedUser.email || "N/A"}</p>
              <p><strong>Status:</strong> {selectedUser.status || "N/A"}</p>
              <p>
                <strong>Created At:</strong>{" "}
                {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleString() : "N/A"}
              </p>
            </div>

            <div className="mt-5 text-right">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
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

export default AllUsers;
