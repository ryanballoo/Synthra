// frontend/src/services/api.js
import axios from "axios";

// Base URL for your backend API
const API_BASE = "http://127.0.0.1:8000/api";

// Axios instance
export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===== Auth endpoints =====
export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

// ===== Content endpoints =====
export const generateContent = async (payload) => {
  const response = await api.post("/content/generate", payload);
  return response.data;
};

// ===== Marketing endpoints =====
export const getTrends = async (companyData) => {
  const response = await api.post("/marketing/trends", companyData);
  return response.data;
};

export const getSchedule = async (contentData) => {
  const response = await api.post("/marketing/schedule", contentData);
  return response.data;
};

// ===== ML endpoints =====
export const analyzeBehavior = async (userData) => {
  const response = await api.post("/ml/analyze", userData);
  return response.data;
};

export default api;