import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, List, ListItem, ListItemText, 
  ListItemSecondaryAction, IconButton, Divider, Paper,
  CircularProgress, Alert
} from '@mui/material';
import { DownloadRounded, CloudUploadRounded } from '@mui/icons-material';
import driveService from '../../api/driveService';
import authService from '../../api/authService';

const GoogleDriveManager = () => {
  const [files, setFiles] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await driveService.checkDriveConnection();
        setIsConnected(result.status === 'connected');
        
        if (result.status === 'connected') {
          fetchFiles();
        }
      } catch (err) {
        setError('Failed to check Google Drive connection.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkConnection();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const result = await driveService.listFiles();
      setFiles(result.files || []);
    } catch (err) {
      setError('Failed to fetch files from Google Drive.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      const { authorization_url } = await authService.initiateGoogleAuth();
      window.location.href = authorization_url;
    } catch (err) {
      setError('Failed to connect to Google Drive.');
      console.error(err);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadStatus({ loading: true });
    try {
      const result = await driveService.uploadFile(file);
      setUploadStatus({ 
        success: true, 
        message: `Successfully uploaded: ${result.file.name}`
      });
      fetchFiles();
    } catch (err) {
      setUploadStatus({ 
        error: true, 
        message: 'Failed to upload file.'
      });
      console.error(err);
    }
  };

  const handleDownload = (fileId) => {
    driveService.downloadFile(fileId);
  };

  if (loading && !files.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Google Drive Integration
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {uploadStatus?.success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {uploadStatus.message}
        </Alert>
      )}

      {uploadStatus?.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {uploadStatus.message}
        </Alert>
      )}

      {!isConnected ? (
        <Box sx={{ mt: 3 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Connect your Google Drive to access your files
          </Alert>
          <Button 
            variant="contained" 
            onClick={handleConnect}
            startIcon={<CloudUploadRounded />}
          >
            Connect Google Drive
          </Button>
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadRounded />}
              disabled={uploadStatus?.loading}
            >
              {uploadStatus?.loading ? <CircularProgress size={24} /> : 'Upload File'}
              <input
                type="file"
                hidden
                onChange={handleFileUpload}
              />
            </Button>
            <Button onClick={fetchFiles} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Refresh Files'}
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Your Google Drive Files
          </Typography>

          {files.length === 0 ? (
            <Alert severity="info">No files found in your Google Drive</Alert>
          ) : (
            <List>
              {files.map((file) => (
                <ListItem key={file.id}>
                  <ListItemText
                    primary={file.name}
                    secondary={`Type: ${file.mimeType}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => handleDownload(file.id)}>
                      <DownloadRounded />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </>
      )}
    </Paper>
  );
};

export default GoogleDriveManager;