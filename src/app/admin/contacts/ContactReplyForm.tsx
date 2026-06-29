"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContactReplyForm({ contactId, email }: { contactId: string, email: string }) {
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/reply-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId, email, reply })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send reply");

      alert("Reply sent successfully via Resend!");
      router.refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleReply} className="flex flex-col gap-3">
      <textarea
        required
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Type your reply here..."
        className="w-full p-3 border border-gray-200 dark:border-gray-800 rounded-lg text-sm bg-white dark:bg-gray-900"
        rows={4}
      />
      <button 
        type="submit" 
        disabled={loading}
        className="self-end bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Reply"}
      </button>
    </form>
  );
}
