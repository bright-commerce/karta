"use client";

import { CurrencyProvider } from "@/context/CurrencyContext";
import { StoreProvider } from "@/context/StoreContext";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <StoreProvider>
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
      </StoreProvider>
    </SessionProvider>
  );
}
