import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, CircularProgress, Box, Typography, Paper } from '@mui/material';
import authService from '../../api/authService';

const GoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle the OAuth callback
  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get('code');
      const state = params.get('state');
      
      if (code && state) {
        setLoading(true);
        try {
          // In a real app, you would send this to your backend
          // Here we're simulating by navigating to dashboard
          navigate('/dashboard');
        } catch (err) {
          setError('Authentication failed. Please try again.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    if (location.pathname === '/auth/callback') {
      handleCallback();
    }
  }, [location, navigate]);

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const { authorization_url } = await authService.initiateGoogleAuth();
      window.location.href = authorization_url;
    } catch (err) {
      setError('Failed to initiate authentication. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Sign in with Google
      </Typography>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      <Button
        variant="contained"
        color="primary"
        onClick={handleGoogleAuth}
        disabled={loading}
        fullWidth
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Sign in with Google'}
      </Button>
    </Paper>
  );
};

export default GoogleAuth;