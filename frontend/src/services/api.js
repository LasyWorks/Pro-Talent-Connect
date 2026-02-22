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
  // ─── Auth ───
  login: (credentials) => apiClient.post('/auth/login', credentials),
  logout: () => apiClient.post('/auth/logout'),
  getProfile: () => apiClient.get('/auth/profile'),
  changePassword: (data) => apiClient.put('/auth/change-password', data),
  changeAdminRole: (id, role) => apiClient.put(`/auth/admin/${id}/role`, { role }),
  refreshToken: () => apiClient.post('/auth/refresh'),
  registerAdmin: (data) => apiClient.post('/auth/register', data),

  // ─── Players ───
  getPlayers: (options = {}) => {
    const { signal, ...params } = options;
    return apiClient.get('/players', { params, signal });
  },
  getPlayer: (id) => apiClient.get(`/players/${id}`),
  createPlayer: (data) => apiClient.post('/players', data),
  updatePlayer: (id, data) => apiClient.put(`/players/${id}`, data),
  deletePlayer: (id) => apiClient.delete(`/players/${id}`),
  searchPlayers: (params) => apiClient.get('/players/search', { params }),

  // ─── Blogs ───
  getBlogs: (params) => apiClient.get('/blogs', { params }),
  getBlog: (id) => apiClient.get(`/blogs/${id}`),
  createBlog: (data) => apiClient.post('/blogs', data),
  updateBlog: (id, data) => apiClient.put(`/blogs/${id}`, data),
  deleteBlog: (id) => apiClient.delete(`/blogs/${id}`),
  getAllBlogs: (params) => apiClient.get('/blogs/all', { params }),
  publishBlog: (id) => apiClient.patch(`/blogs/${id}/publish`),

  // ─── About ───
  getAbout: () => apiClient.get('/about'),
  updateAbout: (data) => apiClient.put('/about', data),
  addAboutImages: (images) => apiClient.post('/about/images', { images }),

  // ─── Services ───
  getServices: (options = {}) => {
    const { signal } = options;
    return apiClient.get('/services', { signal });
  },
  getService: (id) => apiClient.get(`/services/${id}`),
  createService: (data) => apiClient.post('/services', data),
  updateService: (id, data) => apiClient.put(`/services/${id}`, data),
  deleteService: (id) => apiClient.delete(`/services/${id}`),

  // ─── How It Works ───
  getHowItWorks: () => apiClient.get('/how-it-works'),
  createHowItWork: (data) => apiClient.post('/how-it-works', data),
  updateHowItWork: (id, data) => apiClient.put(`/how-it-works/${id}`, data),
  deleteHowItWork: (id) => apiClient.delete(`/how-it-works/${id}`),

  // ─── Contact / Enquiries ───
  submitEnquiry: (data) => apiClient.post('/contact/enquiry', data),
  submitProfileRequest: (data) => apiClient.post('/contact/profile-request', data),
  getEnquiries: (options = {}) => {
    const { signal } = options;
    return apiClient.get('/contact/enquiries', { signal });
  },
  getProfileRequests: (options = {}) => {
    const { signal } = options;
    return apiClient.get('/contact/profile-requests', { signal });
  },
  updateEnquiryStatus: (id, status) => apiClient.put(`/contact/enquiries/${id}`, { status }),
  updateProfileStatus: (id, status, adminNotes) => apiClient.put(`/contact/profile-requests/${id}`, { status, adminNotes }),

  // ─── Dashboard ───
  getDashboardStats: (options = {}) => {
    const { signal } = options;
    return apiClient.get('/dashboard/stats', { signal });
  },

  // ─── Admin Management (Super Admin) ───
  getAdmins: (params) => apiClient.get('/admins', { params }),
  getAdmin: (id) => apiClient.get(`/admins/${id}`),
  createAdmin: (data) => apiClient.post('/admins', data),
  updateAdmin: (id, data) => apiClient.put(`/admins/${id}`, data),
  demoteAdmin: (id) => apiClient.patch(`/admins/${id}/demote`),
  deleteAdmin: (id) => apiClient.delete(`/admins/${id}`),

  // ─── Audit Logs (Super Admin) ───
  getAuditLogs: (params) => apiClient.get('/audit-logs', { params }),
};

export default apiClient;
