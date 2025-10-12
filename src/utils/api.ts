import axios from "axios";
import { BASE_URL } from "./constant";

// Create Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===== REQUEST INTERCEPTOR =====
// Automatically attach token if exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or use cookies
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ===== RESPONSE INTERCEPTOR =====
// Handle global errors or logging
api.interceptors.response.use(
  (response) => response, // return response if success
  (error) => {
    if (error.response) {
      // Server responded with a status
      console.error("API Error:", error.response.status, error.response.data);
      if (error.response.status === 401) {
        // Unauthorized: redirect to login or logout
        console.log("Unauthorized! Redirecting...");
      }
    } else if (error.request) {
      console.error("No response from server:", error.request);
    } else {
      console.error("Axios Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
