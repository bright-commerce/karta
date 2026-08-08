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
        {['INR', 'GBP', 'EUR'].map((currency) => {
          return (
            <div key={currency} className="group flex flex-col p-5 bg-[#151521] border border-[#2B2B40] rounded-xl hover:border-[#3699FF] transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="px-2 py-0.5 text-[11px] font-bold bg-[#1E1E2D] border border-[#2B2B40] rounded text-white tracking-widest">
                  {currency}
                </span>
                <button 
                  onClick={() => handleUpdate(currency)}
                  className="text-[#6c7293] hover:text-[#3699FF] transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Edit Rate"
                >
                  <Edit2 size={14} />
                </button>
              </div>
              
              <div>
                <p className="text-[26px] font-bold text-white tracking-tight leading-none mb-1.5">
                  {rates[currency] || 'N/A'}
                </p>
                <p className="text-[11px] font-medium text-[#6c7293]">Base: 1 USD</p>
              </div>
              
              <button 
                onClick={() => handleUpdate(currency)}
                className="mt-5 w-full py-1.5 bg-[#1E1E2D] border border-[#2B2B40] text-white text-[12px] font-medium rounded hover:bg-[#3699FF] hover:border-[#3699FF] transition-colors sm:hidden group-hover:block"
              >
                Update
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-8 flex justify-end">
        <button 
          onClick={fetchRates}
          className="flex items-center gap-2 text-[12px] font-semibold text-[#6c7293] hover:text-white transition-colors border border-[#2B2B40] bg-[#151521] px-4 py-2 rounded-lg hover:border-[#3699FF]"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin text-[#3699FF]" : ""} />
          Sync Rates
        </button>
      </div>
    </div>
  );
}
