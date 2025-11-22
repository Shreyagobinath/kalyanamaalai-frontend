// src/api/axios.js
import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // e.g., http://localhost:5000/api/v1
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: (status) => {
    // Accept 2xx and 204 explicitly
    return (status >= 200 && status < 300) || status === 204;
  },
});

// Request interceptor to attach token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 204 gracefully
API.interceptors.response.use(
  (response) => {
    // If 204 No Content, return empty object instead of undefined
    if (response.status === 204) {
      return { data: {} };
    }
    return response;
  },
  (error) => {
    // Log any errors for debugging
    console.error("API Error:", error.response || error);
    return Promise.reject(error);
  }
);

export default API;

