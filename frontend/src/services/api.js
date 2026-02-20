/**
 * Centralized API Configuration
 * Single source of truth for all API calls
 */

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - add auth token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error - server may be down');
      error.message = 'Network error. Please check your connection.';
    }
    
    // Handle rate limiting
    if (error.response?.status === 429) {
      error.message = 'Too many requests. Please try again later.';
    }
    
    return Promise.reject(error);
  }
);

// API methods
export const api = {
  // Auth
  login: (credentials) => apiClient.post('/auth/login', credentials),
  logout: () => apiClient.post('/auth/logout'),
  getProfile: () => apiClient.get('/auth/profile'),
  
  // Players
  getPlayers: (options = {}) => {
    const { signal, ...params } = options;
    return apiClient.get('/players', { params, signal });
  },
  getPlayer: (id) => apiClient.get(`/players/${id}`),
  createPlayer: (data) => apiClient.post('/players', data),
  updatePlayer: (id, data) => apiClient.put(`/players/${id}`, data),
  deletePlayer: (id) => apiClient.delete(`/players/${id}`),
  searchPlayers: (query) => apiClient.get('/players/search', { params: { q: query } }),
  
  // Blogs
  getBlogs: () => apiClient.get('/blogs'),
  getBlog: (id) => apiClient.get(`/blogs/${id}`),
  createBlog: (data) => apiClient.post('/blogs', data),
  updateBlog: (id, data) => apiClient.put(`/blogs/${id}`, data),
  deleteBlog: (id) => apiClient.delete(`/blogs/${id}`),
  getAllBlogs: () => apiClient.get('/blogs/all'),
  
  // About
  getAbout: () => apiClient.get('/about'),
  
  // Services
  getServices: (options = {}) => {
    const { signal } = options;
    return apiClient.get('/services', { signal });
  },
  getHowItWorks: () => apiClient.get('/how-it-works'),
  
  // Contact
  submitEnquiry: (data) => apiClient.post('/contact/enquiries', data),
  submitProfileRequest: (data) => apiClient.post('/contact/profile-requests', data),
  getEnquiries: (options = {}) => {
    const { signal } = options;
    return apiClient.get('/contact/enquiries', { signal });
  },
  getProfileRequests: (options = {}) => {
    const { signal } = options;
    return apiClient.get('/contact/profile-requests', { signal });
  },
  updateEnquiryStatus: (id, status) => apiClient.put(`/contact/enquiries/${id}`, { status }),
  updateProfileStatus: (id, status) => apiClient.put(`/contact/profile-requests/${id}`, { status }),
  
  // Dashboard
  getDashboardStats: (options = {}) => {
    const { signal } = options;
    return apiClient.get('/dashboard/stats', { signal });
  },
};

export default apiClient;
