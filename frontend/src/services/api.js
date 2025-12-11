import axios from 'axios';

// For Vite, use import.meta.env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    // Debug: Log outgoing requests
    if (config.url === '/users/login') {
      console.log('DEBUG: Sending login request:');
      console.log('Full URL:', config.baseURL + config.url);
      console.log('Email:', config.data?.email || 'Not provided');
      console.log('Password present:', config.data?.password ? 'Yes' : 'No');
      console.log('Password length:', config.data?.password?.length || 0);
      console.log('Request data:', {
        ...config.data,
        password: config.data?.password ? '***' + config.data.password.slice(-3) : 'undefined'
      });
    }
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    // Debug: Log successful responses for login
    if (response.config.url === '/users/login') {
      console.log('DEBUG: Login response received:');
      console.log('Status:', response.status);
      console.log('Response data:', response.data);
    }
    return response;
  },
  (error) => {
    // Debug: Log error details
    console.log('DEBUG: API Error occurred:');
    console.log('URL:', error.config?.url);
    console.log('Method:', error.config?.method);
    console.log('Status:', error.response?.status);
    console.log('Error data:', error.response?.data);
    console.log('Request data that was sent:', error.config?.data);
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      console.log('DEBUG: 401 Unauthorized error detected');
      
      // Only clear storage and redirect for non-login pages
      if (error.config?.url !== '/users/login') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Only redirect if not already on login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;