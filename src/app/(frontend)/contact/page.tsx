"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-24 max-w-2xl mx-auto">
      <h1 className="text-4xl font-black mb-4">Contact Us</h1>
      <p className="text-gray-500 mb-8">Have a question or want to work together? Send us a message.</p>

      {success ? (
        <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-xl text-center">
          <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
          <p>Thanks for reaching out. We will get back to you shortly.</p>
          <button 
            onClick={() => setSuccess(false)}
            className="mt-6 text-sm font-semibold underline text-green-900"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col gap-6">
          {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Name</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="John Doe"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="john@example.com"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Message</label>
            <textarea
              required
              rows={5}
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black resize-none"
              placeholder="How can we help you?"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-black text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      )}
    </div>
  );
}
