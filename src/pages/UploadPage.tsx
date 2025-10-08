import React, { useState } from 'react';
import { mockApi } from '../services/mockApi';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaFilePdf, FaFileWord, FaCloudUploadAlt } from 'react-icons/fa';

export default function UploadPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string>('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title || (!content && !file)) {
      setError('Title and content or file are required');
      return;
    }
    setLoading(true);
    try {
      let record;
      if (file) {
        record = await api.uploadDocument({
          title,
          author: user?.username || 'anonymous',
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
          file,
        } as any);
      } else {
        let storedContent = content;
        const created = await mockApi.create({
          title,
          author: user?.username || 'anonymous',
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
          content: storedContent,
        });
        record = created;
      }
      navigate(`/documents/${record.id}`);
    } catch (err) {
      setError('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Upload Document</h2>
      <form className="card form" onSubmit={onSubmit}>
        {error && <div className="alert error">{error}</div>}
        <label className="field">
          <span>Title</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title" />
        </label>
        <label className="field">
          <span>Tags</span>
          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="comma,separated,tags" />
        </label>
        <div className="grid-2">
          <label className="field">
            <span>Upload File (PDF/DOC/DOCX)</span>
            <input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            {file && (
              <div className="file-chip">
                {file.type.includes('pdf') ? <FaFilePdf /> : <FaFileWord />} <span>{file.name}</span>
              </div>
            )}
          </label>
          <label className="field">
            <span>Or Paste Text Content</span>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Paste text (simulating file contents)"></textarea>
          </label>
        </div>
        <button className="btn-primary glow" type="submit" disabled={loading}>{loading ? 'Uploading…' : (<><FaCloudUploadAlt style={{ marginRight: 6 }} /> Upload</>)}</button>
      </form>
    </div>
  );
}



