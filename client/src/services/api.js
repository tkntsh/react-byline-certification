// API service - handles all HTTP requests to the backend
import axios from 'axios';

// Determine API base URL based on environment
// In production, use VITE_API_URL environment variable
// In development, use proxy (/api) which Vite forwards to localhost:5000
const getBaseURL = () => {
  // Check if we have a production API URL set
  if (import.meta.env.VITE_API_URL) {
    // If VITE_API_URL includes /api, use it as-is, otherwise append /api
    const url = import.meta.env.VITE_API_URL;
    return url.endsWith('/api') ? url : `${url}/api`;
  }
  // Development: use proxy
  return '/api';
};

// Create axios instance with base configuration
const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available (for authenticated routes)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication API calls
export const authAPI = {
  // Register new user
  register: (email, password, name) => 
    api.post('/auth/register', { email, password, name }),
  
  // Login user
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  // Get current user info
  getMe: () => 
    api.get('/auth/me')
};

// News API calls
export const newsAPI = {
  // Get news articles
  getNews: () => 
    api.get('/news')
};

// Submissions API calls
export const submissionsAPI = {
  // Create new submission
  create: (title, content) => 
    api.post('/submissions', { title, content }),
  
  // Get user's submissions
  getMine: () => 
    api.get('/submissions'),
  
  // Get single submission by ID
  getById: (id) => 
    api.get(`/submissions/${id}`)
};

// Admin API calls
export const adminAPI = {
  // Get all submissions (admin only)
  getAllSubmissions: () => 
    api.get('/admin/submissions'),
  
  // Get all users (admin only)
  getAllUsers: () => 
    api.get('/admin/users'),
  
  // Get statistics (admin only)
  getStats: () => 
    api.get('/admin/stats'),
  
  // Update submission (mark/review)
  updateSubmission: (id, status, score, feedback) => 
    api.put(`/submissions/${id}`, { status, score, feedback })
};

export default api;

