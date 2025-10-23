import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DocumentRecord, WorkflowState } from "../services/mockApi";
import { api } from "../services/api";
import { FaSearch, FaUser, FaClock } from "react-icons/fa";

export default function DocumentListPage() {
  const [docs, setDocs] = useState<DocumentRecord[]>([]);
  const [search, setSearch] = useState("");
  const [state, setState] = useState<WorkflowState | "All">("All");
  const [loading, setLoading] = useState(true);

  const loadDocs = async () => {
    setLoading(true);
    try {
      const data = await api.listDocuments();
      setDocs(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, state]);

  const filtered = useMemo(() => {
    let list = docs;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.author.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (state !== "All") {
      list = list.filter((d) => d.workflowState === state);
    }
    return list;
  }, [docs, search, state]);

  return (
    <div className="container">
      <div className="page-hero">
        <div className="hero-left">
          <div className="page-title">All Documents</div>
          <div className="hero-sub">Browse, search and manage documents — fast and simple.</div>
        </div>
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
          <select
            value={state}
            onChange={(e) => setState(e.target.value as any)}
            style={{marginLeft:8, padding:'8px 10px', borderRadius:8, border:'1px solid var(--border)'}}
          >
            <option>All</option>
            <option>Draft</option>
            <option>Submitted</option>
            <option>Under Review</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
          <Link to="/upload" className="btn-primary" style={{marginLeft:12}}>Upload</Link>
        </div>
      </div>

      {loading ? (
        <div className="skeleton-list">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="empty">No documents found.</div>
      ) : (
        <ul className="doc-list">
          {filtered.map((d) => (
            <li key={d.id} className="doc-item card" style={{display:'flex',flexDirection:'column',gap:12}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
                <div style={{display:'flex',alignItems:'center',gap:12}}>
                  <div style={{width:56,height:56,display:'grid',placeItems:'center',background:'#f8fbff',borderRadius:12,border:'1px solid #e8f4ff'}}>
                    <FaUser style={{color:'var(--primary)'}} />
                  </div>
                  <div>
                    <Link to={`/documents/${d.id}`} className="doc-title" style={{fontSize:18}}>{d.title}</Link>
                    <div className="doc-meta" style={{marginTop:6}}>
                      <span style={{marginRight:12}}><FaUser style={{marginRight:6}} />{d.author}</span>
                      <span><FaClock style={{marginRight:6}} />{new Date(d.updatedAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8}}>
                  <div className={`state-badge state-${d.workflowState.replace(/\s/g,'').toLowerCase()}`}>{d.workflowState}</div>
                  <div style={{display:'flex',gap:8}}>
                    <Link to={`/documents/${d.id}`} className="btn-secondary">Open</Link>
                    <button className="btn-primary">Share</button>
                  </div>
                </div>
              </div>

              <div className="tags" style={{marginTop:6}}>
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
