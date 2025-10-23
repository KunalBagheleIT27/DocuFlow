import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DocumentRecord } from "../services/mockApi";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { FaRegFile } from "react-icons/fa";

export default function MyDocumentsPage() {
  const [docs, setDocs] = useState<DocumentRecord[]>([]);
  const { user } = useAuth();
  useEffect(() => {
    (async () => {
      const all = await api.listDocuments();
      const mine = (all || []).filter(
        (d: DocumentRecord) => d.author === (user?.username || "")
      );
      setDocs(mine as DocumentRecord[]);
    })();
  }, [user]);
  return (
    <div className="container">
      <div className="page-hero">
        <div className="hero-left">
          <div className="page-title">My Documents</div>
          <div className="hero-sub">Your personal documents and their current status</div>
        </div>
        <div>
          <Link to="/upload" className="btn-primary">Upload new</Link>
        </div>
      </div>

      <ul className="doc-list">
        {docs.map((d) => (
          <li key={d.id} className="doc-item card">
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:44,height:44,display:'grid',placeItems:'center',background:'#f1f5ff',borderRadius:10,border:'1px solid #e6eefc'}}>
                <FaRegFile style={{color:'var(--primary)'}} />
              </div>
              <div className="doc-main">
                <Link to={`/documents/${d.id}`} className="doc-title">
                  {d.title}
                </Link>
                <div className="doc-meta">
                  <span>Updated: {new Date(d.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div
                className={`state-badge state-${d.workflowState
                  .replace(/\s/g, "")
                  .toLowerCase()}`}
              >
                {d.workflowState}
              </div>
              <Link to={`/documents/${d.id}`} className="btn-secondary">Open</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
