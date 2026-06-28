"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadForm({ products }: { products: any[] }) {
  const [file, setFile] = useState<File | null>(null);
  const [productId, setProductId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !productId) {
      setError("Please select both a file and a product.");
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append("file", file);
    formData.append("productId", productId);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      alert("File uploaded successfully to Cloudflare R2!");
      setFile(null);
      setProductId('');
      router.refresh(); // Refresh the server component to show the new linkage
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {error && <div style={{ color: 'red', fontSize: '0.875rem' }}>{error}</div>}
      
      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
          Select Product
        </label>
        <select 
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--muted)', color: 'var(--foreground)' }}
          required
        >
          <option value="" disabled>-- Select a product --</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
          File (ZIP, PDF, etc)
        </label>
        <input 
          type="file" 
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--muted)', color: 'var(--foreground)' }}
          required
        />
      </div>

      <button 
        type="submit" 
        className="btn-primary" 
        disabled={loading}
        style={{ marginTop: '1rem', padding: '0.75rem' }}
      >
        {loading ? "Uploading to Cloudflare R2..." : "Upload & Link File"}
      </button>
    </form>
  );
}
