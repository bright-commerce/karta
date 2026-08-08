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
        {['INR', 'GBP', 'EUR'].map((currency) => {
          return (
            <div key={currency} className="group flex flex-col p-4 bg-gray-50 dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="px-2 py-0.5 text-[11px] font-bold bg-white dark:bg-[#0A0A0B] border border-gray-200 dark:border-[#27272A] rounded text-gray-900 dark:text-gray-100">
                  {currency}
                </span>
                <button 
                  onClick={() => handleUpdate(currency)}
                  className="text-gray-400 hover:text-black dark:hover:text-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Edit Rate"
                >
                  <Edit2 size={14} />
                </button>
              </div>
              
              <div>
                <p className="text-[24px] font-bold text-gray-900 dark:text-white tracking-tight leading-none mb-1">
                  {rates[currency] || 'N/A'}
                </p>
                <p className="text-[11px] font-medium text-gray-500">Base: 1 USD</p>
              </div>
              
              <button 
                onClick={() => handleUpdate(currency)}
                className="mt-4 w-full py-1.5 bg-white dark:bg-[#0A0A0B] border border-gray-200 dark:border-[#27272A] text-gray-700 dark:text-gray-300 text-[12px] font-medium rounded hover:bg-gray-50 dark:hover:bg-[#18181B] transition-colors sm:hidden group-hover:block"
              >
                Update
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex justify-end">
        <button 
          onClick={fetchRates}
          className="flex items-center gap-2 text-[12px] font-semibold text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors border border-gray-200 dark:border-[#27272A] bg-white dark:bg-[#0A0A0B] px-3 py-1.5 rounded"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          Sync
        </button>
      </div>
    </div>
  );
}
