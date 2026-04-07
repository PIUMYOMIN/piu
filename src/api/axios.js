// src/api/axios.js
import axios from 'axios';
import config from '../config';

// Vite uses import.meta.env instead of process.env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v2';

const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // Set to true if you need cookies
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Use navigate from react-router instead of window.location for better UX
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;