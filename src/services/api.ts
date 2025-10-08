import axios from 'axios';

// API Base URL - SmarterASP.NET Production
const API_BASE_URL = 'https://mohamedexfs60-001-site1.mtempurl.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const fullUrl = `${config.baseURL || ''}${config.url || ''}`;
    console.log('🌐 [API] Making request to:', fullUrl);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ [API] Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ [API] Response received:', response.status, response.config?.url || 'unknown');
    return response;
  },
  (error) => {
    console.error('❌ [API] Response error:', error.response?.status, error.config?.url || 'unknown', error.message);
    
    // Handle network errors
    if (error.code === 'ERR_NETWORK') {
      console.error('🌐 [API] Network Error - Backend may be down or CORS issue');
      console.error('🌐 [API] Backend URL:', API_BASE_URL);
    }
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;