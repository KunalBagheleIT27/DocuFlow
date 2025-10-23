import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

type Template = { id: string; name: string; content: string; createdAt?: string };

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const base = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:9090/api';

  async function load() {
    setLoading(true);
    const t = await api.listTemplates();
    setTemplates(t || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function create() {
    try {
  const base = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:9090/api';
  const res = await fetch(`${base}/templates`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, content })
      });
      if (res.ok) {
        setName(''); setContent(''); load();
      } else {
        alert('Failed to create template');
      }
    } catch (e) {
      alert('Failed to create template');
    }
  }

  return (
    <div className="container">
      <div className="page-hero">
        <div className="hero-left">
          <div className="page-title">Templates</div>
          <div className="hero-sub">Create and manage reusable templates to speed up document creation.</div>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns: '480px 1fr', gap: 24, alignItems: 'start'}}>
        <div className="card">
          <div className="subtitle">Create and manage reusable templates</div>
          <div style={{height:12}} />
          <div style={{display:'grid', gap:12}}>
            <input className="large-input" placeholder="Template name" value={name} onChange={(e)=>setName(e.target.value)} />
            <textarea className="large-textarea" placeholder="Template content" value={content} onChange={(e)=>setContent(e.target.value)} />
            <div style={{display:'flex', justifyContent:'flex-end'}}>
              <button className="btn-primary" onClick={create}>Create Template</button>
            </div>
          </div>
        </div>

        <div className="card table-card">
          <h3 style={{marginTop:0}}>Existing Templates</h3>
          {loading && <div className="empty">Loading…</div>}
          {!loading && templates.length === 0 && <div className="empty">No templates yet.</div>}
          {!loading && templates.length > 0 && (
            <div className="table-scroll">
              <table className="df-table">
                <thead><tr><th>Name</th><th>Created</th><th></th></tr></thead>
                <tbody>
                  {templates.map(t => (
                    <tr key={t.id}><td style={{fontWeight:600}}>{t.name}</td><td>{t.createdAt?.slice(0,10)}</td><td style={{textAlign:'right'}}>
                        <button className="btn-danger" onClick={async ()=>{ const res = await fetch(`${base}/templates/${t.id}`, { method: 'DELETE' }); if (res.ok) load(); else alert('Failed'); }}>Delete</button>
                      </td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


