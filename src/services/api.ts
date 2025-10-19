import { DocumentRecord, WorkflowState } from "./mockApi";

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE || "http://localhost:9090/api";

export const api: any = {
  async listDocuments(): Promise<DocumentRecord[]> {
    try {
      const headers: any = {};
      const raw = localStorage.getItem("docuflow_user");
      if (raw) {
        try {
          const u = JSON.parse(raw);
          headers["X-USER"] = u.username;
          headers["X-ROLE"] = u.role;
        } catch {}
      }
      const res = await fetch(`${API_BASE}/documents`, { headers });
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      // Map backend minimal metadata to frontend shape; content omitted
      return (data as any[]).map((d) => ({ ...d, content: "" }));
    } catch {
      // fallback to local mock
      const { mockApi } = await import("./mockApi");
      return mockApi.list();
    }
  },

  async listInbox(): Promise<DocumentRecord[]> {
    try {
      const headers: any = {};
      const raw = localStorage.getItem("docuflow_user");
      if (raw) {
        try {
          const u = JSON.parse(raw);
          headers["X-USER"] = u.username;
          headers["X-ROLE"] = u.role;
        } catch {}
      }
      const res = await fetch(`${API_BASE}/documents`, { headers });
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      return (data as any[]).map((d) => ({ ...d, content: "" }));
    } catch {
      const { mockApi } = await import("./mockApi");
      // for inbox, treat Submitted/Under Review as pending tasks
      const docs = await mockApi.list();
      return docs.filter(
        (d) =>
          d.workflowState === "Submitted" || d.workflowState === "Under Review"
      );
    }
  },

  async listTemplates() {
    try {
      const res = await fetch(`${API_BASE}/templates`);
      if (!res.ok) throw new Error("failed");
      return await res.json();
    } catch {
      return [] as any[];
    }
  },

  async uploadDocument(form: {
    title: string;
    author: string;
    tags: string[];
    file?: File;
    content?: string;
  }) {
    try {
      if (form.file) {
        const fd = new FormData();
        fd.append("title", form.title);
        fd.append("author", form.author);
        form.tags.forEach((t) => fd.append("tags", t));
        fd.append("file", form.file);
        const headers: any = {};
        const raw = localStorage.getItem("docuflow_user");
        if (raw) {
          try {
            const u = JSON.parse(raw);
            headers["X-USER"] = u.username;
            headers["X-ROLE"] = u.role;
          } catch {}
        }
        const res = await fetch(`${API_BASE}/documents`, {
          method: "POST",
          body: fd,
          headers,
        });
        if (!res.ok) throw new Error("failed");
        return await res.json();
      }
      // send inline text content as multipart too for backend persistence
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("author", form.author);
      form.tags.forEach((t) => fd.append("tags", t));
      if (form.content) fd.append("content", form.content);
      const headers: any = {};
      const raw = localStorage.getItem("docuflow_user");
      if (raw) {
        try {
          const u = JSON.parse(raw);
          headers["X-USER"] = u.username;
          headers["X-ROLE"] = u.role;
        } catch {}
      }
      const res = await fetch(`${API_BASE}/documents`, {
        method: "POST",
        body: fd,
        headers,
      });
      if (!res.ok) throw new Error("failed");
      return await res.json();
    } catch {
      const { mockApi } = await import("./mockApi");
      return mockApi.create({
        title: form.title,
        author: form.author,
        tags: form.tags,
        content: form.content || "",
      });
    }
  },
  async getDocument(id: string) {
    try {
      const headers: any = {};
      const raw = localStorage.getItem("docuflow_user");
      if (raw) {
        try {
          const u = JSON.parse(raw);
          headers["X-USER"] = u.username;
          headers["X-ROLE"] = u.role;
        } catch {}
      }
      const res = await fetch(`${API_BASE}/documents/${id}`, { headers });
      if (!res.ok) throw new Error("failed");
      return await res.json();
    } catch {
      const { mockApi } = await import("./mockApi");
      return mockApi.get(id);
    }
  },

  async getAudits(documentId: string) {
    try {
      const res = await fetch(`${API_BASE}/audits/document/${documentId}`);
      if (!res.ok) throw new Error("failed");
      return await res.json();
    } catch {
      return [] as any[];
    }
  },

  async listNotifications(username: string) {
    try {
      const res = await fetch(
        `${API_BASE}/notifications/user/${encodeURIComponent(username)}`
      );
      if (!res.ok) throw new Error("failed");
      return await res.json();
    } catch {
      return [] as any[];
    }
  },

  async createNotification(username: string, message: string) {
    try {
      const res = await fetch(`${API_BASE}/notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, message }),
      });
      if (!res.ok) throw new Error("failed");
      return await res.json();
    } catch {
      return null;
    }
  },

  async setWorkflow(id: string, state: WorkflowState, actor?: string) {
    try {
      const url =
        `${API_BASE}/workflow/${id}/state?state=${encodeURIComponent(state)}` +
        (actor ? `&actor=${encodeURIComponent(actor)}` : "");
      const headers: any = {};
      const raw = localStorage.getItem("docuflow_user");
      if (raw) {
        try {
          const u = JSON.parse(raw);
          headers["X-USER"] = u.username;
          headers["X-ROLE"] = u.role;
        } catch {}
      }
      const res = await fetch(url, { method: "POST", headers });
      if (!res.ok) throw new Error("failed");
      // refresh document
      return await this.getDocument(id);
    } catch {
      const { mockApi } = await import("./mockApi");
      await mockApi.setState(id, state);
      return await mockApi.get(id);
    }
  },
};
