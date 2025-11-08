// src/hooks/useforms.js
import { useMutation } from "@tanstack/react-query";
import API from "../api/axios"; // Axios instance with baseURL

export const useSubmitForm = (onSuccess, onError) => {
  return useMutation({
    mutationFn: async (formData) => {
      // Remove token check for unauthenticated submission

      // Use FormData for all fields
      const dataToSend = new FormData();

      // Append all fields including empty strings
      const fields = [
        "full_name_en","full_name_ta","gender","dob",
        "religion_en","religion_ta","caste_en","caste_ta",
        "gothram_en","gothram_ta","star_en","star_ta",
        "raasi_en","raasi_ta","height","weight",
        "complexion_en","complexion_ta",
        "education_en","education_ta","occupation_en","occupation_ta",
        "income_en","income_ta",
        "address_en","address_ta","phone","email",
        "father_name_en","father_name_ta",
        "mother_name_en","mother_name_ta",
        "siblings","marital_status",
        "preferred_age_range","preferred_religion",
        "preferred_occupation","preferred_location"
      ];

      fields.forEach((key) => {
        // Append all fields to FormData, use empty string if not provided
        dataToSend.append(key, formData[key] || "");
      });

      // Send request without Authorization header
      const res = await API.post("/user/forms", dataToSend, {
        headers: {
          "Content-Type": "multipart/form-data", // needed for FormData
        },
      });

      return res.data;
    },
    onSuccess,
    onError: (error) => {
      const msg = error.response?.data?.message || "Submission failed";
      if (onError) onError(msg);
    },
  });
};
