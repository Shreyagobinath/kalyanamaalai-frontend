import { useMutation } from "@tanstack/react-query";
import API from "../api/axios"; // ✅ default import

export const useLogin = (onSuccess, onError) => {
  return useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await API.post("/auth/login", { email, password });
      return res.data;
    },
    onSuccess,
    onError: (error) => {
      const msg = error.response?.data?.message || "Login failed";
      if (onError) onError(msg);
    },
  });
};
