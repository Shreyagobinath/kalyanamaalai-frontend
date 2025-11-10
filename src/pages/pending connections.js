import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../api/axios";

const fetchConnections = async () => {
  const res = await API.get("/admin/connections/pending");
  return res.data;
};

const approveConnection =async(id)=>{
    const res = await API.put(`/admin/connections/approve/${id}`);
    return res.data;
};

const  rejectConnection = async (id)=>{
    const res=await API.put(`/admin/connections/reject/${id}`);
    return res.data;
}

const AdminConnections = () => {
  const queryClient = useQueryClient();
  const { data, isLoading,error} = useQuery({
    queryKey:["adminConnections"],
    queryFn: fetchConnections,
  });

  const approveMutation = useMutation({
    mutationFn: approveConnection,
    onSuccess: ()=>{
        queryClient.invalidateQueries({queryKey: ["adminConnections"]});
    },
});

 
  const rejectMutation = useMutation({
    mutationFn: rejectConnection,
    onSuccess: ()=>{
        queryClient.invalidateQueries({queryKey: ["adminConnections"]});
    },
});

  if (isLoading) return <p className="text-center mt-10">Loading connections...</p>;
  if(error) return <p>Error fetching connections</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6 text-indigo-600">Pending Connections</h1>
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
          {data.map((connection) => (
            <tr key={connection.id}>
              <td className="border p-2">{connection.full_name_en}</td>
              <td className="border p-2">{connection.email}</td>
              <td className="border p-2">{connection.gender}</td>
              <td className="border p-2">{connection.status}</td>
              <td className="border p-2 flex gap-2">
                <button
                  onClick={() => approveMutation.mutate(connection.id)}
                  className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => rejectMutation.mutate(connection.id)}
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
