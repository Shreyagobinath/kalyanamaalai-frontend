import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../api/axios";
import { Eye } from "lucide-react";

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
    onSuccess: () => queryClient.invalidateQueries(["adminConnections"]),
  });

  const rejectMutation = useMutation({
    mutationFn: rejectConnection,
    onSuccess: () => queryClient.invalidateQueries(["adminConnections"]),
  });

  const handleViewDetails = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/admin/user/${userId}`, {
        headers: {Authorization: `Bearer ${token} `},
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
          {/* -------------------------------- HEADERS -------------------------------- */}
          <thead className="bg-indigo-50 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left font-medium border-b">No</th>
              <th className="py-3 px-4 text-center font-medium border-b">
                View
              </th>
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

          {/* -------------------------------- BODY -------------------------------- */}
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

                  {/* 👁 View Button Column */}
                  <td className="py-3 px-4 border-b text-center">
                    <button
                      onClick={() => handleViewDetails(conn.sender_id)}
                      className="hover:bg-gray-200 p-2 rounded-md text-gray-600"
                      title="View User Details"
                    >
                      <Eye size={18} />
                    </button>
                  </td>

                  <td className="py-3 px-4 border-b font-medium text-gray-800">
                    {conn.sender_name || "—"}
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

                  {/* APPROVE / REJECT */}
                  <td className="py-3 px-4 border-b text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => approveMutation.mutate(conn.id)}
                        className="p-2 hover:bg-emerald-300 text-white rounded-lg"
                      >
                        ✅
                      </button>
                      <button
                        onClick={() => rejectMutation.mutate(conn.id)}
                        className="p-2 hover:bg-rose-300 text-white rounded-lg"
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

      {/* ------------------------------- MODAL ------------------------------- */}
      {showModal && selectedUser && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-3xl shadow-lg max-h-[90vh] overflow-y-auto">

      <h3 className="text-2xl font-semibold mb-4 text-gray-800">
        User Details
      </h3>

      {/* SECTION GENERATOR */}
      {[
        {
          title: "Personal Details",
          fields: [
            "full_name_en", "gender", "dob",
            "religion_en", "caste_en", "gothram_en",
            "star_en", "raasi_en", "height",
            "weight", "complexion_en",
          ],
        },
        {
          title: "Education & Occupation",
          fields: [
            "education_en", "occupation_en", "income_en",
          ],
        },
        {
          title: "Contact & Family Details",
          fields: [
            "address_en", "phone", "email",
            "father_name_en", "mother_name_en",
            "siblings", "location", "marital_status",
          ],
        },
        {
          title: "Partner Preferences",
          fields: [
            "preferred_age_range", "preferred_religion",
            "preferred_occupation", "preferred_location",
          ],
        },
      ].map((section, index) => (
        <div key={index} className="mb-5">
          <h4 className="font-semibold text-lg mb-3 text-gray-900 border-b pb-1">
            {section.title}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {section.fields.map((field) => (
              <p key={field}>
                <strong className="capitalize">
                  {field.replace(/_/g, " ")}:
                </strong>{" "}
                {selectedUser[field] || "—"}
              </p>
            ))}
          </div>
        </div>
      ))}

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