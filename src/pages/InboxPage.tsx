import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { DocumentRecord } from '../services/mockApi';

export default function InboxPage() {
  const [tasks, setTasks] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.listInbox().then((res) => setTasks(res)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <h2>Inbox / Tasks</h2>
      <div className="card">
        <div className="subtitle">Tasks requiring your attention</div>
        <div style={{height:12}} />
        {loading && <div className="empty">Loading…</div>}
        {!loading && tasks.length === 0 && <div className="empty">No pending tasks. Workflow events will appear here.</div>}
        {!loading && tasks.length > 0 && (
          <div className="table-scroll">
            <table className="df-table">
              <thead>
                <tr><th>Document</th><th>State</th><th>Author</th><th>Received</th><th></th></tr>
              </thead>
              <tbody>
                {tasks.map((t) => (
                  <tr key={t.id}>
                    <td style={{fontWeight:600}}>{t.title}</td>
                    <td><span className="state-submitted state-badge">{t.workflowState}</span></td>
                    <td>{t.author}</td>
                    <td>{new Date(t.createdAt).toISOString().slice(0,10)}</td>
                    <td style={{textAlign:'right'}}>
                      <button className="btn-primary" onClick={async () => { await api.setWorkflow(t.id, 'Approved'); setTasks((s) => s.filter(x => x.id !== t.id)); }}>Approve</button>
                      <button className="btn-danger" style={{marginLeft:8}} onClick={async () => { await api.setWorkflow(t.id, 'Rejected'); setTasks((s) => s.filter(x => x.id !== t.id)); }}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


