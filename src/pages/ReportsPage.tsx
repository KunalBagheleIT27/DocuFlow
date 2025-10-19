import React, { useEffect, useMemo, useState } from 'react';
import { mockApi, DocumentRecord, WorkflowState } from '../services/mockApi';
import LineChart from '../components/LineChart';

const DATE_RANGES: { label: string; days: number }[] = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
];

function formatDate(iso: string) {
  try {
    return new Date(iso).toISOString().slice(0, 10);
  } catch (e) {
    return iso;
  }
}

function statusGroup(d: DocumentRecord) {
  // Group Submitted + Under Review -> Pending to match the design
  if (d.workflowState === 'Submitted' || d.workflowState === 'Under Review') return 'Pending';
  return d.workflowState;
}

export default function ReportsPage() {
  const [rangeDays, setRangeDays] = useState<number>(30);
  const [statusFilter, setStatusFilter] = useState<'All' | string>('All');
  const [departmentFilter, setDepartmentFilter] = useState<'All' | string>('All');
  const [docs, setDocs] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    mockApi.list().then((list) => {
      if (mounted) setDocs(list);
    }).finally(() => setLoading(false));
    return () => { mounted = false; };
  }, []);

  const departments = useMemo(() => {
    const s = new Set<string>();
    docs.forEach((d) => (d.tags || []).forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, [docs]);

  const filtered = useMemo(() => {
    return docs.filter((d) => {
      if (statusFilter !== 'All' && statusGroup(d) !== statusFilter) return false;
      if (departmentFilter !== 'All' && (d.tags[0] || 'General') !== departmentFilter) return false;
      return true;
    });
  }, [docs, statusFilter, departmentFilter]);

  const counts = useMemo(() => {
    const map = { Pending: 0, Approved: 0, Rejected: 0 } as Record<string, number>;
    docs.forEach((d) => {
      const g = statusGroup(d);
      if (g === 'Approved') map.Approved++;
      else if (g === 'Rejected') map.Rejected++;
      else map.Pending++;
    });
    return map;
  }, [docs]);

  const chartData = useMemo(() => {
    const end = new Date();
    const days = rangeDays;
    const arr: number[] = new Array(days).fill(0);
    const labels: string[] = new Array(days).fill('');
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(end);
      d.setDate(end.getDate() - (days - 1 - i));
      labels[i] = d.toISOString().slice(5, 10);
    }
    docs.forEach((doc) => {
      const created = new Date(doc.createdAt);
      const diff = Math.floor((end.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
      if (diff >= 0 && diff < days) {
        const idx = days - 1 - diff;
        arr[idx]++;
      }
    });
    return { labels, values: arr };
  }, [docs, rangeDays]);

  function exportCsv() {
    const rows = [['Document Name', 'Status', 'Department', 'Date Created']];
    filtered.forEach((d) => rows.push([d.title, statusGroup(d), d.tags[0] || '', formatDate(d.createdAt)]));
    const csv = rows.map((r) => r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'docuflow_report.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportPdf() {
    // Simple fallback: open print dialog so user can save as PDF
    window.print();
  }

  return (
    <div className="container">
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, marginBottom:12}}>
        <div>
          <h2 style={{margin:0}}>Reports</h2>
          <div className="subtitle">Generate and view reports on document data.</div>
        </div>
        <div style={{display:'flex', gap:8}}>
          <button className="btn-secondary" onClick={exportPdf}>Export as PDF</button>
          <button className="btn-primary glow" onClick={exportCsv}>Export as CSV</button>
        </div>
      </div>

      <div className="grid-2" style={{alignItems:'start', gap:16}}>
        <div className="card">
          <h3 style={{marginTop:0}}>Report Criteria</h3>
          <div className="form">
            <div className="field">
              <label className="subtitle">Date Range</label>
              <select value={rangeDays} onChange={(e) => setRangeDays(Number(e.target.value))}>
                {DATE_RANGES.map((r) => (
                  <option key={r.days} value={r.days}>{r.label}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="subtitle">Document Status</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="field">
              <label className="subtitle">Department</label>
              <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value as any)}>
                <option value="All">All</option>
                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="field">
              <button className="btn-primary" onClick={() => { /* criteria is reactive */ }}>Generate Report</button>
            </div>
          </div>
        </div>

        <div>
          <div className="card" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12}}>
            <div style={{padding:12}}>
              <div className="subtitle">Documents by Status</div>
              <div style={{fontSize:28, fontWeight:700}}>{counts.Pending + counts.Approved + counts.Rejected}</div>
              <div style={{color:'var(--muted)'}}>Total <span style={{color:'var(--success)', marginLeft:8}}>+{Math.round(Math.random()*10)}%</span></div>
            </div>
            <div style={{padding:12}}>
              <div className="subtitle">Document Activity Over Time</div>
              <div style={{fontSize:28, fontWeight:700}}>{chartData.values.reduce((s,n)=>s+n,0)}</div>
              <div style={{color:'var(--muted)'}}>Total <span style={{color:'var(--success)', marginLeft:8}}>+{Math.round(Math.random()*8)}%</span></div>
            </div>
          </div>

          <div className="card" style={{marginBottom:12}}>
            <LineChart labels={chartData.labels} values={chartData.values} />
          </div>

          <div className="card table-card">
            <div className="title-row" style={{marginBottom:8}}>
              <h3 style={{margin:0}}>Documents</h3>
              <div className="toolbar-actions">
                <div className="subtitle">{filtered.length} results</div>
              </div>
            </div>
            <div className="table-scroll">
              <table className="df-table">
                <thead>
                  <tr>
                    <th>Document Name</th>
                    <th>Status</th>
                    <th>Department</th>
                    <th>Date Created</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && <tr><td colSpan={4} className="empty">Loading…</td></tr>}
                  {!loading && filtered.length === 0 && <tr><td colSpan={4} className="empty">No documents found</td></tr>}
                  {!loading && filtered.map((d) => (
                    <tr key={d.id}>
                      <td><div style={{fontWeight:600}}>{d.title}</div></td>
                      <td>
                        <span className={`state-badge ${d.workflowState === 'Approved' ? 'state-approved' : d.workflowState === 'Rejected' ? 'state-rejected' : 'state-submitted'}`}>{statusGroup(d)}</span>
                      </td>
                      <td>{d.tags[0] || '-'}</td>
                      <td>{formatDate(d.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


