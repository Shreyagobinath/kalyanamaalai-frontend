// src/api/axios.js
import axios from "axios";

// Create a reusable axios instance
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export default API; // ✅ Make sure to export default
