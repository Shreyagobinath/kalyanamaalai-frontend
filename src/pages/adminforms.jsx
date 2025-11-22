import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../api/axios";

// ==============================
// API CALLS
// ==============================
const fetchForms = async () => {
  const token = localStorage.getItem("token");
  const res = await API.get("/admin/forms/pending", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data || [];
};

const approveForm = async (formId) => {
  const token = localStorage.getItem("token");
  const res = await API.put(`/admin/forms/approve/${formId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const rejectForm = async (formId) => {
  const token = localStorage.getItem("token");
  const res = await API.put(`/admin/forms/reject/${formId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ==============================
// COMPONENT
// ==============================
const AdminForms = ({ onViewUser }) => {
  const queryClient = useQueryClient();

  const { data: forms = [], isLoading, error } = useQuery({
    queryKey: ["adminForms"],
    queryFn: fetchForms,
  });

  const approveMutation = useMutation({
    mutationFn: approveForm,
    onSuccess: () => queryClient.invalidateQueries(["adminForms"]),
  });

  const rejectMutation = useMutation({
    mutationFn: rejectForm,
    onSuccess: () => queryClient.invalidateQueries(["adminForms"]),
  });

  if (isLoading) return <p className="text-center mt-10 text-gray-600">Loading forms...</p>;
  if (error) return <p className="text-center text-red-500">{error.message}</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-white text-gray-800 py-4 px-6">
        <h1 className="text-2xl font-semibold">Pending User Forms</h1>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm text-gray-700">
          <thead className="bg-indigo-100 text-indigo-900">
            <tr>
              <th className="py-3 px-4 text-left font-medium border-b">No</th>
              <th className="py-3 px-4 text-left font-medium border-b">Full Name</th>
              <th className="py-3 px-4 text-left font-medium border-b">Email</th>
              <th className="py-3 px-4 text-left font-medium border-b">Gender</th>
              <th className="py-3 px-4 text-center font-medium border-b">Status</th>
              <th className="py-3 px-4 text-center font-medium border-b">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {forms.length > 0 ? (
              forms.map((form, index) => (
                <tr key={form.form_id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 border-b">{index + 1}</td>

                  <td
                    className="py-3 px-4 border-b font-medium cursor-pointer text-indigo-600"
                    onClick={() => onViewUser && onViewUser(form.user_id)}
                  >
                    {form.user_name || "N/A"}
                  </td>

                  <td className="py-3 px-4 border-b">{form.user_email || "N/A"}</td>
                  {/* <-- Make sure the key matches backend: `form.gender` */}
                  <td className="py-3 px-4 border-b capitalize">{form.gender || "N/A"}</td>

                  <td className="py-3 px-4 border-b text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        form.form_status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : form.form_status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : form.form_status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {form.form_status || "N/A"}
                    </span>
                  </td>

                  <td className="py-3 px-4 border-b text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => approveMutation.mutate(form.form_id)} title="Approve">
                        ✅
                      </button>
                      <button onClick={() => rejectMutation.mutate(form.form_id)} title="Reject">
                        ❌
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-500 italic border-b">
                  No pending forms found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminForms;

