import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../api/axios";

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

  // ✅ Fetch data using TanStack Query v5 syntax
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
              <th className="py-3 px-4 text-left font-medium border-b">Sender Name</th>
              <th className="py-3 px-4 text-left font-medium border-b">Sender Email</th>
              <th className="py-3 px-4 text-left font-medium border-b">Sender Gender</th>
              <th className="py-3 px-4 text-left font-medium border-b">Receiver Name</th>
              <th className="py-3 px-4 text-left font-medium border-b">Receiver Email</th>
              <th className="py-3 px-4 text-left font-medium border-b">Receiver Gender</th>
              <th className="py-3 px-4 text-center font-medium border-b">Status</th>
              <th className="py-3 px-4 text-center font-medium border-b">Actions</th>
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
                  <td className="py-3 px-4 border-b font-medium text-gray-800">
                    {conn.sender_name || "—"}
                  </td>
                  <td className="py-3 px-4 border-b text-gray-700">
                    {conn.sender_email || "—"}
                  </td>
                  <td className="py-3 px-4 border-b text-gray-700 capitalize">
                    {conn.sender_gender || "—"}
                  </td>
                  <td className="py-3 px-4 border-b font-medium text-gray-800">
                    {conn.receiver_name || "—"}
                  </td>
                  <td className="py-3 px-4 border-b text-gray-700">
                    {conn.receiver_email || "—"}
                  </td>
                  <td className="py-3 px-4 border-b text-gray-700 capitalize">
                    {conn.receiver_gender || "—"}
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
                    <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={() => approveMutation.mutate(conn.id)}
                      className="px-3 py-0 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm w-28"
                    >
                      Approve
                    </button><br></br>
                    <button
                      onClick={() => rejectMutation.mutate(conn.id)}
                      className="px-3 py-0 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-sm w-28 "
                    >
                      Reject
                    </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingConnections;
