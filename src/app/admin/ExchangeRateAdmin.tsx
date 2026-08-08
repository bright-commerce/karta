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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {['INR', 'GBP', 'EUR'].map(currency => (
          <div key={currency} className="group flex flex-col p-5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="px-2.5 py-1 text-xs font-bold bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-md">
                {currency}
              </span>
              <button 
                onClick={() => handleUpdate(currency)}
                className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Edit Rate"
              >
                <Edit2 size={16} />
              </button>
            </div>
            
            <div>
              <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                {rates[currency] || 'N/A'}
              </p>
              <p className="text-xs font-medium text-gray-500 mt-1">per 1 USD</p>
            </div>
            
            <button 
              onClick={() => handleUpdate(currency)}
              className="mt-4 w-full py-2 bg-white dark:bg-[#111113] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all sm:hidden group-hover:block"
            >
              Update
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <button 
          onClick={fetchRates}
          className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          Refresh Rates
        </button>
      </div>
    </div>
  );
}
