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
          <select
            value={state}
            onChange={(e) => setState(e.target.value as any)}
          >
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
      ) : filtered.length === 0 ? (
        <div className="empty">No documents found.</div>
      ) : (
        <ul className="doc-list">
          {filtered.map((d) => (
            <li key={d.id} className="doc-item card">
              <div className="doc-main">
                <Link to={`/documents/${d.id}`} className="doc-title">
                  {d.title}
                </Link>
                <div className="doc-meta">
                  <span>
                    <FaUser style={{ marginRight: 6 }} /> {d.author}
                  </span>
                  <span>
                    <FaClock style={{ marginRight: 6 }} />{" "}
                    {new Date(d.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <div
                className={`state-badge state-${d.workflowState
                  .replace(/\s/g, "")
                  .toLowerCase()}`}
              >
                {d.workflowState}
              </div>
              <div className="tags">
                {d.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
