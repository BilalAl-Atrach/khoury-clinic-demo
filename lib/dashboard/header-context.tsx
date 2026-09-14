"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface HeaderState {
  title: string;
  subtitle?: string;
}

interface HeaderContextValue extends HeaderState {
  setHeader: (state: HeaderState) => void;
}

const HeaderContext = createContext<HeaderContextValue | null>(null);

export function DashboardHeaderProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<HeaderState>({ title: "" });
  return (
    <HeaderContext.Provider value={{ ...state, setHeader: setState }}>{children}</HeaderContext.Provider>
  );
}

export function useDashboardHeaderContext() {
  const ctx = useContext(HeaderContext);
  if (!ctx) throw new Error("useDashboardHeaderContext must be used within DashboardHeaderProvider");
  return ctx;
}

export function useDashboardHeader(title: string, subtitle?: string) {
  const { setHeader } = useDashboardHeaderContext();
  useEffect(() => {
    setHeader({ title, subtitle });
  }, [title, subtitle, setHeader]);
}
