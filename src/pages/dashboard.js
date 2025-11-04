import React, { useEffect, useState } from "react";
import API from "../api/axios";

const AdminDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/admin/pending-users");
        setPendingUsers(res.data);
      } catch (err) {
        alert("Error fetching pending users");
      }
    };
    fetchUsers();
  }, []);

  const handleApprove = async (id) => {
    try {
      await API.put(`/admin/approve/${id}`);
      setPendingUsers(pendingUsers.filter((u) => u.id !== id));
      alert("✅ User approved successfully!");
    } catch (err) {
      alert("Error approving user");
    }
  };

  const handleReject = async (id) => {
    try {
      await API.put(`/admin/reject/${id}`);
      setPendingUsers(pendingUsers.filter((u) => u.id !== id));
      alert("❌ User rejected.");
    } catch (err) {
      alert("Error rejecting user");
    }
  };

  const filteredUsers = pendingUsers.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-indigo-50">
      {/* 🔹 Top Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-700">Admin Dashboard</h1>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Logout
        </button>
      </nav>

      {/* 🔹 Page Content */}
      <main className="flex-grow p-6">
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
            <h2 className="text-xl font-semibold text-gray-700">
              Pending User Approvals
            </h2>
            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-72 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {filteredUsers.length === 0 ? (
            <p className="text-center text-gray-500">No pending users found.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="border border-gray-200 shadow-sm rounded-xl p-5 bg-white hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {user.name}
                    </h3>
                    <span className="text-sm bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                      Pending
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    <strong>Email:</strong> {user.email}
                  </p>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => handleApprove(user.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(user.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 🔹 Footer */}
      <footer className="text-center text-gray-500 py-4 border-t mt-4">
        © {new Date().getFullYear()} Matrimony Admin Panel
      </footer>
    </div>
  );
};

export default AdminDashboard;
