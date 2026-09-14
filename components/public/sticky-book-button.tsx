"use client";

import Link from "next/link";
import { CalendarPlus } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

export function StickyBookButton() {
  const { t } = useLanguage();
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--border)] bg-[var(--background)]/95 p-3 backdrop-blur-md sm:hidden">
      <Link
        href="/book"
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--navy)] text-sm font-medium text-[var(--ivory)] shadow-lg"
      >
        <CalendarPlus className="h-4 w-4" />
        {t.nav.bookNow}
      </Link>
    </div>
  );
}
