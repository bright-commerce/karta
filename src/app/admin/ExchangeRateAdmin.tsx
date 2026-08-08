"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Edit2 } from "lucide-react";

export default function ExchangeRateAdmin() {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchRates = async () => {
    setIsLoading(true);
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

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center min-h-[200px]">
        <RefreshCw className="animate-spin text-indigo-500" size={24} />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {['INR', 'GBP', 'EUR'].map((currency, index) => {
          const glowColors = [
            'hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:border-indigo-500/50', // Indigo
            'hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:border-emerald-500/50', // Emerald
            'hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:border-purple-500/50' // Purple
          ];
          const textColors = [
            'text-indigo-500',
            'text-emerald-500',
            'text-purple-500'
          ];
          return (
            <div key={currency} className={`group flex flex-col p-6 bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl transition-all duration-500 ${glowColors[index]}`}>
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 text-xs font-black bg-white dark:bg-[#111113] border border-gray-100 dark:border-white/5 rounded-lg tracking-wider ${textColors[index]}`}>
                  {currency}
                </span>
                <button 
                  onClick={() => handleUpdate(currency)}
                  className="text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 bg-gray-900 p-2 rounded-full shadow-lg"
                  title="Edit Rate"
                >
                  <Edit2 size={14} />
                </button>
              </div>
              
              <div>
                <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                  {rates[currency] || 'N/A'}
                </p>
                <p className="text-xs font-medium text-gray-400 mt-2 uppercase tracking-widest">Base: 1 USD</p>
              </div>
              
              <button 
                onClick={() => handleUpdate(currency)}
                className={`mt-6 w-full py-2.5 bg-gray-50 dark:bg-[#111113] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-xl hover:bg-white dark:hover:bg-white/5 transition-all sm:hidden group-hover:block ${textColors[index]}`}
              >
                Update Rate
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-8 flex justify-end">
        <button 
          onClick={fetchRates}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-500 transition-colors bg-gray-50 dark:bg-[#111113] border border-gray-200 dark:border-white/10 px-4 py-2 rounded-xl hover:shadow-lg"
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          Sync Rates
        </button>
      </div>
    </div>
  );
}
