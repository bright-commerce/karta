"use client";

import { useState } from "react";
import styles from "../app/page.module.css";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const joinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: "Homepage Visitor", businessName: "Unknown" }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div style={{ marginTop: '3rem', padding: '2rem', background: 'var(--muted)', borderRadius: '1rem', textAlign: 'center' }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Join the Waitlist</h3>
      <p style={{ color: 'var(--muted-foreground)', marginBottom: '1.5rem' }}>Get notified about new premium products.</p>
      
      {status === 'success' ? (
        <div style={{ color: 'green', fontWeight: 600 }}>Thanks for joining!</div>
      ) : (
        <form onSubmit={joinWaitlist} style={{ display: 'flex', gap: '1rem', maxWidth: '400px', margin: '0 auto' }}>
          <input 
            type="email" 
            placeholder="Enter your email..." 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--background)' }}
          />
          <button type="submit" disabled={status === 'loading'} className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
            {status === 'loading' ? 'Joining...' : 'Join'}
          </button>
        </form>
      )}
      {status === 'error' && <div style={{ color: 'red', marginTop: '1rem' }}>Something went wrong.</div>}
    </div>
  );
}
