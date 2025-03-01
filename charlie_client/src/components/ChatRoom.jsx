import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Paper, Typography, TextField, Button, List, 
  ListItem, ListItemText, Divider, CircularProgress, Alert
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import chatService from '../../api/chatService';

const ChatRoom = ({ currentUser, otherUser, roomName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  // Load chat history
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!currentUser || !otherUser) return;
      
      try {
        setLoading(true);
        const data = await chatService.getChatHistory(otherUser.id);
        setMessages(data.messages || []);
      } catch (err) {
        setError('Failed to load chat history.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadChatHistory();
  }, [currentUser, otherUser]);

  // Setup WebSocket connection
  useEffect(() => {
    if (!roomName) return;

    const ws = chatService.createWebSocket(roomName);
    setSocket(ws);

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, {
        sender_id: data.sender_id,
        receiver_id: data.receiver_id,
        content: data.message,
        timestamp: data.timestamp,
        id: Date.now(), // Temporary ID
        sender_name: data.sender_id === currentUser?.id ? currentUser?.username : otherUser?.username,
        receiver_name: data.receiver_id === currentUser?.id ? currentUser?.username : otherUser?.username,
      }]);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('WebSocket connection error. Please refresh the page.');
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close();
    };
  }, [roomName, currentUser, otherUser]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!socket || socket.readyState !== WebSocket.OPEN || !newMessage.trim()) {
      return;
    }

    const messageData = {
      message: newMessage,
      sender_id: currentUser.id,
      receiver_id: otherUser.id
    };

    socket.send(JSON.stringify(messageData));
    setNewMessage('');
  };

  if (loading && !messages.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 2, height: '70vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        Chat with {otherUser?.username}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
        <List>
          {messages.map((message, index) => (
            <React.Fragment key={message.id || index}>
              <ListItem alignItems="flex-start" sx={{
                justifyContent: message.sender_id === currentUser?.id ? 'flex-end' : 'flex-start',
              }}>
                <Paper elevation={1} sx={{
                  p: 2,
                  bgcolor: message.sender_id === currentUser?.id ? '#e3f2fd' : '#f5f5f5',
                  maxWidth: '70%',
                }}>
                  <ListItemText
                    primary={message.content}
                    secondary={new Date(message.timestamp).toLocaleString()}
                  />
                </Paper>
              </ListItem>
              {index < messages.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Box>

      <Box component="form" onSubmit={handleSendMessage} sx={{ display: 'flex' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          sx={{ mr: 1 }}
        />
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          endIcon={<SendIcon />}
          disabled={!socket || socket.readyState !== WebSocket.OPEN}
        >
          Send
        </Button>
      </Box>
    </Paper>
  );
};

export default ChatRoom;