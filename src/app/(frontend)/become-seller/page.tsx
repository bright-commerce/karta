"use client";

import { useState } from "react";

export default function BecomeSeller() {
  const [formData, setFormData] = useState({ name: "", businessName: "", email: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const joinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setFormData({ name: "", businessName: "", email: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="container" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--muted)', padding: '4rem', borderRadius: '2rem', maxWidth: '600px', width: '100%', border: '1px solid var(--border)', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '1rem' }}>Become a Seller</h1>
        <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem' }}>
          Join our exclusive waitlist and start selling your premium digital products on KARTA.
        </p>

        <form onSubmit={joinWaitlist} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="text"
            name="name"
            placeholder="Your Full Name"
            required
            style={{ padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }}
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="businessName"
            placeholder="Business / Store Name"
            required
            style={{ padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }}
            value={formData.businessName}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            style={{ padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)' }}
            value={formData.email}
            onChange={handleChange}
          />
          <button type="submit" className="btn-primary" style={{ marginTop: '1rem', padding: '1rem', borderRadius: '0.5rem' }} disabled={status === "loading"}>
            {status === "loading" ? "Submitting..." : "Join Waitlist"}
          </button>
        </form>

        {status === "success" && <p style={{ color: 'green', marginTop: '1.5rem', fontWeight: 600 }}>Thank you! You are on the list.</p>}
        {status === "error" && <p style={{ color: 'red', marginTop: '1.5rem', fontWeight: 600 }}>Something went wrong. Please try again.</p>}
      </div>
    </div>
  );
}
