import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DocumentRecord, WorkflowState } from '../services/mockApi';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const nextStates: Record<string, WorkflowState[]> = {
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
  const [audits, setAudits] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        if (!id) return;
        const d = await api.getDocument(id).catch(async () => {
          const { mockApi } = await import('../services/mockApi');
          return mockApi.get(id);
        });
        setDoc(d as DocumentRecord);
        const a = await api.getAudits(id).catch(() => []);
        setAudits(a || []);
      } catch (e) {
        setError('Failed to load document');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // polling for audits
  const pollRef = useRef<number | null>(null);
  useEffect(() => {
    if (!id) return;
    pollRef.current = window.setInterval(async () => {
      try {
        const a = await api.getAudits(id).catch(() => []);
        setAudits(a || []);
      } catch {}
    }, 15000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [id]);

  const canTransition = (target: WorkflowState) => {
    if (!doc) return false;
    const allowed = nextStates[doc.workflowState] || [];
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
      const updated = await api.setWorkflow(doc.id, target, user?.username || 'system');
      setDoc(updated as DocumentRecord);
      const a = await api.getAudits(doc.id).catch(() => []);
      setAudits(a || []);
      showToast(`Document moved to ${target}`);
    } catch (e) {
      setError('Failed to change state');
      showToast(`Failed to move to ${target}`, true);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!doc) return;
    setSaving(true);
    try {
      try {
        await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:9090/api'}/documents/${doc.id}`, { method: 'DELETE' });
      } catch {}
      try { const { mockApi } = await import('../services/mockApi'); await mockApi.remove(doc.id); } catch {}
      navigate('/');
    } catch (e) {
      setError('Failed to delete');
    } finally {
      setSaving(false);
    }
  };

  const fileInfo = useMemo(() => {
    if (!doc) return null;
    if (!doc.content || !doc.content.startsWith('file:')) return null;
    const match = doc.content.match(/^file:(.*?);type:(.*?);data:(.*)$/);
    if (!match) return null;
    return { name: match[1], type: match[2], data: match[3] } as { name: string; type: string; data: string };
  }, [doc]);

  const download = () => {
    if (!fileInfo) return;
    const blob = new Blob([Uint8Array.from(atob(fileInfo.data), (c) => c.charCodeAt(0))], { type: fileInfo.type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileInfo.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  // simple toast system
  function showToast(msg: string, error = false) {
    const el = document.createElement('div');
    el.textContent = msg;
    el.style.position = 'fixed';
    el.style.right = '18px';
    el.style.bottom = '18px';
    el.style.background = error ? 'rgba(231,76,60,0.95)' : 'rgba(91,140,255,0.95)';
    el.style.color = 'white';
    el.style.padding = '10px 14px';
    el.style.borderRadius = '8px';
    document.body.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, 3000);
  }

  if (loading) return <div className="container">Loading…</div>;
  if (error) return <div className="container alert error">{error}</div>;
  if (!doc) return <div className="container">Document not found</div>;

  return (
    <div className="container">
      <div className="detail-header">
        <h2>{doc.title}</h2>
        <div className={`state-badge state-${doc.workflowState.replace(/\s/g, '').toLowerCase()}`}>{doc.workflowState}</div>
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
          {(['Submitted', 'Under Review', 'Approved', 'Rejected'] as WorkflowState[]).map((s) => (
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

      <div style={{ height: 12 }} />

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Workflow Progress</h3>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {['Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected'].map((step, idx, arr) => {
            const doneIndex = ['Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected'].indexOf(doc.workflowState);
            const completed = idx <= doneIndex && doneIndex !== -1;
            const active = step === doc.workflowState;
            return (
              <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 100 }}>
                <div style={{ width: 36, height: 36, borderRadius: 18, display: 'grid', placeItems: 'center', background: active ? 'var(--primary)' : (completed ? 'var(--success)' : '#0c0f14'), color: 'white' }}>{step[0]}</div>
                <div className="subtitle" style={{ marginTop: 6 }}>{step}</div>
                {idx < arr.length - 1 && <div style={{ height: 4, width: 60, background: idx < doneIndex ? 'var(--success)' : '#1f2633', marginTop: 8 }} />}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ height: 12 }} />

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Audit Trail</h3>
        {audits.length === 0 && <div className="empty">No audit events</div>}
        {audits.map((a: any) => (
          <div key={a.id} style={{ padding: '8px 0', borderBottom: '1px solid #202634' }}>
            <div style={{ fontWeight: 600 }}>{a.action} by {a.actor}</div>
            <div className="hint">{new Date(a.at).toLocaleString()} — {a.details}</div>
          </div>
        ))}
      </div>
    </div>
  );
}



