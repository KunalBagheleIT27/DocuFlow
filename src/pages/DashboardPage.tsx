import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DocumentRecord, mockApi } from '../services/mockApi';
import { api } from '../services/api';
import { FaChartLine, FaClock, FaCheckCircle, FaUsers, FaUpload, FaRegFile } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const [docs, setDocs] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let data: DocumentRecord[];
      try {
        data = await api.listDocuments();
      } catch {
        data = await mockApi.list();
      }
      setDocs(data);
      setLoading(false);
    })();
  }, []);

  const metrics = useMemo(() => {
    const total = docs.length;
    const pending = docs.filter(d => d.workflowState === 'Submitted' || d.workflowState === 'Under Review').length;
    const today = new Date().toISOString().slice(0,10);
    const approvedToday = docs.filter(d => d.workflowState === 'Approved' && d.updatedAt.slice(0,10) === today).length;
    const activeUsers = 43; // demo value
    return { total, pending, approvedToday, activeUsers };
  }, [docs]);

  const { user } = useAuth();

  const raw = localStorage.getItem('docuflow_logins');
  const recent = useMemo(() => {
    const arr: { username: string; at: string }[] = raw ? JSON.parse(raw) : [];
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    return arr.filter(l => new Date(l.at).getTime() >= cutoff);
  }, [raw]);

  return (
      <section className="dashboard-main">
        <div className="welcome-row">
          <div className="welcome-text">Hello, {user?.displayName || user?.username}</div>
        </div>
        <div className="cards-grid">
          <div className="metric-card card"><div className="metric-icon info"><FaRegFile /></div><div className="metric-content"><div className="metric-title">Total Documents</div><div className="metric-value">{metrics.total}</div></div></div>
          <div className="metric-card card"><div className="metric-icon warn"><FaClock /></div><div className="metric-content"><div className="metric-title">Pending Reviews</div><div className="metric-value">{metrics.pending}</div></div></div>
          <div className="metric-card card"><div className="metric-icon success"><FaCheckCircle /></div><div className="metric-content"><div className="metric-title">Approved Today</div><div className="metric-value">{metrics.approvedToday}</div></div></div>
          <div className="metric-card card"><div className="metric-icon"><FaUsers /></div><div className="metric-content"><div className="metric-title">Active Users (24h)</div><div className="metric-value">{recent.length}</div></div></div>
        </div>

        <div className="table-card card">
          <div className="table-header">
            <div className="title-row">
              <h3>Documents</h3>
              <Link to="/upload" className="btn-primary glow"><FaUpload style={{ marginRight: 6 }} /> New Document</Link>
            </div>
          </div>
          {loading ? (
            <div className="skeleton-list">Loading…</div>
          ) : (
            <div className="table-scroll">
              <table className="df-table">
                <thead>
                  <tr>
                    <th>Document</th>
                    <th>Owner</th>
                    <th>Status</th>
                    <th>Last Updated</th>
                    <th>Tags</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {docs.map(d => (
                    <tr key={d.id}>
                      <td><Link to={`/documents/${d.id}`} className="link">{d.title}</Link></td>
                      <td>{d.author}</td>
                      <td><span className={`state-badge state-${d.workflowState.replace(/\s/g,'').toLowerCase()}`}>{d.workflowState}</span></td>
                      <td>{new Date(d.updatedAt).toLocaleDateString()}</td>
                      <td>
                        <div className="tags">
                          {d.tags.slice(0,3).map(t => <span className="tag" key={t}>{t}</span>)}
                          {d.tags.length > 3 && <span className="tag">+{d.tags.length - 3}</span>}
                        </div>
                      </td>
                      <td><Link to={`/documents/${d.id}`} className="btn-secondary">View</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
  );
}


