import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaFileAlt, FaCloudUploadAlt, FaSignOutAlt, FaSignInAlt, FaBell } from 'react-icons/fa';
import { api } from '../services/api';

export function AppHeader() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!user) return;
      const n = await api.listNotifications(user.username).catch(() => []);
      if (mounted) setNotes(n || []);
    })();
    return () => { mounted = false; };
  }, [user]);

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
            <button className="btn-secondary" style={{position:'relative'}} onClick={() => setOpen(s => !s)}><FaBell />{notes.length > 0 && <span style={{position:'absolute', right:-6, top:-6, background:'var(--danger)', color:'#fff', borderRadius:8, padding:'2px 6px', fontSize:11}}>{notes.length}</span>}</button>
            {open && (
              <div style={{position:'absolute', right:20, top:56, width:320, background:'var(--panel)', border:'1px solid #202634', borderRadius:8, padding:8, zIndex:40}}>
                <div style={{fontWeight:700, marginBottom:6}}>Notifications</div>
                {notes.length===0 && <div className="empty">No notifications</div>}
                {notes.slice(0,5).map(n => (
                  <div key={n.id} style={{padding:'8px 6px', borderBottom:'1px solid #202634'}}>
                    <div style={{fontWeight:600}}>{n.message}</div>
                    <div className="hint">{new Date(n.createdAt).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
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



