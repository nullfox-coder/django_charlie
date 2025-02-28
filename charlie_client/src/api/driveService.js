import apiClient from './apiConfig';

const driveService = {
  // Check Google Drive connection status
  checkDriveConnection: async () => {
    const response = await apiClient.get('/drive/auth/');
    return response.data;
  },

  // List files from Google Drive
  listFiles: async () => {
    const response = await apiClient.get('/drive/files/');
    return response.data;
  },

  // Upload file to Google Drive
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/drive/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Download file from Google Drive
  downloadFile: (fileId) => {
    window.open(`${apiClient.defaults.baseURL}/drive/download/${fileId}/`, '_blank');
  }
};

export default driveService;