import React from 'react';
import { Container, Typography, Button, Box, Paper, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Google Integration Platform
        </Typography>
        <Typography variant="h5" color="textSecondary" paragraph>
          Seamlessly connect with Google services for authentication, 
          file management, and real-time communication.
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ mb: 8 }}>
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom>
              Google Authentication
            </Typography>
            <Typography paragraph>
              Secure and easy login with Google OAuth 2.0. 
              No need to remember another password.
            </Typography>
            <Box sx={{ mt: 'auto' }}>
              <Button 
                variant="contained" 
                component={Link} 
                to="/auth"
                sx={{ mt: 2 }}
              >
                Sign In
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom>
              Google Drive Integration
            </Typography>
            <Typography paragraph>
              Upload, download, and manage your Google Drive files seamlessly
              through our interface.
            </Typography>
            <Box sx={{ mt: 'auto' }}>
              <Button 
                variant="contained" 
                component={Link} 
                to="/drive"
                sx={{ mt: 2 }}
              >
                Manage Files
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom>
              Real-time Chat
            </Typography>
            <Typography paragraph>
              Connect and chat in real-time with other users through
              our WebSocket-powered chat system.
            </Typography>
            <Box sx={{ mt: 'auto' }}>
              <Button 
                variant="contained" 
                component={Link} 
                to="/chat"
                sx={{ mt: 2 }}
              >
                Start Chatting
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;