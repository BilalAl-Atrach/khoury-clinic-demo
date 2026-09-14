"use client";

import { useEffect } from "react";

export function usePageTitle(title: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = `${title} · Khoury Clinic`;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
