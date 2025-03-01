import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import GoogleAuth from '../components/GoogleAuth';
import GoogleDriveManager from '../components/GoogleDriveManager';
import { checkGoogleDriveStatus } from '../api/driveService';
import './DriveIntegrationPage.css';

const DriveIntegrationPage = ({ user }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setIsLoading(true);
        const response = await checkGoogleDriveStatus();
        setIsConnected(response.status === 'connected');
      } catch (error) {
        console.error('Error checking Google Drive connection:', error);
        toast.error('Failed to check Google Drive connection status');
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkConnection();
  }, []);
  
  const handleConnectionSuccess = () => {
    setIsConnected(true);
    toast.success('Successfully connected to Google Drive!');
  };
  
  return (
    <div className="drive-page-container">
      <h1>Google Drive Integration</h1>
      
      {isLoading ? (
        <div className="loading-spinner">Loading...</div>
      ) : isConnected ? (
        <GoogleDriveManager />
      ) : (
        <div className="connect-container">
          <div className="connect-card">
            <h2>Connect to Google Drive</h2>
            <p>
              Connect your Google Drive account to upload, manage, and download your files.
              This integration requires authorization through your Google account.
            </p>
            <div className="auth-button-container">
              <GoogleAuth onSuccess={handleConnectionSuccess} />
            </div>
            <div className="permission-info">
              <h3>Required Permissions:</h3>
              <ul>
                <li>View and manage Google Drive files that you have opened or created with this app</li>
                <li>View your basic profile info (name, email)</li>
              </ul>
            </div>
          </div>
          
          <div className="features-section">
            <h3>Features</h3>
            <div className="feature-cards">
              <div className="feature-card">
                <i className="fas fa-upload"></i>
                <h4>Upload Files</h4>
                <p>Upload files directly to your Google Drive</p>
              </div>
              <div className="feature-card">
                <i className="fas fa-download"></i>
                <h4>Download Files</h4>
                <p>Browse and download your Google Drive files</p>
              </div>
              <div className="feature-card">
                <i className="fas fa-file-alt"></i>
                <h4>File Picker</h4>
                <p>Select files using the Google Picker API</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriveIntegrationPage;