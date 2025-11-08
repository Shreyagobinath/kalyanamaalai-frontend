import { useQuery } from "@tanstack/react-query";
import API from "../api/axios";

export const useAdminUsers = (token) => {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await API.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token,
  });
};
