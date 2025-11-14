import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../api/axios";
import { Eye } from "lucide-react"; // 👁 Eye icon

const fetchPendingConnections = async () => {
  const { data } = await API.get("/admin/connections/pending");
  return data || [];
};

const approveConnection = async (id) => {
  const { data } = await API.put(`/admin/connections/approve/${id}`);
  return data;
};

const rejectConnection = async (id) => {
  const { data } = await API.put(`/admin/connections/reject/${id}`);
  return data;
};

const PendingConnections = () => {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const {
    data: connections = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["adminConnections"],
    queryFn: fetchPendingConnections,
    staleTime: 5000,
  });

  const approveMutation = useMutation({
    mutationFn: approveConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminConnections"] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminConnections"] });
    },
  });

  const handleViewDetails = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/admin/forms/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedUser(res.data);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  if (isLoading)
    return <p className="text-center py-8">Loading pending connections...</p>;
  if (isError)
    return (
      <p className="text-red-600 text-center">
        Error loading connections: {error.message}
      </p>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-[70vh]">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Pending Connections
      </h2>

      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-indigo-50 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left font-medium border-b">No</th>
              <th className="py-3 px-4 text-left font-medium border-b">
                Sender Name
              </th>
              <th className="py-3 px-4 text-left font-medium border-b">
                Sender Email
              </th>
              <th className="py-3 px-4 text-left font-medium border-b">
                Receiver Name
              </th>
              <th className="py-3 px-4 text-left font-medium border-b">
                Receiver Email
              </th>
              <th className="py-3 px-4 text-center font-medium border-b">
                Status
              </th>
              <th className="py-3 px-4 text-center font-medium border-b">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {connections.length === 0 ? (
              <tr>
                <td colSpan="9" className="py-8 text-center text-gray-500">
                  No pending connections found.
                </td>
              </tr>
            ) : (
              connections.map((conn, i) => (
                <tr
                  key={conn.id}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="py-3 px-4 border-b">{i + 1}</td>
                  <td className="py-3 px-4 border-b-0 font-medium text-gray-800 flex items-center gap-2">
                    {/* 👁 Eye button left to name */}
                    <button
                      onClick={() => handleViewDetails(conn.sender_id)}
                      className="p-0  hover:bg-gray-200 text-gray-600 rounded-sm outline-none border-none align-middle"
                      title="View User Details"
                    >
                      <Eye size={16} />
                    </button>
                    <span>{conn.sender_name || "—"}</span>
                  </td>
                  <td className="py-3 px-4 border-b text-gray-700">
                    {conn.sender_email || "—"}
                  </td>
                  <td className="py-3 px-4 border-b font-medium text-gray-800">
                    {conn.receiver_name || "—"}
                  </td>
                  <td className="py-3 px-4 border-b text-gray-700">
                    {conn.receiver_email || "—"}
                  </td>
                  <td className="py-3 px-4 border-b text-center">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        conn.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : conn.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {conn.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b text-center space-x-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => approveMutation.mutate(conn.id)}
                        className="flex items-center px-1 py-1 text-white rounded-lg text-sm w-28"
                      >
                        ✅
                      </button>
                      <button
                        onClick={() => rejectMutation.mutate(conn.id)}
                        className="flex items- center px-1 py-1 text-white rounded-lg text-sm w-28"
                      >
                        ❌
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Modal for user details */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              User Details
            </h3>
            <div className="space-y-2 text-sm">
              {Object.entries(selectedUser).map(([key, value]) => (
                <p key={key} className="text-gray-700">
                  <strong className="capitalize">{key.replace(/_/g, " ")}:</strong>{" "}
                  {value || "—"}
                </p>
              ))}
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
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

export default PendingConnections;
