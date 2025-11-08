import { useMutation } from "@tanstack/react-query";
import API from "../api/axios";

export const useRegister = (onSuccess, onError) => {
  return useMutation({
    mutationFn: async ({ name, email, password }) => {
      const res = await API.post("/auth/register", { name, email, password });
      return res.data;
    },
    onSuccess,
    onError,
  });
};
