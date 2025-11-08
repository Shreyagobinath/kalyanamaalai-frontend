import { useQuery } from "@tanstack/react-query";
import API from "../api/axios";

export const useUsers = (token) => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await API.get("/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token,
  });
};
