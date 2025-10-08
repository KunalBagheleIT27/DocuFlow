export type WorkflowState = 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';

export type DocumentMeta = {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  workflowState: WorkflowState;
  tags: string[];
};

export type DocumentRecord = DocumentMeta & {
  content: string; // placeholder for file contents or summary
};

function load(): DocumentRecord[] {
  const raw = localStorage.getItem('docuflow_docs');
  return raw ? (JSON.parse(raw) as DocumentRecord[]) : [];
}

function save(docs: DocumentRecord[]) {
  localStorage.setItem('docuflow_docs', JSON.stringify(docs));
}

export const mockApi = {
  async list(query?: { search?: string; state?: WorkflowState | 'All' }) {
    await new Promise((r) => setTimeout(r, 200));
    let docs = load();
    if (query?.search) {
      const q = query.search.toLowerCase();
      docs = docs.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.author.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (query?.state && query.state !== 'All') {
      docs = docs.filter((d) => d.workflowState === query.state);
    }
    return docs.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },

  async create(input: { title: string; author: string; tags: string[]; content: string }) {
    await new Promise((r) => setTimeout(r, 300));
    const now = new Date().toISOString();
    const record: DocumentRecord = {
      id: crypto.randomUUID(),
      title: input.title,
      author: input.author,
      createdAt: now,
      updatedAt: now,
      workflowState: 'Draft',
      tags: input.tags,
      content: input.content,
    };
    const docs = load();
    docs.push(record);
    save(docs);
    return record;
  },

  async get(id: string) {
    await new Promise((r) => setTimeout(r, 200));
    const doc = load().find((d) => d.id === id);
    if (!doc) throw new Error('Document not found');
    return doc;
  },

  async update(id: string, changes: Partial<Pick<DocumentRecord, 'title' | 'tags' | 'content'>>) {
    await new Promise((r) => setTimeout(r, 250));
    const docs = load();
    const idx = docs.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error('Document not found');
    const updated = { ...docs[idx], ...changes, updatedAt: new Date().toISOString() };
    docs[idx] = updated;
    save(docs);
    return updated;
  },

  async setState(id: string, state: WorkflowState) {
    return this.update(id, { workflowState: state } as any);
  },

  async remove(id: string) {
    await new Promise((r) => setTimeout(r, 150));
    const docs = load().filter((d) => d.id !== id);
    save(docs);
  },
};



