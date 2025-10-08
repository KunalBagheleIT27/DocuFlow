import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaFileAlt, FaCloudUploadAlt, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';

export function AppHeader() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="app-header gradient">
      <div className="header-left">
        <Link to="/" className="brand">
          <FaFileAlt style={{ marginRight: 8 }} /> DocuFlow
        </Link>
        {isAuthenticated && (
          <nav className="nav">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
              <FaFileAlt style={{ marginRight: 6 }} /> Documents
            </NavLink>
            <NavLink to="/upload" className={({ isActive }) => (isActive ? 'active' : '')}>
              <FaCloudUploadAlt style={{ marginRight: 6 }} /> Upload
            </NavLink>
          </nav>
        )}
      </div>
      <div className="header-right">
        {isAuthenticated ? (
          <div className="user-area">
            <span className="user-chip">{user?.username} · {user?.role}</span>
            <button className="btn-secondary glow" onClick={handleLogout}><FaSignOutAlt style={{ marginRight: 6 }} /> Logout</button>
          </div>
        ) : (
          <Link to="/login" className="btn-primary glow"><FaSignInAlt style={{ marginRight: 6 }} /> Login</Link>
        )}
      </div>
    </header>
  );
}



