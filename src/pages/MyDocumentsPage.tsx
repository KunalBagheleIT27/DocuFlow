import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DocumentRecord } from "../services/mockApi";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

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
      <h2>My Documents</h2>
      <ul className="doc-list">
        {docs.map((d) => (
          <li key={d.id} className="doc-item card">
            <div className="doc-main">
              <Link to={`/documents/${d.id}`} className="doc-title">
                {d.title}
              </Link>
              <div className="doc-meta">
                <span>Updated: {new Date(d.updatedAt).toLocaleString()}</span>
              </div>
            </div>
            <div
              className={`state-badge state-${d.workflowState
                .replace(/\s/g, "")
                .toLowerCase()}`}
            >
              {d.workflowState}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
