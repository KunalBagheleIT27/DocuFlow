import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DocumentRecord, mockApi } from '../services/mockApi';

export default function MyDocumentsPage() {
  const [docs, setDocs] = useState<DocumentRecord[]>([]);
  useEffect(() => { (async () => setDocs(await mockApi.list()))(); }, []);
  return (
    <div className="container">
      <h2>My Documents</h2>
      <ul className="doc-list">
        {docs.map(d => (
          <li key={d.id} className="doc-item card">
            <div className="doc-main">
              <Link to={`/documents/${d.id}`} className="doc-title">{d.title}</Link>
              <div className="doc-meta">
                <span>Updated: {new Date(d.updatedAt).toLocaleString()}</span>
              </div>
            </div>
            <div className={`state-badge state-${d.workflowState.replace(/\s/g,'').toLowerCase()}`}>{d.workflowState}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}


