import api from './api';

const userService = {
  // Get all users with pagination
  getUsers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Create user (Now uses /users/register for authentication)
  createUser: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // ===== NEW AUTHENTICATION METHODS =====
  
  // Login - Step 1: Send OTP
  login: async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  },

  // Verify OTP - Step 2: Get Token
  verifyOtp: async (email, otp) => {
    const response = await api.post('/users/verify-otp', { email, otp });
    return response.data;
  },

  // Logout
  logout: async () => {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Optional: Call backend logout endpoint if you have one
    try {
      await api.post('/users/logout');
    } catch (error) {
      // Logout endpoint might not exist, that's OK
      console.log('Logout endpoint not available');
    }
    
    return { success: true, message: 'Logged out successfully' };
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default userService;