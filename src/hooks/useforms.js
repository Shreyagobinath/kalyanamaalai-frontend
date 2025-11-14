// src/hooks/useForms.js
import { useMutation } from "@tanstack/react-query";
import API from "../api/axios";

export const useSubmitForm = (onSuccess, onError) => {
  return useMutation({
    mutationFn: async (formData) => {
      const token = localStorage.getItem("token");

      // Post the FormData object directly (do not convert to JSON)
      const res = await API.post("/user/forms", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      return res.data;
    },

    onSuccess,
    onError: (error) => {
      const msg = error.response?.data?.message || "Form submission failed";
      if (onError) onError(msg);
    },
  });
};
