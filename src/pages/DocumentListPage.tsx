import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DocumentRecord, WorkflowState, mockApi } from '../services/mockApi';
import { FaSearch, FaUser, FaClock } from 'react-icons/fa';

export default function DocumentListPage() {
  const [docs, setDocs] = useState<DocumentRecord[]>([]);
  const [search, setSearch] = useState('');
  const [state, setState] = useState<WorkflowState | 'All'>('All');
  const [loading, setLoading] = useState(true);

  const loadDocs = async () => {
    setLoading(true);
    const data = await mockApi.list({ search, state });
    setDocs(data);
    setLoading(false);
  };

  useEffect(() => {
    loadDocs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, state]);

  return (
    <div className="container">
      <div className="toolbar">
        <h2>Documents</h2>
        <div className="toolbar-actions">
          <div className="search-wrap">
            <FaSearch className="search-icon" />
            <input
              className="search"
              placeholder="Search by title, author, tag"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select value={state} onChange={(e) => setState(e.target.value as any)}>
            <option>All</option>
            <option>Draft</option>
            <option>Submitted</option>
            <option>Under Review</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="skeleton-list">Loading…</div>
      ) : docs.length === 0 ? (
        <div className="empty">No documents found.</div>
      ) : (
        <ul className="doc-list">
          {docs.map((d) => (
            <li key={d.id} className="doc-item card">
              <div className="doc-main">
                <Link to={`/documents/${d.id}`} className="doc-title">{d.title}</Link>
                <div className="doc-meta">
                  <span><FaUser style={{ marginRight: 6 }} /> {d.author}</span>
                  <span><FaClock style={{ marginRight: 6 }} /> {new Date(d.updatedAt).toLocaleString()}</span>
                </div>
              </div>
              <div className={`state-badge state-${d.workflowState.replace(/\s/g,'').toLowerCase()}`}>{d.workflowState}</div>
              <div className="tags">
                {d.tags.map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}



