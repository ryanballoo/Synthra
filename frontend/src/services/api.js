// frontend/src/services/api.js

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

async function fetchApi(endpoint, options = {}) {
  console.log(`Making API request to: ${API_BASE}${endpoint}`);
  console.log('Request options:', options);

  try {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json().catch(e => {
      console.error('Error parsing response:', e);
      throw new Error('Invalid response format');
    });

    if (!response.ok) {
      console.error('API error response:', data);
      throw new Error(data.detail || 'API request failed');
    }

    console.log('API response:', data);
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// ===== Auth endpoints =====
export const login = (credentials) =>
  fetchApi("/auth/login", {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

export const register = (userData) =>
  fetchApi("/auth/register", {
    method: 'POST',
    body: JSON.stringify(userData),
  });

// ===== Content endpoints =====
export const generateContent = (payload) =>
  fetchApi("/content/generate", {
    method: 'POST',
    body: JSON.stringify(payload),
  });

// ===== Marketing endpoints =====
export const getTrends = (companyData) =>
  fetchApi("/marketing/trends", {
    method: 'POST',
    body: JSON.stringify(companyData),
  });

export const getSchedule = (contentData) =>
  fetchApi("/marketing/schedule", {
    method: 'POST',
    body: JSON.stringify(contentData),
  });

// ===== ML endpoints =====
export const analyzeBehavior = (userData) =>
  fetchApi("/ml/analyze", {
    method: 'POST',
    body: JSON.stringify(userData),
  });

export const generateMLContent = (prompt, type, context = null) =>
  fetchApi("/ml/generate", {
    method: 'POST',
    body: JSON.stringify({
      prompt,
      type,
      context
    }),
  });

export const api = { login, register, generateContent, getTrends, getSchedule, analyzeBehavior, generateMLContent };

export default api;