"use client";

import { useState } from "react";

export function ImageUploader() {
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    
    try {
      const res = await fetch("/api/admin/upload-asset", { 
        method: "POST", 
        body: formData 
      });
      const data = await res.json();
      if (res.ok) {
        setUrl(data.publicUrl);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch(err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <input type="text" name="imageUrl" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://... or upload below" className="w-full px-4 py-2 bg-gray-50 dark:bg-[#151521] border border-gray-200 dark:border-[#2B2B40] rounded-lg focus:outline-none focus:border-[#3699FF] text-gray-900 dark:text-white" />
      <div className="flex items-center gap-2 mt-1">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleUpload} 
          disabled={uploading} 
          className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#3699FF] file:text-white hover:file:bg-blue-600 cursor-pointer"
        />
        {uploading && <span className="text-xs text-[#3699FF] animate-pulse">Uploading to R2...</span>}
      </div>
    </div>
  );
}
