import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DocumentRecord, WorkflowState, mockApi } from '../services/mockApi';
import { useAuth } from '../context/AuthContext';

const nextStates: Record<WorkflowState, WorkflowState[]> = {
  Draft: ['Submitted'],
  Submitted: ['Under Review'],
  'Under Review': ['Approved', 'Rejected'],
  Approved: [],
  Rejected: [],
};

export default function DocumentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doc, setDoc] = useState<DocumentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        if (!id) return;
        const d = await mockApi.get(id);
        setDoc(d);
      } catch (e) {
        setError('Failed to load document');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const canTransition = (target: WorkflowState) => {
    if (!doc) return false;
    const allowed = nextStates[doc.workflowState];
    if (!allowed.includes(target)) return false;
    if (target === 'Submitted') return user?.role === 'Submitter';
    if (target === 'Under Review') return user?.role === 'Reviewer' || user?.role === 'Approver';
    if (target === 'Approved' || target === 'Rejected') return user?.role === 'Approver';
    return false;
  };

  const transition = async (target: WorkflowState) => {
    if (!doc) return;
    if (!canTransition(target)) return;
    setSaving(true);
    try {
      const updated = await mockApi.setState(doc.id, target);
      setDoc(updated);
    } catch (e) {
      setError('Failed to change state');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!doc) return;
    setSaving(true);
    try {
      await mockApi.remove(doc.id);
      navigate('/');
    } catch (e) {
      setError('Failed to delete');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container">Loading…</div>;
  if (error) return <div className="container alert error">{error}</div>;
  if (!doc) return <div className="container">Document not found</div>;

  const fileInfo = useMemo(() => {
    if (!doc) return null;
    if (!doc.content.startsWith('file:')) return null;
    const match = doc.content.match(/^file:(.*?);type:(.*?);data:(.*)$/);
    if (!match) return null;
    return { name: match[1], type: match[2], data: match[3] } as { name: string; type: string; data: string };
  }, [doc]);

  const download = () => {
    if (!fileInfo) return;
    const blob = new Blob([Uint8Array.from(atob(fileInfo.data), c => c.charCodeAt(0))], { type: fileInfo.type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileInfo.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container">
      <div className="detail-header">
        <h2>{doc.title}</h2>
        <div className={`state-badge state-${doc.workflowState.replace(/\s/g,'').toLowerCase()}`}>{doc.workflowState}</div>
      </div>
      <div className="card">
        <div className="detail-meta">
          <span>Author: {doc.author}</span>
          <span>Created: {new Date(doc.createdAt).toLocaleString()}</span>
          <span>Updated: {new Date(doc.updatedAt).toLocaleString()}</span>
        </div>
        <div className="tags">
          {doc.tags.map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
        <div className="detail-content">
          <h3>Content</h3>
          {fileInfo ? (
            <div className="file-preview">
              <div className="file-row">
                <span className="file-name">{fileInfo.name}</span>
                <button className="btn-secondary" onClick={download}>Download</button>
              </div>
              {fileInfo.type.includes('pdf') && (
                <object data={`data:${fileInfo.type};base64,${fileInfo.data}`} type={fileInfo.type} width="100%" height="500">
                  <p>PDF preview unavailable. Use download.</p>
                </object>
              )}
            </div>
          ) : (
            <pre className="content-box">{doc.content}</pre>
          )}
        </div>
        <div className="actions">
          {(['Submitted','Under Review','Approved','Rejected'] as WorkflowState[]).map((s) => (
            <button
              key={s}
              className="btn-secondary"
              disabled={!canTransition(s) || saving}
              onClick={() => transition(s)}
            >
              Move to {s}
            </button>
          ))}
          <div className="spacer" />
          <button className="btn-danger" onClick={remove} disabled={saving}>Delete</button>
        </div>
      </div>
    </div>
  );
}



