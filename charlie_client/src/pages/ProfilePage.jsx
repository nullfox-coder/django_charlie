import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getProfile, updateProfile } from '../api/authService';
import { checkGoogleDriveStatus, disconnectGoogleDrive } from '../api/driveService';
import GoogleAuth from '../components/GoogleAuth';
import './ProfilePage.css';

const ProfilePage = ({ user, setUser }) => {
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [driveStatus, setDriveStatus] = useState('checking');
  
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const profileData = await getProfile();
        setProfile(profileData);
        
        // Check Google Drive connection status
        const driveResponse = await checkGoogleDriveStatus();
        setDriveStatus(driveResponse.status);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast.error('Failed to load profile information');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };
  
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const updatedProfile = await updateProfile(profile);
      setProfile(updatedProfile);
      setUser({ ...user, ...updatedProfile });
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDisconnectDrive = async () => {
    try {
      await disconnectGoogleDrive();
      setDriveStatus('disconnected');
      toast.success('Google Drive disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting Google Drive:', error);
      toast.error('Failed to disconnect Google Drive');
    }
  };
  
  return (
    <div className="profile-page-container">
      <h1>Profile</h1>
      
      {isLoading ? (
        <div className="loading-spinner">Loading profile...</div>
      ) : (
        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {profile.first_name ? profile.first_name[0] : profile.email[0]}
              </div>
              <h2>{profile.first_name} {profile.last_name}</h2>
              <p className="email">{profile.email}</p>
            </div>
            
            {isEditing ? (
              <form className="profile-form" onSubmit={handleSave}>
                <div className="form-group">
                  <label htmlFor="first_name">First Name</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={profile.first_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="last_name">Last Name</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={profile.last_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    disabled
                  />
                  <small>Email cannot be changed</small>
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="save-button"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-details">
                <div className="profile-section">
                  <h3>Personal Information</h3>
                  <div className="detail-row">
                    <span className="detail-label">First Name:</span>
                    <span className="detail-value">{profile.first_name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Last Name:</span>
                    <span className="detail-value">{profile.last_name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{profile.email}</span>
                  </div>
                  
                  <button 
                    className="edit-button"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="connections-card">
            <h3>Connected Services</h3>
            
            <div className="connection-item">
              <div className="connection-info">
                <div className="connection-icon google-icon">G</div>
                <div className="connection-details">
                  <h4>Google Drive</h4>
                  <p className={`connection-status ${driveStatus}`}>
                    {driveStatus === 'connected' ? 'Connected' : 
                     driveStatus === 'disconnected' ? 'Not Connected' : 
                     'Checking...'}
                  </p>
                </div>
              </div>
              
              <div className="connection-actions">
                {driveStatus === 'connected' ? (
                  <button 
                    className="disconnect-button"
                    onClick={handleDisconnectDrive}
                  >
                    Disconnect
                  </button>
                ) : (
                  <GoogleAuth 
                    buttonText="Connect" 
                    onSuccess={() => setDriveStatus('connected')}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;