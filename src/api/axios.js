// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  // withCredentials: false is the default, so we don't need to specify it
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add response interceptor for handling auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("🔐 Unauthorized, clearing auth data");
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;