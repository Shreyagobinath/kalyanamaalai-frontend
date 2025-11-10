// src/hooks/useForms.js
import { useMutation } from "@tanstack/react-query";
import API from "../api/axios"; // Axios instance with baseURL

export const useSubmitForm = (onSuccess, onError) => {
  return useMutation({
    mutationFn: async (formData) => {
      // Convert formData to send all fields
      const dataToSend = { ...formData, status: "Pending" };

      // Send POST request to backend (no auth token required)
      const res = await API.post("/user/forms", dataToSend, {
        headers: {
          "Content-Type": "application/json",
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
