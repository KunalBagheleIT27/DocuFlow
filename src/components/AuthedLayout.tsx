import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { FaThLarge, FaChartLine, FaUpload, FaFileAlt, FaInbox, FaRegFile } from 'react-icons/fa';
import { AppFooter } from './AppFooter';
import { AppHeader } from './AppHeader';

export function AuthedLayout() {
  return (
    <div className="app-shell">
      <AppHeader />
      <div className="layout-with-sidebar">
        <aside className="sidebar card sticky">
          <div className="sidebar-brand"><FaThLarge style={{ marginRight: 8 }} /> DocuFlow</div>
          <nav className="sidebar-nav">
            <NavLink to="/dashboard" className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}><FaChartLine /> <span>Dashboard</span></NavLink>
            <NavLink to="/upload" className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}><FaUpload /> <span>Upload Document</span></NavLink>
            <NavLink to="/" end className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}><FaFileAlt /> <span>My Documents</span></NavLink>
            <NavLink to="/inbox" className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}><FaInbox /> <span>Inbox/Tasks</span></NavLink>
            <NavLink to="/templates" className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}><FaRegFile /> <span>Templates</span></NavLink>
            <NavLink to="/reports" className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}><FaChartLine /> <span>Reports</span></NavLink>
            <NavLink to="/settings" className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}><FaRegFile /> <span>Settings</span></NavLink>
          </nav>
        </aside>
        <main className="app-main">
          <Outlet />
        </main>
      </div>
      <AppFooter />
    </div>
  );
}


