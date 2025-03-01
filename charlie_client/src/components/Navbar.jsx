import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../api/authService';
import './Navbar.css';

const Navbar = ({ user }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      window.location.reload(); // Force a full reload to clear auth state
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          Google Integration
        </Link>
        
        <div className="navbar-links">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/drive" className="nav-link">Drive</Link>
          <Link to="/chat" className="nav-link">Chat</Link>
        </div>
        
        <div className="navbar-user">
          <div className="user-avatar" onClick={toggleDropdown}>
            {user?.first_name ? user.first_name[0] : user?.email ? user.email[0] : 'U'}
          </div>
          
          {showDropdown && (
            <div className="user-dropdown">
              <div className="dropdown-user-info">
                <p className="dropdown-username">
                  {user?.first_name ? `${user.first_name} ${user.last_name}` : user?.email}
                </p>
                <p className="dropdown-email">{user?.email}</p>
              </div>
              <div className="dropdown-divider"></div>
              <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                <i className="fas fa-user"></i> Profile
              </Link>
              <button className="dropdown-item logout-button" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;