import apiClient from './apiConfig';

const chatService = {
  // Get chat history with a specific user
  getChatHistory: async (userId) => {
    const response = await apiClient.get(`/chat/history/${userId}/`);
    return response.data;
  },

  // Create WebSocket connection
  createWebSocket: (roomName) => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = process.env.REACT_APP_WS_URL || window.location.host;
    return new WebSocket(`${protocol}//${host}/ws/chat/${roomName}/`);
  }
};

export default chatService;