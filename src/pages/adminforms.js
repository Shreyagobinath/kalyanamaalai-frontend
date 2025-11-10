import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../api/axios";

const fetchForms = async () => {
  const res = await API.get("/admin/forms/pending");
  return res.data;
};

const approveForm =async(id)=>{
    const res = await API.put(`/admin/forms/approve/${id}`);
    return res.data;
};

const  rejectForm = async (id)=>{
    const res=await API.put(`/admin/forms/reject/${id}`);
    return res.data;
}

const AdminForms = () => {
  const queryClient = useQueryClient();
  const { data, isLoading,error} = useQuery({
    queryKey:["adminForms"],
    queryFn: fetchForms,
  });

  const approveMutation = useMutation({
    mutationFn: approveForm,
    onSuccess: ()=>{
        queryClient.invalidateQueries({queryKey: ["adminForms"]});
    },
});

 
  const rejectMutation = useMutation({
    mutationFn: rejectForm,
    onSuccess: ()=>{
        queryClient.invalidateQueries({queryKey: ["adminForms"]});
    },
});

  if (isLoading) return <p className="text-center mt-10">Loading forms...</p>;
  if(error) return <p>Error fetching forms</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6 text-indigo-600">Pending Forms</h1>
      <table className="w-full border border-gray-300">
        <thead className="bg-indigo-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Gender</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((form) => (
            <tr key={form.id}>
              <td className="border p-2">{form.full_name_en}</td>
              <td className="border p-2">{form.email}</td>
              <td className="border p-2">{form.gender}</td>
              <td className="border p-2">{form.status}</td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => approveMutation.mutate(form.id)}
                  className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => rejectMutation.mutate(form.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminForms;
