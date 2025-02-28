import apiClient from './apiConfig';

const authService = {
  // Initiate Google OAuth flow
  initiateGoogleAuth: async () => {
    const response = await apiClient.get('/auth/google/init/');
    return response.data;
  },

  // Get current user info
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/user/');
      return response.data;
    } catch (error) {
      return null;
    }
  },

  // Logout
  logout: async () => {
    return apiClient.post('/auth/logout/');
  }
};

export default authService;