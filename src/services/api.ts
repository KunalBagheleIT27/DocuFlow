import { DocumentRecord, WorkflowState } from './mockApi';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api';

export const api = {
  async listDocuments(): Promise<DocumentRecord[]> {
    try {
      const res = await fetch(`${API_BASE}/documents`);
      if (!res.ok) throw new Error('failed');
      const data = await res.json();
      // Map backend minimal metadata to frontend shape; content omitted
      return (data as any[]).map((d) => ({ ...d, content: '' }));
    } catch {
      // fallback to local mock
      const { mockApi } = await import('./mockApi');
      return mockApi.list();
    }
  },

  async uploadDocument(form: { title: string; author: string; tags: string[]; file?: File; content?: string }) {
    try {
      if (form.file) {
        const fd = new FormData();
        fd.append('title', form.title);
        fd.append('author', form.author);
        form.tags.forEach((t) => fd.append('tags', t));
        fd.append('file', form.file);
        const res = await fetch(`${API_BASE}/documents`, { method: 'POST', body: fd });
        if (!res.ok) throw new Error('failed');
        return await res.json();
      }
      throw new Error('no file');
    } catch {
      const { mockApi } = await import('./mockApi');
      return mockApi.create({ title: form.title, author: form.author, tags: form.tags, content: form.content || '' });
    }
  },

  async setWorkflow(id: string, state: WorkflowState) {
    try {
      const res = await fetch(`${API_BASE}/workflow/${id}/state?state=${encodeURIComponent(state)}`, { method: 'POST' });
      if (!res.ok) throw new Error('failed');
    } catch {
      const { mockApi } = await import('./mockApi');
      await mockApi.setState(id, state);
    }
  },
};


