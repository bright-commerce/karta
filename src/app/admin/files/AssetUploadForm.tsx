"use client";

import React, { useState } from 'react';

export default function AssetUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [publicUrl, setPublicUrl] = useState('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file.");
      return;
    }

    setLoading(true);
    setError('');
    setPublicUrl('');

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload-asset", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setPublicUrl(data.publicUrl);
      setFile(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (publicUrl) {
      navigator.clipboard.writeText(publicUrl);
      alert("URL copied to clipboard!");
    }
  };

  return (
    <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {error && <div style={{ color: 'red', fontSize: '0.875rem' }}>{error}</div>}
      
      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
          Image/Video File
        </label>
        <input 
          type="file" 
          accept="image/*,video/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--muted)', color: 'var(--foreground)' }}
          required
        />
      </div>

      <button 
        type="submit" 
        className="btn-silver" 
        disabled={loading}
        style={{ marginTop: '1rem', padding: '0.75rem' }}
      >
        {loading ? "Uploading to Assets..." : "Upload Asset"}
      </button>

      {publicUrl && (
        <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid green', borderRadius: '0.5rem', background: 'rgba(0,255,0,0.05)' }}>
          <p style={{ fontWeight: 600, color: 'green', marginBottom: '0.5rem' }}>Upload Successful!</p>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input 
              type="text" 
              readOnly 
              value={publicUrl} 
              style={{ flex: 1, padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }} 
            />
            <button type="button" onClick={copyToClipboard} className="btn-primary" style={{ padding: '0.5rem 1rem' }}>
              Copy
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
