import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import GoogleAuth from '../components/GoogleAuth';
import './LoginPage.css';

const LoginPage = ({ setIsAuthenticated, setUser }) => {
  const navigate = useNavigate();
  
  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    toast.success('Successfully logged in!');
    navigate('/dashboard');
  };
  
  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome to Google Integration</h1>
          <p>Sign in to access your Google Drive and Chat</p>
        </div>
        
        <div className="login-options">
          <div className="login-option">
            <div className="option-info">
              <h3>Sign in with Google</h3>
              <p>Connect using your Google account to access all features</p>
            </div>
            <GoogleAuth onSuccess={handleLoginSuccess} buttonText="Sign in with Google" />
          </div>
        </div>
        
        <div className="login-features">
          <h3>Features</h3>
          <div className="feature-list">
            <div className="feature-item">
              <i className="fas fa-cloud"></i>
              <div>
                <h4>Google Drive Integration</h4>
                <p>Access, upload and manage your Drive files</p>
              </div>
            </div>
            <div className="feature-item">
              <i className="fas fa-comments"></i>
              <div>
                <h4>Real-Time Chat</h4>
                <p>Communicate with other users in real-time</p>
              </div>
            </div>
            <div className="feature-item">
              <i className="fas fa-lock"></i>
              <div>
                <h4>Secure Authentication</h4>
                <p>OAuth 2.0 protocol for secure access</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;