"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Currency = 'USD' | 'INR' | 'GBP' | 'EUR';

interface Rates {
  [key: string]: number;
}

interface CurrencyContextType {
  currency: Currency;
  rates: Rates;
  setCurrency: (c: Currency) => void;
  formatPrice: (usdPrice: number) => string;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  rates: { USD: 1, INR: 83, GBP: 0.79, EUR: 0.92 }, // Fallback default rates
  setCurrency: () => {},
  formatPrice: (usdPrice: number) => `$${usdPrice.toFixed(2)}`,
  isLoading: true,
});

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [rates, setRates] = useState<Rates>({ USD: 1, INR: 83, GBP: 0.79, EUR: 0.92 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initCurrency() {
      try {
        // 1. Fetch live rates from our backend
        const rateRes = await fetch('/api/rates');
        if (rateRes.ok) {
          const fetchedRates = await rateRes.json();
          setRates(fetchedRates);
        }

        // 2. Determine User Location/Currency
        const savedCurrency = localStorage.getItem('karta_currency') as Currency | null;
        if (savedCurrency && ['USD', 'INR', 'GBP', 'EUR'].includes(savedCurrency)) {
          setCurrency(savedCurrency);
        } else {
          // Auto-detect
          const geoRes = await fetch('https://ipapi.co/json/');
          if (geoRes.ok) {
            const data = await geoRes.json();
            const detected = data.currency;
            if (['INR', 'GBP', 'EUR'].includes(detected)) {
              setCurrency(detected as Currency);
            } else {
              setCurrency('USD'); // Default for rest of world
            }
          }
        }
      } catch (error) {
        console.error("Error initializing currency:", error);
      } finally {
        setIsLoading(false);
      }
    }

    initCurrency();
  }, []);

  // Update local storage whenever currency changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('karta_currency', currency);
    }
  }, [currency, isLoading]);

  const formatPrice = (usdPrice: number) => {
    const rate = rates[currency] || 1;
    const localPrice = usdPrice * rate;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(localPrice);
  };

  return (
    <CurrencyContext.Provider value={{ currency, rates, setCurrency, formatPrice, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
