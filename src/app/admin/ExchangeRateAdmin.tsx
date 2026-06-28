"use client";

import { useState, useEffect } from "react";

export default function ExchangeRateAdmin() {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchRates = async () => {
    try {
      const res = await fetch("/api/rates");
      const data = await res.json();
      setRates(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleUpdate = async (currency: string) => {
    const newRate = prompt(`Enter new rate for ${currency} (relative to 1 USD):`, rates[currency]?.toString());
    if (newRate && !isNaN(parseFloat(newRate))) {
      try {
        const res = await fetch("/api/rates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currency, rate: newRate })
        });
        if (res.ok) {
          fetchRates();
        } else {
          alert("Failed to update rate.");
        }
      } catch (error) {
        alert("An error occurred while updating the rate.");
      }
    }
  };

  if (isLoading) return <p>Loading rates...</p>;

  return (
    <section style={{ marginTop: '4rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Exchange Rates (Base: 1 USD)</h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {['INR', 'GBP', 'EUR'].map(currency => (
          <div key={currency} style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '0.5rem', minWidth: '200px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{currency}</h3>
            <p style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>{rates[currency] || 'N/A'}</p>
            <button 
              onClick={() => handleUpdate(currency)}
              className="btn-primary" 
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              Update Rate
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
