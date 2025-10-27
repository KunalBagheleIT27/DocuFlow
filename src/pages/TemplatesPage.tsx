import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

type Template = { id: string; name: string; content: string; createdAt?: string; domain?: string };

const DEFAULT_TEMPLATES: Template[] = [
  {
    id: 'tpl-nda',
    name: 'Mutual NDA',
    domain: 'Legal',
    createdAt: new Date().toISOString(),
    content:
      'This Non-Disclosure Agreement (NDA) is entered into between the Disclosing Party and the Receiving Party...\n\n[Insert terms]'
  },
  {
    id: 'tpl-invoice',
    name: 'Invoice (Standard)',
    domain: 'Finance',
    createdAt: new Date().toISOString(),
    content:
      'Invoice\n\nBill To: {{client_name}}\nInvoice #: {{invoice_no}}\nDate: {{date}}\n\nItems:\n- {{item1}} — {{amount1}}\n\nTotal: {{total}}\n\nThank you for your business.'
  },
  {
    id: 'tpl-onboard',
    name: 'Employee Onboarding Checklist',
    domain: 'HR',
    createdAt: new Date().toISOString(),
    content:
      '- Welcome email sent\n- Hardware provisioned\n- Account access created\n- Introductions scheduled\n- First week goals set'
  },
];

function loadLocalTemplates(): Template[] {
  try {
    const raw = localStorage.getItem('df_templates');
    if (!raw) return [];
    return JSON.parse(raw) as Template[];
  } catch {
    return [];
  }
}

function saveLocalTemplates(list: Template[]) {
  localStorage.setItem('df_templates', JSON.stringify(list));
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [domain, setDomain] = useState('General');
  const base = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:9090/api';

  async function load() {
    setLoading(true);
    try {
      const t = await api.listTemplates();
      if (t && t.length > 0) {
        // backend templates
        setTemplates(t.map((x: any) => ({ id: x.id || x._id || x.name, name: x.name, content: x.content || '', createdAt: x.createdAt || x.created_at } as Template)));
        setLoading(false);
        return;
      }
    } catch (e) {
      // fallthrough to local
    }

    // use local templates (create defaults if absent)
    const local = loadLocalTemplates();
    if (local.length === 0) {
      const now = new Date().toISOString();
      const defs = DEFAULT_TEMPLATES.map((d) => ({ ...d, createdAt: d.createdAt || now }));
      saveLocalTemplates(defs);
      setTemplates(defs);
    } else {
      setTemplates(local);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function create() {
    if (!name.trim()) return alert('Please provide a template name');
    try {
      const res = await fetch(`${base}/templates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, content }),
      });
      if (res.ok) {
        setName('');
        setContent('');
        await load();
        return;
      }
    } catch (e) {
      // continue to local fallback
    }

    // local fallback
    const now = new Date().toISOString();
    const tpl: Template = { id: crypto.randomUUID(), name: name.trim(), content: content || '', domain, createdAt: now };
    const list = loadLocalTemplates();
    list.unshift(tpl);
    saveLocalTemplates(list);
    setTemplates(list);
    setName('');
    setContent('');
  }

  async function removeTemplate(id: string) {
    // try backend first
    try {
      const res = await fetch(`${base}/templates/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        await load();
        return;
      }
    } catch {}

    // local fallback
    const list = loadLocalTemplates().filter((t) => t.id !== id);
    saveLocalTemplates(list);
    setTemplates(list);
  }

  return (
    <div className="container">
      <div className="page-hero">
        <div className="hero-left">
          <div className="page-title">Templates</div>
          <div className="hero-sub">Manage reusable templates to standardize and accelerate document generation.</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '480px 1fr', gap: 24, alignItems: 'start' }}>
        <div className="card">
          <div className="subtitle">Manage reusable templates</div>
          <div style={{ height: 12 }} />
          <div style={{ display: 'grid', gap: 12 }}>
            <input className="large-input" placeholder="Template name (e.g. 'Standard Invoice')" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="large-input" placeholder="Domain (e.g. Legal, Finance, HR)" value={domain} onChange={(e) => setDomain(e.target.value)} />
            <textarea className="large-textarea" placeholder="Template content or placeholders (use {{placeholder}})" value={content} onChange={(e) => setContent(e.target.value)} />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-primary" onClick={create}>Create Template</button>
            </div>
          </div>
        </div>

        <div className="card table-card">
          <h3 style={{ marginTop: 0 }}>Existing Templates</h3>
          {loading && <div className="empty">Loading…</div>}
          {!loading && templates.length === 0 && <div className="empty">No templates available.</div>}
          {!loading && templates.length > 0 && (
            <div className="template-grid">
                  {templates.map((t) => (
                <div key={t.id} className="template-card">
                  <div className="template-head">
                    <div style={{fontWeight:700}}>{t.name}</div>
                    <div className="template-domain">{t.domain || 'General'}</div>
                  </div>
                  <div className="template-body">{t.content ? (t.content.length > 220 ? t.content.slice(0, 220) + '…' : t.content) : <span className="hint">No content provided</span>}</div>
                  <div className="template-foot">
                    <div className="small-hint">{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : ''}</div>
                    <div className="row-actions">
                      <button className="btn-secondary" onClick={() => { navigator.clipboard?.writeText(t.content || ''); }}>Copy content</button>
                      <button className="btn-danger" onClick={() => removeTemplate(t.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


